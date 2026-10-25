import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { CliContext } from '../../src/cli/context.js';
import { run } from '../../src/cli/run.js';
import { HOME_ROOT, KIT_ROOT, PROJECT_ROOT, validKitFiles } from '../support/fixtures.js';
import { MemoryFileSystem } from '../support/memory-file-system.js';

function createContext(files: Record<string, string> = validKitFiles()) {
  const fs = new MemoryFileSystem(files);
  const info: string[] = [];
  const errors: string[] = [];
  const context: CliContext = {
    fs,
    output: { info: (message) => info.push(message), error: (message) => errors.push(message) },
    cwd: PROJECT_ROOT,
    homeDirectory: HOME_ROOT,
    bundledKitDirectory: KIT_ROOT,
    version: '1.2.3',
  };
  return { fs, context, info, errors };
}

describe('run', () => {
  it.each([[[]], [['--help']]])('mostra a ajuda com %j', async (argv) => {
    const { context, info } = createContext();

    expect(await run(argv, context)).toBe(0);
    expect(info.join('\n')).toContain('Uso:');
  });

  it('mostra a versão', async () => {
    const { context, info } = createContext();

    expect(await run(['--version'], context)).toBe(0);
    expect(info).toEqual(['1.2.3']);
  });

  it('rejeita comando desconhecido com código 2', async () => {
    const { context, errors } = createContext();

    expect(await run(['deploy'], context)).toBe(2);
    expect(errors.join()).toContain('deploy');
  });

  describe('install', () => {
    it('instala no diretório atual para o Claude', async () => {
      const { context, fs } = createContext();

      expect(await run(['install', '--target', 'claude'], context)).toBe(0);
      expect(fs.contentOf(join(PROJECT_ROOT, '.claude', 'agents', 'architect.md'))).toBeDefined();
      expect(fs.contentOf(join(PROJECT_ROOT, 'CLAUDE.md'))).toBeDefined();
    });

    it('instala para qualquer IA via AGENTS.md', async () => {
      const { context, fs } = createContext();

      expect(await run(['install', '-t', 'agents'], context)).toBe(0);
      expect(fs.contentOf(join(PROJECT_ROOT, '.ai', 'knowledge', 'clean-code.md'))).toBeDefined();
      expect(fs.contentOf(join(PROJECT_ROOT, 'AGENTS.md'))).toContain('(.ai/knowledge/clean-code.md)');
    });

    it('instala globalmente no diretório do usuário', async () => {
      const { context, fs } = createContext();

      expect(await run(['install', '--target', 'claude', '--global'], context)).toBe(0);
      expect(fs.contentOf(join(HOME_ROOT, '.claude', 'CLAUDE.md'))).toContain(
        '(skills/code-review/SKILL.md)',
      );
    });

    it('não escreve nada com --dry-run', async () => {
      const { context, fs, info } = createContext();

      expect(await run(['install', '--target', 'claude', '--dry-run'], context)).toBe(0);
      expect(await fs.exists(PROJECT_ROOT)).toBe(false);
      expect(info.join('\n')).toContain('Simulação');
    });

    it.each([
      [['install'], /--target/],
      [['install', '--target', 'gpt'], /Destino desconhecido/],
      [['install', '--target', 'agents', '--global'], /não suporta --global/],
      [['install', '--target', 'claude', '--global', '--dir', 'x'], /--global ou --dir/],
      [['install', '--target', 'claude', '--unknown'], /unknown/],
    ])('falha com código 2 para %j', async (argv, message) => {
      const { context, errors } = createContext();

      expect(await run(argv, context)).toBe(2);
      expect(errors.join('\n')).toMatch(message);
    });
  });

  describe('validate', () => {
    it('aprova um kit válido', async () => {
      const { context, info } = createContext();

      expect(await run(['validate'], context)).toBe(0);
      expect(info.join()).toContain('3 itens');
    });

    it('reprova um kit inválido com código 1', async () => {
      const { context, errors } = createContext({
        [join(KIT_ROOT, 'agents', 'bad.md')]: '# sem frontmatter',
      });

      expect(await run(['validate'], context)).toBe(1);
      expect(errors.join('\n')).toContain('agents/bad.md');
    });
  });

  it('list mostra itens e destinos', async () => {
    const { context, info } = createContext();

    expect(await run(['list'], context)).toBe(0);
    const text = info.join('\n');
    expect(text).toContain('code-review');
    expect(text).toContain('claude');
    expect(text).toContain('agents');
  });
});
