CREATE TABLE `itens_pedido` (
	`id` text PRIMARY KEY NOT NULL,
	`pedido_id` text NOT NULL,
	`produto_id` text NOT NULL,
	`quantidade` integer DEFAULT 1 NOT NULL,
	`preco_unitario_historico` real NOT NULL,
	`custo_unitario_historico` real NOT NULL,
	FOREIGN KEY (`pedido_id`) REFERENCES `pedidos`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`produto_id`) REFERENCES `produtos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pedidos` (
	`id` text PRIMARY KEY NOT NULL,
	`cliente_nome` text NOT NULL,
	`cliente_telefone` text NOT NULL,
	`status_producao` text DEFAULT 'rascunho' NOT NULL,
	`status_financeiro` text DEFAULT 'pendente' NOT NULL,
	`custo_material_manual` real DEFAULT 0 NOT NULL,
	`criado_em` text DEFAULT CURRENT_TIMESTAMP,
	`atualizado_em` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `produtos` (
	`id` text PRIMARY KEY NOT NULL,
	`nome` text NOT NULL,
	`preco_venda` real NOT NULL,
	`custo_producao` real NOT NULL,
	`imagem` text NOT NULL,
	`tag3d` integer DEFAULT false NOT NULL,
	`is_rascunho` integer DEFAULT false NOT NULL,
	`deleted_at` text,
	`criado_em` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `tokens_invalidados` (
	`token` text PRIMARY KEY NOT NULL,
	`expiracao` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `usuarios` (
	`id` text PRIMARY KEY NOT NULL,
	`nome` text NOT NULL,
	`email` text NOT NULL,
	`senha_hash` text NOT NULL,
	`role` text DEFAULT 'ADMIN' NOT NULL,
	`criado_em` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `usuarios_email_unique` ON `usuarios` (`email`);