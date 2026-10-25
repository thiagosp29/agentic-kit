import { posix } from 'node:path';
import type { Kit, KitItem, KitItemKind } from './kit.js';
import type { TargetLayout } from './targets.js';

export const BLOCK_START = '<!-- agentic-kit:start -->';
export const BLOCK_END = '<!-- agentic-kit:end -->';

const SECTIONS: ReadonlyArray<{ kind: KitItemKind; title: string; hint: string }> = [
  {
    kind: 'knowledge',
    title: 'Knowledge base',
    hint: 'Consulte antes de decisões de design ou revisão. Leia apenas o que for relevante para a tarefa.',
  },
  {
    kind: 'skill',
    title: 'Skills',
    hint: 'Procedimentos para tarefas específicas. Siga a skill correspondente quando a tarefa se encaixar.',
  },
  {
    kind: 'agent',
    title: 'Agents',
    hint: 'Perfis especializados para delegar tarefas.',
  },
];

/** Gera o bloco gerenciado com os princípios do kit e o índice dos itens instalados. */
export function renderInstructionsBlock(kit: Kit, layout: TargetLayout): string {
  const instructionsDirectory = posix.dirname(layout.instructionsFile);
  const linkTo = (item: KitItem): string =>
    posix.relative(instructionsDirectory, posix.join(layout.contentDirectory, item.manifest));

  const sections = SECTIONS.map(({ kind, title, hint }) => {
    const items = kit.items.filter((item) => item.kind === kind);
    if (items.length === 0) {
      return '';
    }
    const lines = items.map((item) => `- [\`${item.name}\`](${linkTo(item)}) — ${item.description}`);
    return [`### ${title}`, '', hint, '', ...lines].join('\n');
  });

  return [
    BLOCK_START,
    '## Agentic Kit',
    '',
    '> Seção gerada pelo `agentic-kit`. Escreva suas instruções fora dos marcadores: o conteúdo entre eles é substituído a cada instalação.',
    kit.instructions,
    ...sections,
    BLOCK_END,
  ]
    .filter((part) => part !== '')
    .join('\n\n');
}

/** Insere o bloco no fim do documento ou substitui o bloco existente, preservando o resto. */
export function upsertBlock(document: string | undefined, block: string): string {
  if (document === undefined || document.trim() === '') {
    return `${block}\n`;
  }

  const start = document.indexOf(BLOCK_START);
  const end = document.indexOf(BLOCK_END, start);
  if (start !== -1 && end !== -1) {
    return document.slice(0, start) + block + document.slice(end + BLOCK_END.length);
  }

  return `${document.trimEnd()}\n\n${block}\n`;
}
