import { z } from 'zod';

export const CriarProdutoSchema = z.object({
  nome: z.string().min(3, { message: "O nome deve ter no mínimo 3 caracteres" }),
  preco: z.number().positive({ message: "O preço deve ser maior que zero" }),
  imagem: z.string().url({ message: "A imagem deve ser uma URL válida" }),
  tag3D: z.boolean().default(false),
  custo_interno: z.number().positive().optional(),
  margem_lucro: z.number().positive().optional(),
});

export const RespostaProdutoSchema = z.object({
  id: z.string().uuid().or(z.string()),
  nome: z.string(),
  preco: z.number(),
  imagem: z.string(),
  tag3D: z.boolean(),
});

export type CriarProdutoInput = z.infer<typeof CriarProdutoSchema>;
export type RespostaProduto = z.infer<typeof RespostaProdutoSchema>;
