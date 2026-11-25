import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadKit } from '../../src/core/kit.js';
import { parseFrontmatter } from '../../src/core/frontmatter.js';
import { renderInstructionsBlock } from '../../src/core/instructions.js';
import { resolveTarget } from '../../src/core/targets.js';
import { NodeFileSystem } from '../../src/infra/node-file-system.js';

const KIT_DIRECTORY = join(import.meta.dirname, '../../kit');
const fs = new NodeFileSystem();
const { kit, problems } = await loadKit(KIT_DIRECTORY, fs);
const documents = await Promise.all(
  kit.items
    .flatMap((item) => item.files)
    .map(async (file) => ({ file, content: await readFile(join(KIT_DIRECTORY, file), 'utf8') })),
);
const namesOf = (kind: string) => kit.items.filter((item) => item.kind === kind).map((item) => item.name);
const matches = (content: string, pattern: RegExp) =>
  [...content.matchAll(pattern)].flatMap((match) => match[1] ?? []);

// Comandos e skills que o Claude Code já traz (code.claude.com/docs/en/skills, nov/2026).
const CLAUDE_CODE_NAMES = [
  'batch',
  'branch',
  'checkup',
  'claude-api',
  'code-review',
  'compact',
  'context',
  'debug',
  'doctor',
  'goal',
  'help',
  'init',
  'loop',
  'memory',
  'plan',
  'release-notes',
  'review',
  'run',
  'security-review',
  'ship',
  'ship-local',
  'simplify',
  'steward',
  'tasks',
  'usage',
  'verify',
];
// Já distribuídas com esses nomes; renomear quebraria quem usa.
const ACCEPTED_COLLISIONS = ['code-review', 'debug'];

// Identificadores entre crases que não são itens do kit.
const OTHER_IDENTIFIERS = new Set<string>([
  'a',
  'alt',
  'aria-describedby',
  'aria-invalid',
  'async',
  'autocomplete',
  'b',
  'build',
  'chore',
  'ci',
  'data',
  'defer',
  'docs',
  'error',
  'eval',
  'expect',
  'feat',
  'fix',
  'height',
  'helper',
  'if',
  'info',
  'lang',
  'main',
  'manager',
  'overrides',
  'pendente',
  'perf',
  'placeholder',
  'prefers-reduced-motion',
  'price',
  'req',
  'res',
  'role',
  'sleep',
  'switch',
  'tabindex',
  'test',
  'type',
  'util',
  'warn',
  'width',
]);

describe('kit distribuído', () => {
  it('não tem problemas de validação', () => {
    expect(problems).toEqual([]);
  });

  it.each(documents)('$file só cita itens e arquivos que existem', async ({ file, content }) => {
    for (const name of matches(content, /`knowledge\/([a-z0-9-]+)\.md`/g)) {
      expect(namesOf('knowledge')).toContain(name);
    }
    for (const name of matches(content, /[Ss]kills? `([a-z0-9-]+)`/g)) {
      expect(namesOf('skill')).toContain(name);
    }
    for (const name of matches(content, /[Aa]gents? `([a-z0-9-]+)`/g)) {
      expect(namesOf('agent')).toContain(name);
    }
    for (const name of matches(content, /[Kk]nowledge `([a-z0-9-]+)`/g)) {
      expect(namesOf('knowledge')).toContain(name);
    }
    for (const link of matches(content, /\]\((?!https?:)([^)#]+)\)/g)) {
      expect(await fs.exists(join(KIT_DIRECTORY, dirname(file), link))).toBe(true);
    }
  });

  it.each(documents)('$file não tem identificador entre crases desconhecido', ({ content }) => {
    const known = new Set([...kit.items.map((item) => item.name), ...OTHER_IDENTIFIERS]);
    const prose = content.replace(/^```[\s\S]*?^```/gm, '');
    expect(matches(prose, /`([a-z][a-z0-9]*(?:-[a-z0-9]+)*)`/g).filter((name) => !known.has(name))).toEqual(
      [],
    );
  });

  it.each(documents.filter(({ file }) => file.startsWith('agents/')))(
    '$file só pré-carrega skills que existem',
    ({ content }) => {
      for (const name of matches(content, /^ {2}- ([a-z0-9-]+)$/gm)) {
        expect(namesOf('skill')).toContain(name);
      }
    },
  );

  it('só cita skills existentes no fluxo das instruções', () => {
    const flow = kit.instructions.split('### Fluxo')[1] ?? '';
    const names = matches(flow, /`([a-z0-9-]+)`/g);
    expect(names.length).toBeGreaterThan(0);
    expect(namesOf('skill')).toEqual(expect.arrayContaining(names));
  });

  it('não cria novas colisões com nomes conhecidos do Claude Code', () => {
    expect(namesOf('skill').filter((name) => CLAUDE_CODE_NAMES.includes(name))).toEqual(ACCEPTED_COLLISIONS);
  });

  it.each([
    'security-auditor',
    'ux-reviewer',
    'performance-analyst',
    'qa-verifier',
    'code-reviewer',
    'architect',
  ])('o agent %s não tem ferramentas de edição', (name) => {
    const content = documents.find(({ file }) => file === `agents/${name}.md`)?.content ?? '';
    const { tools } = parseFrontmatter(content).attributes;
    expect(tools).toBeTruthy();
    expect(tools).not.toMatch(/Edit|Write/);
  });

  it('cita todos os itens no README', async () => {
    const readme = await readFile(join(KIT_DIRECTORY, '../README.md'), 'utf8');
    expect(kit.items.map((item) => item.name).filter((name) => !readme.includes(`\`${name}\``))).toEqual([]);
  });

  it('gera um bloco do CLAUDE.md que deixa espaço dentro das 200 linhas recomendadas', () => {
    const block = renderInstructionsBlock(kit, resolveTarget('claude').layoutFor('project'));
    expect(block.split('\n').length).toBeLessThan(80);
  });
});
