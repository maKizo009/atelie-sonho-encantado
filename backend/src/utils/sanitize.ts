import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitiza strings para remover tags HTML/scripts suspeitos de XSS.
 */
export function sanitizarTexto(texto: string): string {
  return DOMPurify.sanitize(texto, {
    ALLOWED_TAGS: [], // Remove TODAS as tags HTML para segurança máxima em campos comuns
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitiza recursivamente strings dentro de um objeto.
 */
export function sanitizarObjeto<T>(obj: T): T {
  if (typeof obj === 'string') {
    return sanitizarTexto(obj) as unknown as T;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizarObjeto(item)) as unknown as T;
  }
  
  if (obj !== null && typeof obj === 'object') {
    const result: any = {};
    for (const key of Object.keys(obj)) {
      result[key] = sanitizarObjeto((obj as any)[key]);
    }
    return result as T;
  }
  
  return obj;
}
