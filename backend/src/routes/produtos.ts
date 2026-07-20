import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { CriarProdutoSchema, RespostaProdutoSchema } from '../schemas/produtos.ts';
import { randomUUID } from 'crypto';

// Banco de dados simulado em memória
const produtosDb = [
  {
    id: "1",
    nome: "Ursinho de Pelúcia Sonho",
    preco: 89.90,
    imagem: "https://images.unsplash.com/photo-1559251606-c623743a6d76?q=80&w=600&auto=format&fit=crop",
    tag3D: true,
    custo_interno: 30.00,
    margem_lucro: 59.90,
  },
  {
    id: "2",
    nome: "Móbile de Berço Estrelado",
    preco: 149.90,
    imagem: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=600&auto=format&fit=crop",
    tag3D: false,
    custo_interno: 50.00,
    margem_lucro: 99.90,
  },
  {
    id: "3",
    nome: "Luminária Balão Mágico",
    preco: 120.00,
    imagem: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600&auto=format&fit=crop",
    tag3D: true,
    custo_interno: 45.00,
    margem_lucro: 75.00,
  }
];

export async function rotasProdutos(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  // Rota de listagem de produtos com sanitização através do RespostaProdutoSchema
  typedApp.get('/produtos', {
    schema: {
      response: {
        200: {
          type: 'array',
          items: RespostaProdutoSchema
        }
      }
    }
  }, async () => {
    // Retorna a lista de produtos. Zod type provider garante que propriedades como custo_interno
    // e margem_lucro sejam automaticamente eliminadas/purgadas da saída JSON.
    return produtosDb;
  });

  // Rota de criação de produto
  typedApp.post('/produtos', {
    schema: {
      body: CriarProdutoSchema,
      response: {
        201: RespostaProdutoSchema
      }
    }
  }, async (request, reply) => {
    const { nome, preco, imagem, tag3D, custo_interno, margem_lucro } = request.body;

    const novoProduto = {
      id: randomUUID(),
      nome,
      preco,
      imagem,
      tag3D,
      custo_interno: custo_interno || (preco * 0.4),
      margem_lucro: margem_lucro || (preco * 0.6)
    };

    produtosDb.push(novoProduto);

    return reply.status(201).send(novoProduto);
  });
}
