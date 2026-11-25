const BARE_LF = /(?<!\r)\n/;

/** O git no Windows troca LF por CRLF no checkout; comparar sem isso evita diferença falsa. */
export function normalizeLineEndings(content: string): string {
  return content.replace(/\r\n/g, '\n');
}

/** Converte `content` para CRLF se `reference` usa só CRLF; senão, devolve `content` como está. */
export function matchLineEndings(content: string, reference: string): string {
  const usesOnlyCrlf = reference.includes('\r\n') && !BARE_LF.test(reference);
  return usesOnlyCrlf ? normalizeLineEndings(content).replace(/\n/g, '\r\n') : content;
}
