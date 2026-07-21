import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import { serializerCompiler, validatorCompiler, hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod';
import { rotasProdutos } from './routes/produtos.ts';
import { rotasAdmin } from './routes/admin.ts';

const app = Fastify({
  logger: true,
});

// Registrar esquemas de validação do Zod globalmente
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(validatorCompiler); // Corrigido para validatorCompiler / serializerCompiler apropriadamente

// Segurança - Helmet
app.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
});

// Rate Limit para prevenção de força bruta e DoS
app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
});

// JWT para autenticação segura baseada em tokens com roles
app.register(jwt, {
  secret: process.env.JWT_SECRET || 'segredo-magico-do-atelie-sonho-encantado-2026',
});

app.register(cors, {
  origin: '*', // Em produção, mude para domínios específicos
});

// Formatador de erro customizado para o Zod retornar Bad Request (400) estruturado
app.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Erro de validação dos dados de entrada',
      details: error.validation
    });
  }

  app.log.error(error);
  return reply.status(500).send({
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'Ocorreu um erro interno no servidor.'
  });
});

// Registrar as rotas
app.register(rotasProdutos);
app.register(rotasAdmin);

import { rodarMigracoes } from './config/migrate.ts';

const PORT = Number(process.env.PORT) || 3001;
const run = async () => {
  try {
    // Executa as migrações automaticamente antes de expor a API
    await rodarMigracoes();
    
    await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

run();
