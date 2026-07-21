import { db } from './db.ts';
import { usuarios, produtos, pedidos, itensPedido } from '../schemas/db_schema.ts';
import argon2 from 'argon2';
import { rodarMigracoes } from './migrate.ts';

async function seed() {
  console.log('🌱 Iniciando semeação do banco de dados (seed)...');

  try {
    // Executa as migrações no banco SQLite para garantir que as tabelas existam
    await rodarMigracoes();
    // 1. Limpar tabelas para evitar duplicidade no SQLite local
    await db.delete(itensPedido);
    await db.delete(pedidos);
    await db.delete(produtos);
    await db.delete(usuarios);

    console.log('🧹 Tabelas limpas.');

    // 2. Criar Usuários com diferentes níveis (RBAC) e hashes seguros via argon2
    const senhaAdminHash = await argon2.hash('teste');
    const senhaSuperuserHash = await argon2.hash('teste');

    const [adminUser] = await db.insert(usuarios).values({
      nome: 'Sandra (Dona da Loja)',
      email: 'sandra@atelie.com',
      senhaHash: senhaAdminHash,
      role: 'ADMIN',
    }).returning();

    const [superUser] = await db.insert(usuarios).values({
      nome: 'Desenvolvedor Fallback',
      email: 'dev@atelie.com',
      senhaHash: senhaSuperuserHash,
      role: 'SUPERUSER',
    }).returning();

    console.log('👤 Usuários ADMIN e SUPERUSER criados com sucesso!');

    // 3. Criar Produtos com custo de produção, preço de venda, rascunhos e deletados
    const [p1] = await db.insert(produtos).values({
      nome: 'Ursinho de Pelúcia Sonho',
      precoVenda: 89.90,
      custoProducao: 30.00,
      imagem: 'https://images.unsplash.com/photo-1559251606-c623743a6d76?q=80&w=600&auto=format&fit=crop',
      tag3D: false,
      isRascunho: false,
    }).returning();

    const [p2] = await db.insert(produtos).values({
      nome: 'Móbile de Berço Estrelado',
      precoVenda: 149.90,
      custoProducao: 50.00,
      imagem: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=600&auto=format&fit=crop',
      tag3D: false,
      isRascunho: false,
    }).returning();

    const [p3] = await db.insert(produtos).values({
      nome: 'Luminária Balão Mágico (Impressão 3D)',
      precoVenda: 120.00,
      custoProducao: 45.00,
      imagem: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600&auto=format&fit=crop',
      tag3D: true,
      isRascunho: false,
    }).returning();

    // Produto Rascunho (Não visível no site principal)
    await db.insert(produtos).values({
      nome: 'Chaveiro de Coração (Protótipo)',
      precoVenda: 15.00,
      custoProducao: 4.00,
      imagem: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=600&auto=format&fit=crop',
      tag3D: true,
      isRascunho: true,
    });

    // Produto Deletado via Soft Delete
    await db.insert(produtos).values({
      nome: 'Vaso Antigo de Barro',
      precoVenda: 60.00,
      custoProducao: 25.00,
      imagem: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600&auto=format&fit=crop',
      tag3D: false,
      isRascunho: false,
      deletedAt: new Date().toISOString(),
    });

    console.log('📦 Catálogo de produtos cadastrado (ativos, rascunhos e soft-deletados).');

    // 4. Criar Pedidos de teste para gerar métricas no Dashboard
    // Pedido 1: Entregue (faturamento do mês atual)
    const [ped1] = await db.insert(pedidos).values({
      clienteNome: 'Mariana Silva',
      clienteTelefone: '11999999999',
      statusProducao: 'entregue',
      statusFinanceiro: 'totalmente_pago',
      custoMaterialManual: 10.00, // Custo fixo extra manual informado pela admin
    }).returning();

    // Pedido 2: Em Produção, com sinal pago (entra no faturamento)
    const [ped2] = await db.insert(pedidos).values({
      clienteNome: 'Rodrigo Costa',
      clienteTelefone: '21988888888',
      statusProducao: 'em_producao',
      statusFinanceiro: 'sinal_pago',
      custoMaterialManual: 5.00,
    }).returning();

    // Pedido 3: Aguardando Sinal (pendente, sem faturamento ainda)
    const [ped3] = await db.insert(pedidos).values({
      clienteNome: 'Carla Souza',
      clienteTelefone: '31977777777',
      statusProducao: 'aguardando_sinal',
      statusFinanceiro: 'pendente',
      custoMaterialManual: 0.00,
    }).returning();

    console.log('📋 Pedidos criados.');

    // 5. Associar Itens de Pedido Gravando Historicamente o Preço e Custo da Época
    await db.insert(itensPedido).values([
      {
        pedidoId: ped1.id,
        produtoId: p1.id,
        quantidade: 1,
        precoUnitarioHistorico: p1.precoVenda, // 89.90
        custoUnitarioHistorico: p1.custoProducao, // 30.00
      },
      {
        pedidoId: ped1.id,
        produtoId: p3.id,
        quantidade: 2,
        precoUnitarioHistorico: p3.precoVenda, // 120.00
        custoUnitarioHistorico: p3.custoProducao, // 45.00
      },
      {
        pedidoId: ped2.id,
        produtoId: p2.id,
        quantidade: 1,
        precoUnitarioHistorico: p2.precoVenda, // 149.90
        custoUnitarioHistorico: p2.custoProducao, // 50.00
      },
      {
        pedidoId: ped3.id,
        produtoId: p1.id,
        quantidade: 1,
        precoUnitarioHistorico: p1.precoVenda, // 89.90
        custoUnitarioHistorico: p1.custoProducao, // 30.00
      }
    ]);

    console.log('✅ Histórico imutável de itens dos pedidos populado!');
    console.log('🚀 Seed concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro no seed:', error);
  }
}

seed();
