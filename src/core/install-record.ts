import { createHash } from 'node:crypto';
import { UsageError } from './errors.js';

/** Fica no diretório de conteúdo do destino, junto dos arquivos que descreve. */
export const INSTALL_RECORD_FILE = 'agentic-kit.lock.json';

/** Hash do conteúdo que o kit gravou, por caminho relativo à raiz do kit (com `/`). */
export type InstallRecord = ReadonlyMap<string, string>;

const HASH_PATTERN = /^[0-9a-f]{64}$/;

/**
 * Versões antigas distribuídas antes de existir o registro de instalação. A lista é fechada: o que
 * for instalado daqui em diante fica no registro.
 */
const HASHES_BEFORE_RECORD: ReadonlyMap<string, string> = new Map([
  ['agents/architect.md', '6e89cee2172eebe7c765fdc80d8682bf95287665e39abfb7268f768d69860273'],
  ['agents/code-reviewer.md', 'aa8eef71347088fe949964e7544ad809c593da20a5ae186aa37317dd62fb3843'],
  ['agents/test-engineer.md', 'ecdb976e18a5bdb605a7da22638b2e01c0dd3453024e0b4d163a4dac09669098'],
]);

/** Ignora CRLF/LF: o git no Windows troca o fim de linha sem que ninguém tenha editado o arquivo. */
export function hashContent(content: string): string {
  return createHash('sha256').update(content.replace(/\r\n/g, '\n')).digest('hex');
}

/** Indica se `content` é o que o kit instalou, isto é, se pode ser atualizado sem perder edições. */
export function isPristine(file: string, content: string, record: InstallRecord): boolean {
  const hash = hashContent(content);
  return record.get(file) === hash || HASHES_BEFORE_RECORD.get(file) === hash;
}

export function parseInstallRecord(source: string, path: string): InstallRecord {
  const files = readFilesField(source);
  if (files === undefined) {
    throw new UsageError(`${path} está corrompido. Apague o arquivo e instale de novo.`);
  }
  return new Map(files);
}

export function renderInstallRecord(record: InstallRecord): string {
  const sorted = [...record].sort(([a], [b]) => (a < b ? -1 : 1));
  return `${JSON.stringify({ files: Object.fromEntries(sorted) }, null, 2)}\n`;
}

function readFilesField(source: string): [string, string][] | undefined {
  let data: unknown;
  try {
    data = JSON.parse(source);
  } catch {
    return undefined;
  }
  if (!isObject(data) || !isObject(data['files'])) return undefined;

  const entries = Object.entries(data['files']);
  return entries.every(isHashEntry) ? entries : undefined;
}

function isHashEntry(entry: [string, unknown]): entry is [string, string] {
  return typeof entry[1] === 'string' && HASH_PATTERN.test(entry[1]);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
