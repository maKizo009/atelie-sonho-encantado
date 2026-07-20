import type { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../config/db.ts';
import { tokensInvalidados } from '../schemas/db_schema.ts';
import { eq } from 'drizzle-orm';

/**
 * Middleware para validar o token JWT e verificar contra sessões fantasma (tokens na blacklist)
 */
export async function validarJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Valida a assinatura do token
    await request.jwtVerify();
    
    const payload = request.user as { id: string; role: 'ADMIN' | 'SUPERUSER'; jti?: string };
    
    // Proteção contra ghost sessions
    if (payload.jti) {
      const blacklisted = await db.select()
        .from(tokensInvalidados)
        .where(eq(tokensInvalidados.token, payload.jti))
        .limit(1);
      
      if (blacklisted.length > 0) {
        return reply.status(401).send({ 
          error: 'Unauthorized', 
          message: 'Esta sessão foi encerrada. Efetue login novamente.' 
        });
      }
    }
  } catch (err) {
    return reply.status(401).send({ 
      error: 'Unauthorized', 
      message: 'Token ausente, inválido ou expirado.' 
    });
  }
}

/**
 * Middleware RBAC para checar se o perfil do usuário possui acesso ao recurso
 */
export function verificarRole(rolesPermitidas: ('ADMIN' | 'SUPERUSER')[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as { role: 'ADMIN' | 'SUPERUSER' } | undefined;
    
    if (!user || !rolesPermitidas.includes(user.role)) {
      return reply.status(403).send({ 
        error: 'Forbidden', 
        message: 'Você não tem permissão para acessar este recurso.' 
      });
    }
  };
}
