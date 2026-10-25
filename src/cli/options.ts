import { resolve } from 'node:path';
import { parseArgs, type ParseArgsConfig } from 'node:util';
import { UsageError } from '../core/errors.js';
import { loadKit, type Kit } from '../core/kit.js';
import type { CliContext } from './context.js';

type Options = NonNullable<ParseArgsConfig['options']>;

export const KIT_OPTION = {
  kit: { type: 'string', short: 'k' },
} as const satisfies Options;

/** `parseArgs` estrito, convertendo erros de parsing em `UsageError`. */
export function parseOptions<T extends Options>(args: string[], options: T) {
  try {
    return parseArgs({ args, options, strict: true, allowPositionals: false }).values;
  } catch (error) {
    throw new UsageError(error instanceof Error ? error.message : String(error));
  }
}

export function kitDirectoryFrom(kitOption: string | undefined, context: CliContext): string {
  return kitOption === undefined ? context.bundledKitDirectory : resolve(context.cwd, kitOption);
}

/** Carrega o kit e reporta os problemas; retorna `undefined` se o kit for inválido. */
export async function loadValidKit(directory: string, context: CliContext): Promise<Kit | undefined> {
  const { kit, problems } = await loadKit(directory, context.fs);
  for (const problem of problems) {
    context.output.error(`✗ ${problem.file}: ${problem.message}`);
  }
  return problems.length === 0 ? kit : undefined;
}
