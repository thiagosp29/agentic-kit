import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadKit } from '../../src/core/kit.js';
import { NodeFileSystem } from '../../src/infra/node-file-system.js';
import { BUNDLED_KIT_DIRECTORY } from '../../src/paths.js';
import { KIT_ROOT, manifest, validKitFiles } from '../support/fixtures.js';
import { MemoryFileSystem } from '../support/memory-file-system.js';

describe('loadKit', () => {
  it('carrega itens de todos os tipos com seus arquivos', async () => {
    const { kit, problems } = await loadKit(KIT_ROOT, new MemoryFileSystem(validKitFiles()));

    expect(problems).toEqual([]);
    expect(kit.instructions).toBe('### Princípios\n\n1. Teste tudo.');
    expect(kit.items).toEqual([
      {
        kind: 'knowledge',
        name: 'clean-code',
        description: 'Regras de clean code.',
        manifest: 'knowledge/clean-code.md',
        files: ['knowledge/clean-code.md'],
      },
      {
        kind: 'skill',
        name: 'code-review',
        description: 'Revisa código.',
        manifest: 'skills/code-review/SKILL.md',
        files: ['skills/code-review/checklist.md', 'skills/code-review/SKILL.md'],
      },
      {
        kind: 'agent',
        name: 'architect',
        description: 'Desenha soluções.',
        manifest: 'agents/architect.md',
        files: ['agents/architect.md'],
      },
    ]);
  });

  it.each([
    ['nome diferente do arquivo', manifest('outro-nome', 'Desc.'), /deve ser igual/],
    ['nome fora de kebab-case', manifest('Architect', 'Desc.'), /kebab-case/],
    ['descrição vazia', manifest('architect', ''), /description/],
    ['sem frontmatter', '# Architect\n', /kebab-case/],
  ])('reporta problema quando o manifesto tem %s', async (_case, content, message) => {
    const fs = new MemoryFileSystem({ [join(KIT_ROOT, 'agents', 'architect.md')]: content });

    const { kit, problems } = await loadKit(KIT_ROOT, fs);

    expect(kit.items).toEqual([]);
    expect(problems).toEqual([{ file: 'agents/architect.md', message: expect.stringMatching(message) }]);
  });

  it('reporta skill sem SKILL.md', async () => {
    const fs = new MemoryFileSystem({ [join(KIT_ROOT, 'skills', 'orphan', 'notes.md')]: 'x' });

    const { problems } = await loadKit(KIT_ROOT, fs);

    expect(problems).toEqual([
      { file: 'skills/orphan/SKILL.md', message: expect.stringMatching(/SKILL\.md/) },
    ]);
  });

  it('reporta diretório do kit inexistente', async () => {
    const { problems } = await loadKit(KIT_ROOT, new MemoryFileSystem());

    expect(problems).toEqual([{ file: KIT_ROOT, message: expect.stringMatching(/não encontrado/) }]);
  });

  it('o kit distribuído com o pacote é válido', async () => {
    const { kit, problems } = await loadKit(BUNDLED_KIT_DIRECTORY, new NodeFileSystem());

    expect(problems).toEqual([]);
    expect(kit.instructions).not.toBe('');
    expect(new Set(kit.items.map((item) => item.kind))).toEqual(new Set(['knowledge', 'skill', 'agent']));
  });
});
