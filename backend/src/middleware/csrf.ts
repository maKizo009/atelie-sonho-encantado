import type { FastifyRequest, FastifyReply } from 'fastify';

/**
 * Middleware de Validação de Token CSRF (Double Submit Cookie / Header customizado)
 * Para requisições de modificação de estado (POST, PUT, DELETE).
 * O frontend deve enviar o token CSRF recebido durante o login em cada requisição
 * através do header 'X-CSRF-Token'.
 */
export async function validarCSRF(request: FastifyRequest, reply: FastifyReply) {
  const method = request.method;
  
  // Ignora métodos seguros
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return;
  }

  const csrfHeader = request.headers['x-csrf-token'];
  const user = request.user as { csrfToken?: string } | undefined;

  // Em um fluxo seguro, o CSRF token fica atrelado ao JWT do usuário
  if (!csrfHeader || !user || csrfHeader !== user.csrfToken) {
    return reply.status(403).send({
      error: 'Forbidden',
      message: 'Falha na validação do token CSRF. Requisição bloqueada por segurança.'
    });
  }
}
