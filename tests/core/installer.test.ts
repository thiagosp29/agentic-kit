import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { applyPlan, planInstall } from '../../src/core/installer.js';
import { INSTALL_RECORD_FILE } from '../../src/core/install-record.js';
import { loadKit } from '../../src/core/kit.js';
import { resolveTarget } from '../../src/core/targets.js';
import { KIT_ROOT, manifest, PROJECT_ROOT, validKitFiles } from '../support/fixtures.js';
import { MemoryFileSystem } from '../support/memory-file-system.js';

const claudeLayout = resolveTarget('claude').layoutFor('project');
const recordPath = join(PROJECT_ROOT, '.claude', INSTALL_RECORD_FILE);
const skillSource = join(KIT_ROOT, 'skills', 'code-review', 'SKILL.md');
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

const instructionsPath = join(PROJECT_ROOT, 'CLAUDE.md');
const toCrlf = (content: string) => content.replace(/\r?\n/g, '\r\n');
const actionFor = (plan: Awaited<ReturnType<typeof planInstall>>, destination: string) =>
  plan.find((operation) => operation.destination === destination)?.action;

describe('planInstall + applyPlan', () => {
  it('copia todos os arquivos do kit e cria o arquivo de instruções', async () => {
    const { fs, install } = await setup();

    const plan = await install();

    expect(plan.map((operation) => operation.action)).toEqual(Array(6).fill('create'));
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

  it('atualiza para a nova versão do kit o arquivo que o usuário não editou', async () => {
    const { fs, install } = await setup();
    await install();
    await fs.writeFile(skillSource, 'versão nova');

    const plan = await install();

    expect(actionFor(plan, skillDestination)).toBe('update');
    expect(fs.contentOf(skillDestination)).toBe('versão nova');
    expect(new Set((await install()).map((operation) => operation.action))).toEqual(new Set(['unchanged']));
  });

  it('mantém a edição do usuário ao longo de várias versões do kit', async () => {
    const { fs, install } = await setup();
    await install();
    await fs.writeFile(skillDestination, 'minha versão');

    for (const version of ['versão 2', 'versão 3']) {
      await fs.writeFile(skillSource, version);
      expect(actionFor(await install(), skillDestination)).toBe('conflict');
    }

    expect(fs.contentOf(skillDestination)).toBe('minha versão');
  });

  it('volta a atualizar depois que --force substitui a edição do usuário', async () => {
    const { fs, install } = await setup({ [skillDestination]: 'minha versão' });
    await install(true);
    await fs.writeFile(skillSource, 'versão nova');

    expect(actionFor(await install(), skillDestination)).toBe('update');
  });

  it('não trata troca de LF por CRLF como edição do usuário', async () => {
    const { fs, install } = await setup();
    await install();
    const installed = fs.contentOf(skillDestination) ?? '';
    await fs.writeFile(skillDestination, installed.replace(/\n/g, '\r\n'));

    expect(actionFor(await install(), skillDestination)).toBe('unchanged');
    await fs.writeFile(skillSource, 'versão nova');
    expect(actionFor(await install(), skillDestination)).toBe('update');
  });

  it('não altera nada quando o git converteu toda a instalação para CRLF', async () => {
    const { fs, install } = await setup({ [instructionsPath]: '# Regras do meu time\n' });
    const destinations = (await install()).map((operation) => operation.destination);
    for (const destination of destinations) {
      await fs.writeFile(destination, toCrlf(fs.contentOf(destination) ?? ''));
    }

    const plan = await install();

    expect(new Set(plan.map((operation) => operation.action))).toEqual(new Set(['unchanged']));
  });

  it('mantém CRLF ao atualizar o arquivo de instruções e o registro', async () => {
    const { fs, install } = await setup({ [instructionsPath]: '# Regras do meu time\n' });
    await install();
    for (const path of [instructionsPath, recordPath]) {
      await fs.writeFile(path, toCrlf(fs.contentOf(path) ?? ''));
    }
    await fs.writeFile(skillSource, manifest('code-review', 'Descrição nova.'));
    await fs.writeFile(join(KIT_ROOT, 'instructions.md'), '### Princípios novos');
    const { kit } = await loadKit(KIT_ROOT, fs);

    const plan = await planInstall(
      { kit, layout: claudeLayout, baseDirectory: PROJECT_ROOT, force: false },
      fs,
    );
    await applyPlan(plan, fs);

    for (const path of [instructionsPath, recordPath]) {
      expect(actionFor(plan, path)).toBe('update');
      expect(fs.contentOf(path)).not.toMatch(/(?<!\r)\n/);
    }
    expect(fs.contentOf(instructionsPath)).toContain('# Regras do meu time\r\n');
    expect(fs.contentOf(instructionsPath)).toContain('### Princípios novos\r\n');
  });

  it('não converte as linhas do usuário num arquivo de instruções com fins de linha misturados', async () => {
    const { fs, install } = await setup({ [instructionsPath]: 'linha CRLF\r\nlinha LF\n' });

    await install();

    expect(fs.contentOf(instructionsPath)).toMatch(/^linha CRLF\r\nlinha LF\n\n<!-- agentic-kit:start -->/);
    const plan = await install();
    expect(actionFor(plan, instructionsPath)).toBe('unchanged');
  });

  it('passa a registrar arquivos já idênticos de uma instalação sem registro', async () => {
    const source = validKitFiles()[skillSource] ?? '';
    const { fs, install } = await setup({ [skillDestination]: source });
    await install();
    await fs.writeFile(skillSource, 'versão nova');

    expect(actionFor(await install(), skillDestination)).toBe('update');
  });

  it('mantém no registro os arquivos instalados por outro kit', async () => {
    const hash = 'a'.repeat(64);
    const { fs, install } = await setup({
      [recordPath]: JSON.stringify({ files: { 'skills/do-time/SKILL.md': hash } }),
    });

    await install();

    expect(fs.contentOf(recordPath)).toContain(`"skills/do-time/SKILL.md": "${hash}"`);
  });

  it.each(['{', '[]', '{"files":[]}', '{"files":{"a":1}}'])(
    'recusa o registro corrompido %s sem escrever nada',
    async (source) => {
      const { fs, install } = await setup({ [recordPath]: source });

      await expect(install()).rejects.toThrow(/corrompido\. Apague/);
      expect(fs.contentOf(skillDestination)).toBeUndefined();
    },
  );

  it('preserva o conteúdo do usuário no arquivo de instruções', async () => {
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
