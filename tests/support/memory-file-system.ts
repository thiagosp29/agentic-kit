import { resolve, sep } from 'node:path';
import type { DirectoryEntry, FileSystem } from '../../src/core/file-system.js';

/** Fake em memória da porta `FileSystem`. Diretórios existem implicitamente quando contêm arquivos. */
export class MemoryFileSystem implements FileSystem {
  private readonly files = new Map<string, string>();

  constructor(initialFiles: Record<string, string> = {}) {
    for (const [path, content] of Object.entries(initialFiles)) {
      this.files.set(resolve(path), content);
    }
  }

  readFile(path: string): Promise<string> {
    const content = this.files.get(resolve(path));
    if (content === undefined) {
      return Promise.reject(new Error(`ENOENT: ${path}`));
    }
    return Promise.resolve(content);
  }

  writeFile(path: string, content: string): Promise<void> {
    this.files.set(resolve(path), content);
    return Promise.resolve();
  }

  exists(path: string): Promise<boolean> {
    const target = resolve(path);
    const isDirectory = [...this.files.keys()].some((file) => file.startsWith(target + sep));
    return Promise.resolve(this.files.has(target) || isDirectory);
  }

  listDirectory(path: string): Promise<DirectoryEntry[]> {
    const prefix = resolve(path) + sep;
    const entries = new Map<string, boolean>();

    for (const file of this.files.keys()) {
      if (!file.startsWith(prefix)) continue;
      const [name, ...rest] = file.slice(prefix.length).split(sep);
      if (name !== undefined) {
        entries.set(name, entries.get(name) === true || rest.length > 0);
      }
    }

    return Promise.resolve(
      [...entries]
        .map(([name, isDirectory]) => ({ name, isDirectory }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    );
  }

  /** Conteúdo atual de um arquivo, para asserções. */
  contentOf(path: string): string | undefined {
    return this.files.get(resolve(path));
  }
}
