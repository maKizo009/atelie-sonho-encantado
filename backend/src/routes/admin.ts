import type { FastifyInstance } from 'fastify';
import { db } from '../config/db.ts';
import { usuarios, produtos, pedidos, itensPedido, tokensInvalidados } from '../schemas/db_schema.ts';
import { eq, and, isNull, sql } from 'drizzle-orm';
import argon2 from 'argon2';
import { randomUUID } from 'crypto';
import { validarJWT, verificarRole } from '../middleware/auth.ts';
import { validarCSRF } from '../middleware/csrf.ts';
import { sanitizarObjeto } from '../utils/sanitize.ts';
import { gerarLinkWhatsApp } from '../utils/whatsapp.ts';

export async function rotasAdmin(app: FastifyInstance) {
  
  // ==========================================
  // 1. ROTA DE LOGIN (Gera JWT & CSRF Token)
  // ==========================================
  app.post('/auth/login', async (request, reply) => {
    // Sanitiza e higieniza as entradas contra XSS
    const { email, senha } = sanitizarObjeto(request.body as any);

    // SQL Injection: Consultas parametrizadas do Drizzle ORM impedem injeção SQL nativamente
    const userList = await db.select()
      .from(usuarios)
      .where(eq(usuarios.email, email))
      .limit(1);

    if (userList.length === 0) {
      return reply.status(401).send({ error: 'Credenciais inválidas' });
    }

    const usuario = userList[0];
    const senhaValida = await argon2.verify(usuario.senhaHash, senha);

    if (!senhaValida) {
      return reply.status(401).send({ error: 'Credenciais inválidas' });
    }

    // Gera tokens únicos para prevenção de CSRF
    const csrfToken = randomUUID();
    const tokenJti = randomUUID(); // ID do token para evitar ghost sessions

    // Assina o JWT contendo a Role e o token CSRF
    const token = app.jwt.sign({ 
      id: usuario.id, 
      role: usuario.role,
      csrfToken: csrfToken,
      jti: tokenJti 
    }, { expiresIn: '2h' });

    return reply.send({
      token,
      csrfToken,
      user: { id: usuario.id, nome: usuario.nome, role: usuario.role }
    });
  });

  // ==========================================
  // 2. ROTA DE LOGOUT (Blacklist de Token)
  // ==========================================
  app.post('/auth/logout', { preHandler: [validarJWT] }, async (request, reply) => {
    const payload = request.user as { jti?: string; exp?: number };
    
    if (payload.jti && payload.exp) {
      // Adiciona o token à lista de invalidados para matar a sessão imediatamente
      await db.insert(tokensInvalidados).values({
        token: payload.jti,
        expiracao: payload.exp,
      });
    }

    return reply.send({ message: 'Sessão encerrada com sucesso.' });
  });

  // ==========================================
  // 3. DASHBOARD EXECUTIVO (Métricas Financeiras)
  // ==========================================
  app.get('/admin/dashboard', { 
    preHandler: [validarJWT, verificarRole(['ADMIN', 'SUPERUSER'])] 
  }, async (request, reply) => {
    
    // Obter mês e ano atual
    const mesAtualStr = new Date().toISOString().substring(0, 7); // "YYYY-MM"

    // a) Faturamento Total do Mês (soma dos pedidos com status_producao 'entregue' OU status_financeiro 'sinal_pago')
    // Usamos SQL Injection safe queries
    const resultFaturamento = await db.select({
      total: sql<number>`SUM(${itensPedido.precoUnitarioHistorico} * ${itensPedido.quantidade})`
    })
    .from(itensPedido)
    .innerJoin(pedidos, eq(itensPedido.pedidoId, pedidos.id))
    .where(and(
      sql`strftime('%Y-%m', ${pedidos.criadoEm}) = ${mesAtualStr}`,
      sql`(${pedidos.statusProducao} = 'entregue' OR ${pedidos.statusFinanceiro} = 'sinal_pago' OR ${pedidos.statusFinanceiro} = 'totalmente_pago')`
    ));

    const faturamentoTotal = resultFaturamento[0]?.total || 0;

    // b) Custo de material no mês (Soma manual informada pela admin)
    const resultMaterial = await db.select({
      total: sql<number>`SUM(${pedidos.custoMaterialManual})`
    })
    .from(pedidos)
    .where(sql`strftime('%Y-%m', ${pedidos.criadoEm}) = ${mesAtualStr}`);

    const custoMaterial = resultMaterial[0]?.total || 0;

    // c) Custo de Produção do Mês (soma dos custos históricos das peças produzidas)
    const resultCustoProducao = await db.select({
      total: sql<number>`SUM(${itensPedido.custoUnitarioHistorico} * ${itensPedido.quantidade})`
    })
    .from(itensPedido)
    .innerJoin(pedidos, eq(itensPedido.pedidoId, pedidos.id))
    .where(sql`strftime('%Y-%m', ${pedidos.criadoEm}) = ${mesAtualStr}`);

    const custoProducao = resultCustoProducao[0]?.total || 0;

    // d) Lucro Líquido Real (Faturamento - Custos)
    const lucroLiquido = faturamentoTotal - (custoMaterial + custoProducao);

    // e) Pedidos Pendentes em Produção (Quantidade de pedidos não cancelados ou entregues)
    const resultPendentes = await db.select({
      count: sql<number>`COUNT(${pedidos.id})`
    })
    .from(pedidos)
    .where(sql`${pedidos.statusProducao} NOT IN ('entregue', 'cancelado', 'rascunho')`);

    const pedidosPendentes = resultPendentes[0]?.count || 0;

    return reply.send({
      faturamentoTotal,
      custoMaterial,
      custoProducao,
      lucroLiquido,
      pedidosPendentes
    });
  });

  // ==========================================
  // 4. PRODUTOS CRUD (com Rascunho e Soft Delete)
  // ==========================================
  app.get('/admin/produtos', {
    preHandler: [validarJWT, verificarRole(['ADMIN', 'SUPERUSER'])]
  }, async (request, reply) => {
    // Retorna todos os produtos ativos (não deletados via soft delete)
    const lista = await db.select()
      .from(produtos)
      .where(isNull(produtos.deletedAt));
    
    return reply.send(lista);
  });

  app.post('/admin/produtos', {
    preHandler: [validarJWT, verificarCSRF, verificarRole(['ADMIN', 'SUPERUSER'])]
  }, async (request, reply) => {
    // Sanitização de entradas contra XSS
    const cleanBody = sanitizarObjeto(request.body as any);
    const { nome, precoVenda, custoProducao, imagem, tag3D, isRascunho } = cleanBody;

    const novo = await db.insert(produtos).values({
      nome,
      precoVenda: Number(precoVenda),
      custoProducao: Number(custoProducao),
      imagem,
      tag3D: !!tag3D,
      isRascunho: !!isRascunho
    }).returning();

    return reply.status(201).send(novo[0]);
  });

  app.delete('/admin/produtos/:id', {
    preHandler: [validarJWT, verificarCSRF, verificarRole(['ADMIN', 'SUPERUSER'])]
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    
    // Soft Delete: Apenas atualiza 'deleted_at' em vez de expurgar a linha
    await db.update(produtos)
      .set({ deletedAt: new Date().toISOString() })
      .where(eq(produtos.id, id));

    return reply.send({ message: 'Produto arquivado com sucesso (soft-delete).' });
  });

  // ==========================================
  // 5. ATUALIZAÇÃO DE PEDIDOS & WHATSAPP
  // ==========================================
  app.put('/admin/pedidos/:id/status', {
    preHandler: [validarJWT, verificarCSRF, verificarRole(['ADMIN', 'SUPERUSER'])]
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { statusProducao, statusFinanceiro } = sanitizarObjeto(request.body as any);

    // Atualiza status do pedido
    await db.update(pedidos)
      .set({ 
        statusProducao, 
        statusFinanceiro,
        atualizadoEm: new Date().toISOString()
      })
      .where(eq(pedidos.id, id));

    // Busca dados do cliente para gerar link do whatsapp correspondente
    const ped = await db.select().from(pedidos).where(eq(pedidos.id, id)).limit(1);

    if (ped.length > 0) {
      const linkWhatsApp = gerarLinkWhatsApp(
        ped[0].clienteTelefone,
        ped[0].clienteNome,
        ped[0].id,
        statusProducao
      );
      return reply.send({ 
        message: 'Status atualizado com sucesso!', 
        pedido: ped[0],
        linkWhatsApp 
      });
    }

    return reply.status(404).send({ error: 'Pedido não encontrado' });
  });
}
