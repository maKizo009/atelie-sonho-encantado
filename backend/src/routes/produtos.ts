import type { FastifyInstance } from 'fastify';
import { db } from '../config/db.ts';
import { produtos, pedidos, itensPedido } from '../schemas/db_schema.ts';
import { eq, and, isNull } from 'drizzle-orm';
import { z } from 'zod';
import { sanitizarObjeto } from '../utils/sanitize.ts';

// Esquema de Validação para a criação de novos pedidos (Checkout do cliente)
const CheckoutItemSchema = z.object({
  produtoId: z.string().uuid().or(z.string()),
  quantidade: z.number().int().positive({ message: "A quantidade deve ser de no mínimo 1" }),
});

const CheckoutSchema = z.object({
  clienteNome: z.string().min(2, { message: "O nome deve conter pelo menos 2 caracteres" }),
  clienteTelefone: z.string().min(8, { message: "Telefone inválido" }),
  custoMaterialManual: z.number().optional().default(0),
  itens: z.array(CheckoutItemSchema).min(1, { message: "O pedido deve ter pelo menos 1 item" }),
});

export async function rotasProdutos(app: FastifyInstance) {
  
  // ========================================================
  // 1. LISTAR PRODUTOS PÚBLICOS (Sem rascunhos ou deletados)
  // ========================================================
  app.get('/produtos', async (request, reply) => {
    // Retorna apenas produtos que não são rascunhos e não foram deletados
    const lista = await db.select({
      id: produtos.id,
      nome: produtos.nome,
      preco: produtos.precoVenda,
      imagem: produtos.imagem,
      tag3D: produtos.tag3D,
      quantidadeEstoque: produtos.quantidadeEstoque
    })
    .from(produtos)
    .where(and(
      eq(produtos.isRascunho, false),
      isNull(produtos.deletedAt)
    ));

    return reply.send(lista);
  });

  // ========================================================
  // 2. CHECKOUT DE PEDIDO (Com redução atômica de estoque)
  // ========================================================
  app.post('/pedidos', async (request, reply) => {
    // Valida os dados de entrada usando Zod
    const validationResult = CheckoutSchema.safeParse(request.body);
    if (!validationResult.success) {
      return reply.status(400).send({
        error: 'Bad Request',
        message: 'Dados de checkout inválidos',
        details: validationResult.error.format()
      });
    }

    const { clienteNome, clienteTelefone, custoMaterialManual, itens } = sanitizarObjeto(validationResult.data);

    try {
      // Usamos uma Transação de Banco de Dados para garantir consistência e atomicidade
      const novoPedido = await db.transaction(async (tx) => {
        
        // a) Cria o registro do Pedido principal
        const [pedidoCriado] = await tx.insert(pedidos).values({
          clienteNome,
          clienteTelefone,
          statusProducao: 'aguardando_sinal', // Status inicial padrão
          statusFinanceiro: 'pendente',
          custoMaterialManual: Number(custoMaterialManual || 0)
        }).returning();

        // b) Processa cada item do pedido
        for (const item of itens) {
          // Busca o produto no banco dentro da transação para garantir isolamento
          const prodList = await tx.select()
            .from(produtos)
            .where(eq(produtos.id, item.produtoId))
            .limit(1);

          if (prodList.length === 0) {
            throw new Error(`Produto com ID ${item.produtoId} não encontrado`);
          }

          const produto = prodList[0];

          // Valida a disponibilidade física em estoque
          if (produto.quantidadeEstoque < item.quantidade) {
            throw new Error(`Estoque insuficiente para o produto "${produto.nome}". Disponível: ${produto.quantidadeEstoque}, Solicitado: ${item.quantidade}`);
          }

          // **REDUZ A QUANTIDADE DE ESTOQUE**
          const novaQuantidade = produto.quantidadeEstoque - item.quantidade;
          await tx.update(produtos)
            .set({ quantidadeEstoque: novaQuantidade })
            .where(eq(produtos.id, produto.id));

          // Grava a transação do item com preço e custo unitários históricos da época
          await tx.insert(itensPedido).values({
            pedidoId: pedidoCriado.id,
            produtoId: produto.id,
            quantidade: item.quantidade,
            precoUnitarioHistorico: produto.precoVenda,
            custoUnitarioHistorico: produto.custoProducao
          });
        }

        return pedidoCriado;
      });

      return reply.status(201).send({
        message: 'Pedido realizado com sucesso!',
        pedidoId: novoPedido.id
      });

    } catch (err: any) {
      app.log.error(err);
      return reply.status(400).send({
        error: 'Erro no Processamento',
        message: err.message || 'Não foi possível concluir o pedido por falha no estoque.'
      });
    }
  });
}
