import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// 1. Tabela de Usuários (Autenticação e RBAC)
export const usuarios = sqliteTable('usuarios', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  nome: text('nome').notNull(),
  email: text('email').notNull().unique(),
  senhaHash: text('senha_hash').notNull(),
  role: text('role', { enum: ['ADMIN', 'SUPERUSER'] }).notNull().default('ADMIN'),
  criadoEm: text('criado_em').default(sql`CURRENT_TIMESTAMP`),
});

// 2. Tabela de Produtos (com Soft Delete, Rascunho e Estoque)
export const produtos = sqliteTable('produtos', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  nome: text('nome').notNull(),
  precoVenda: real('preco_venda').notNull(),
  custoProducao: real('custo_producao').notNull(),
  imagem: text('imagem').notNull(),
  tag3D: integer('tag3d', { mode: 'boolean' }).notNull().default(false),
  isRascunho: integer('is_rascunho', { mode: 'boolean' }).notNull().default(false),
  quantidadeEstoque: integer('quantidade_estoque').notNull().default(0), // Quantidade física à venda
  deletedAt: text('deleted_at'), // Para Soft Delete
  criadoEm: text('criado_em').default(sql`CURRENT_TIMESTAMP`),
});

// 3. Tabela de Pedidos (Status de Produção e Status Financeiro)
export const pedidos = sqliteTable('pedidos', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  clienteNome: text('cliente_nome').notNull(),
  clienteTelefone: text('cliente_telefone').notNull(),
  // Status de Produção: 'rascunho', 'aguardando_sinal', 'em_producao', 'pronto', 'entregue', 'cancelado'
  statusProducao: text('status_producao', { 
    enum: ['rascunho', 'aguardando_sinal', 'em_producao', 'pronto', 'entregue', 'cancelado'] 
  }).notNull().default('rascunho'),
  // Status Financeiro: 'pendente', 'sinal_pago', 'totalmente_pago'
  statusFinanceiro: text('status_financeiro', { 
    enum: ['pendente', 'sinal_pago', 'totalmente_pago'] 
  }).notNull().default('pendente'),
  custoMaterialManual: real('custo_material_manual').notNull().default(0), // Custo preenchido manualmente
  criadoEm: text('criado_em').default(sql`CURRENT_TIMESTAMP`),
  atualizadoEm: text('atualizado_em').default(sql`CURRENT_TIMESTAMP`),
});

// 4. Tabela de Itens de Pedido (Com histórico financeiro imutável)
export const itensPedido = sqliteTable('itens_pedido', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  pedidoId: text('pedido_id').notNull().references(() => pedidos.id),
  produtoId: text('produto_id').notNull().references(() => produtos.id),
  quantidade: integer('quantidade').notNull().default(1),
  // OBRIGATÓRIO: Armazena o preço e custo na hora exata do pedido para relatórios históricos
  precoUnitarioHistorico: real('preco_unitario_historico').notNull(),
  custoUnitarioHistorico: real('custo_unitario_historico').notNull(),
});

// 5. Tabela de Tokens Invalidados (Prevenção de Ghost Sessions após logout)
export const tokensInvalidados = sqliteTable('tokens_invalidados', {
  token: text('token').primaryKey(),
  expiracao: integer('expiracao').notNull(), // Epoch timestamp
});
