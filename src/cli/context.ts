import type { FileSystem } from '../core/file-system.js';

export interface Output {
  info(message: string): void;
  error(message: string): void;
}

/** Tudo o que os comandos precisam do ambiente, injetado para que possam ser testados. */
export interface CliContext {
  readonly fs: FileSystem;
  readonly output: Output;
  readonly cwd: string;
  readonly homeDirectory: string;
  readonly bundledKitDirectory: string;
  readonly version: string;
}

export type Command = (args: string[], context: CliContext) => Promise<number>;

export const ExitCode = {
  Success: 0,
  Failure: 1,
  Usage: 2,
} as const;
