export interface DirectoryEntry {
  readonly name: string;
  readonly isDirectory: boolean;
}

/** Porta de acesso a arquivos: o núcleo depende dela, nunca de `node:fs` diretamente. */
export interface FileSystem {
  readFile(path: string): Promise<string>;
  /** Escreve o arquivo criando os diretórios intermediários. */
  writeFile(path: string, content: string): Promise<void>;
  exists(path: string): Promise<boolean>;
  /** Lista as entradas do diretório em ordem alfabética. */
  listDirectory(path: string): Promise<DirectoryEntry[]>;
}
