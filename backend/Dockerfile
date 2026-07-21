FROM oven/bun:1.1-alpine AS base
WORKDIR /usr/src/app

# Copia os arquivos de pacotes para cache de dependências
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copia os arquivos de código-fonte e migrações
COPY . .

# Variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=3001
ENV JWT_SECRET=teste
ENV STORE_WHATSAPP=5511999999999

EXPOSE 3001

# Roda as migrações automáticas e inicia o servidor Fastify
CMD ["bun", "src/server.ts"]
