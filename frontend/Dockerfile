# Estágio 1: Build do site Astro
FROM oven/bun:1.1-alpine AS build
WORKDIR /usr/src/app

COPY package.json bun.lock ./
RUN bun install

COPY . .
RUN bun run build

# Estágio 2: Servidor Nginx para entrega do site estático
FROM nginx:1.25-alpine
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
