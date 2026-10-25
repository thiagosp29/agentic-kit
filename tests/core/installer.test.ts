import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { applyPlan, planInstall } from '../../src/core/installer.js';
import { loadKit } from '../../src/core/kit.js';
import { resolveTarget } from '../../src/core/targets.js';
import { KIT_ROOT, PROJECT_ROOT, validKitFiles } from '../support/fixtures.js';
import { MemoryFileSystem } from '../support/memory-file-system.js';

const claudeLayout = resolveTarget('claude').layoutFor('project');
const skillDestination = join(PROJECT_ROOT, '.claude', 'skills', 'code-review', 'SKILL.md');

async function setup(existingFiles: Record<string, string> = {}) {
  const fs = new MemoryFileSystem({ ...validKitFiles(), ...existingFiles });
  const { kit } = await loadKit(KIT_ROOT, fs);
  const install = async (force = false) => {
    const plan = await planInstall({ kit, layout: claudeLayout, baseDirectory: PROJECT_ROOT, force }, fs);
    await applyPlan(plan, fs);
    return plan;
  };
  return { fs, kit, install };
}

const actionFor = (plan: Awaited<ReturnType<typeof planInstall>>, destination: string) =>
  plan.find((operation) => operation.destination === destination)?.action;

describe('planInstall + applyPlan', () => {
  it('copia todos os arquivos do kit e cria o arquivo de instruções', async () => {
    const { fs, install } = await setup();

    const plan = await install();

    expect(plan.map((operation) => operation.action)).toEqual(Array(5).fill('create'));
    expect(fs.contentOf(join(PROJECT_ROOT, '.claude', 'skills', 'code-review', 'checklist.md'))).toBe(
      '- [ ] item\n',
    );
    expect(fs.contentOf(join(PROJECT_ROOT, 'CLAUDE.md'))).toContain('code-review');
  });

  it('não altera nada numa segunda instalação idêntica', async () => {
    const { install } = await setup();
    await install();

    const plan = await install();

    expect(new Set(plan.map((operation) => operation.action))).toEqual(new Set(['unchanged']));
  });

  it('mantém arquivos alterados localmente sem --force', async () => {
    const { fs, install } = await setup({ [skillDestination]: 'minha versão' });

    const plan = await install();

    expect(actionFor(plan, skillDestination)).toBe('conflict');
    expect(fs.contentOf(skillDestination)).toBe('minha versão');
  });

  it('sobrescreve arquivos alterados localmente com --force', async () => {
    const { fs, install } = await setup({ [skillDestination]: 'minha versão' });

    const plan = await install(true);

    expect(actionFor(plan, skillDestination)).toBe('overwrite');
    expect(fs.contentOf(skillDestination)).toContain('name: code-review');
  });

  it('preserva o conteúdo do usuário no arquivo de instruções', async () => {
    const instructionsPath = join(PROJECT_ROOT, 'CLAUDE.md');
    const { fs, install } = await setup({ [instructionsPath]: '# Regras do meu time\n' });

    const plan = await install();

    expect(actionFor(plan, instructionsPath)).toBe('update');
    expect(fs.contentOf(instructionsPath)).toMatch(/^# Regras do meu time\n\n<!-- agentic-kit:start -->/);
  });

  it('não escreve nada quando apenas planeja (dry-run)', async () => {
    const { fs, kit } = await setup();

    await planInstall({ kit, layout: claudeLayout, baseDirectory: PROJECT_ROOT, force: false }, fs);

    expect(await fs.exists(PROJECT_ROOT)).toBe(false);
  });
});
