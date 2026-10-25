import { describe, expect, it } from 'vitest';
import { BLOCK_END, BLOCK_START, renderInstructionsBlock, upsertBlock } from '../../src/core/instructions.js';
import type { Kit } from '../../src/core/kit.js';

const kit: Kit = {
  root: '/kit',
  instructions: '### Princípios',
  items: [
    {
      kind: 'knowledge',
      name: 'testing',
      description: 'Testes.',
      manifest: 'knowledge/testing.md',
      files: ['knowledge/testing.md'],
    },
    {
      kind: 'skill',
      name: 'adr',
      description: 'Escreve ADRs.',
      manifest: 'skills/adr/SKILL.md',
      files: ['skills/adr/SKILL.md'],
    },
  ],
};

describe('renderInstructionsBlock', () => {
  it('inclui princípios e links relativos ao arquivo de instruções do projeto', () => {
    const block = renderInstructionsBlock(kit, {
      contentDirectory: '.claude',
      instructionsFile: 'CLAUDE.md',
    });

    expect(block.startsWith(BLOCK_START)).toBe(true);
    expect(block.endsWith(BLOCK_END)).toBe(true);
    expect(block).toContain('### Princípios');
    expect(block).toContain('- [`testing`](.claude/knowledge/testing.md) — Testes.');
    expect(block).toContain('- [`adr`](.claude/skills/adr/SKILL.md) — Escreve ADRs.');
    expect(block).not.toContain('### Agents');
  });

  it('gera links relativos quando o arquivo de instruções está dentro do diretório de conteúdo', () => {
    const block = renderInstructionsBlock(kit, {
      contentDirectory: '.claude',
      instructionsFile: '.claude/CLAUDE.md',
    });

    expect(block).toContain('(knowledge/testing.md)');
  });
});

describe('upsertBlock', () => {
  const block = `${BLOCK_START}\nnovo\n${BLOCK_END}`;

  it('cria o documento quando ele não existe', () => {
    expect(upsertBlock(undefined, block)).toBe(`${block}\n`);
  });

  it('adiciona o bloco ao final preservando o conteúdo do usuário', () => {
    expect(upsertBlock('# Meu projeto\n', block)).toBe(`# Meu projeto\n\n${block}\n`);
  });

  it('substitui apenas o bloco existente', () => {
    const document = `# Antes\n\n${BLOCK_START}\nvelho\n${BLOCK_END}\n\n# Depois\n`;

    expect(upsertBlock(document, block)).toBe(`# Antes\n\n${block}\n\n# Depois\n`);
  });
});
