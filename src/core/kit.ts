import { join, posix } from 'node:path';
import type { FileSystem } from './file-system.js';
import { parseFrontmatter } from './frontmatter.js';

export const KIT_ITEM_KINDS = ['knowledge', 'skill', 'agent'] as const;
export type KitItemKind = (typeof KIT_ITEM_KINDS)[number];

export interface KitItem {
  readonly kind: KitItemKind;
  readonly name: string;
  readonly description: string;
  /** Caminho do arquivo principal (frontmatter), relativo à raiz do kit, com `/`. */
  readonly manifest: string;
  /** Todos os arquivos do item, relativos à raiz do kit, com `/`. */
  readonly files: readonly string[];
}

export interface Kit {
  readonly root: string;
  /** Princípios gerais inseridos no arquivo de instruções do destino (`instructions.md`). */
  readonly instructions: string;
  readonly items: readonly KitItem[];
}

export interface KitProblem {
  readonly file: string;
  readonly message: string;
}

export interface KitLoadResult {
  readonly kit: Kit;
  readonly problems: readonly KitProblem[];
}

export const KIND_DIRECTORIES: Readonly<Record<KitItemKind, string>> = {
  knowledge: 'knowledge',
  skill: 'skills',
  agent: 'agents',
};

const INSTRUCTIONS_FILE = 'instructions.md';
const SKILL_MANIFEST = 'SKILL.md';
const MARKDOWN_EXTENSION = '.md';
const NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

interface Candidate {
  readonly kind: KitItemKind;
  readonly expectedName: string;
  readonly manifest: string;
  readonly files: readonly string[];
}

/** Carrega o kit de `root` e valida os manifestos; itens inválidos ficam de fora e viram `problems`. */
export async function loadKit(root: string, fs: FileSystem): Promise<KitLoadResult> {
  if (!(await fs.exists(root))) {
    return {
      kit: { root, instructions: '', items: [] },
      problems: [{ file: root, message: 'Diretório do kit não encontrado.' }],
    };
  }

  const items: KitItem[] = [];
  const problems: KitProblem[] = [];

  for (const kind of KIT_ITEM_KINDS) {
    for (const candidate of await findCandidates(root, kind, fs)) {
      const result = await readItem(root, candidate, fs);
      if ('message' in result) {
        problems.push(result);
      } else {
        items.push(result);
      }
    }
  }

  const instructionsPath = join(root, INSTRUCTIONS_FILE);
  const instructions = (await fs.exists(instructionsPath))
    ? (await fs.readFile(instructionsPath)).trim()
    : '';

  return { kit: { root, instructions, items }, problems };
}

async function findCandidates(root: string, kind: KitItemKind, fs: FileSystem): Promise<Candidate[]> {
  const directory = KIND_DIRECTORIES[kind];
  if (!(await fs.exists(join(root, directory)))) {
    return [];
  }

  const entries = await fs.listDirectory(join(root, directory));

  if (kind === 'skill') {
    const skillDirectories = entries.filter((entry) => entry.isDirectory);
    return Promise.all(
      skillDirectories.map(async (entry) => {
        const skillRoot = posix.join(directory, entry.name);
        return {
          kind,
          expectedName: entry.name,
          manifest: posix.join(skillRoot, SKILL_MANIFEST),
          files: await listFilesRecursively(root, skillRoot, fs),
        };
      }),
    );
  }

  return entries
    .filter((entry) => !entry.isDirectory && entry.name.endsWith(MARKDOWN_EXTENSION))
    .map((entry) => {
      const manifest = posix.join(directory, entry.name);
      return {
        kind,
        expectedName: entry.name.slice(0, -MARKDOWN_EXTENSION.length),
        manifest,
        files: [manifest],
      };
    });
}

async function readItem(root: string, candidate: Candidate, fs: FileSystem): Promise<KitItem | KitProblem> {
  const { kind, expectedName, manifest, files } = candidate;

  if (!files.includes(manifest)) {
    return { file: manifest, message: `Arquivo obrigatório ${SKILL_MANIFEST} não encontrado.` };
  }

  const { attributes } = parseFrontmatter(await fs.readFile(join(root, manifest)));
  const name = attributes['name'] ?? '';
  const description = attributes['description'] ?? '';

  if (!NAME_PATTERN.test(name)) {
    return { file: manifest, message: `"name" deve estar em kebab-case (recebido: "${name}").` };
  }
  if (name !== expectedName) {
    return {
      file: manifest,
      message: `"name" (${name}) deve ser igual ao nome do arquivo/pasta (${expectedName}).`,
    };
  }
  if (description.trim() === '') {
    return { file: manifest, message: '"description" é obrigatória: é ela que diz à IA quando usar o item.' };
  }

  return { kind, name, description, manifest, files };
}

async function listFilesRecursively(
  root: string,
  relativeDirectory: string,
  fs: FileSystem,
): Promise<string[]> {
  const entries = await fs.listDirectory(join(root, relativeDirectory));
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const relativePath = posix.join(relativeDirectory, entry.name);
      return entry.isDirectory ? listFilesRecursively(root, relativePath, fs) : [relativePath];
    }),
  );
  return nested.flat();
}
