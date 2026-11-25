import { createHash } from 'node:crypto';
import { UsageError } from './errors.js';
import { HASHES_BEFORE_RECORD } from './hashes-before-record.js';
import { normalizeLineEndings } from './line-endings.js';

/** Fica no diretório de conteúdo do destino, junto dos arquivos que descreve. */
export const INSTALL_RECORD_FILE = 'agentic-kit.lock.json';

/** Hash do conteúdo que o kit gravou, por caminho relativo à raiz do kit (com `/`). */
export type InstallRecord = ReadonlyMap<string, string>;

const HASH_PATTERN = /^[0-9a-f]{64}$/;

/** Ignora CRLF/LF: o git no Windows troca o fim de linha sem que ninguém tenha editado o arquivo. */
export function hashContent(content: string): string {
  return createHash('sha256').update(normalizeLineEndings(content)).digest('hex');
}

/** Indica se `content` é o que o kit instalou, isto é, se pode ser atualizado sem perder edições. */
export function isPristine(file: string, content: string, record: InstallRecord): boolean {
  const hash = hashContent(content);
  return record.get(file) === hash || (HASHES_BEFORE_RECORD.get(file)?.includes(hash) ?? false);
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
