import { join } from 'node:path';

export const KIT_ROOT = resolveFixture('kit');
export const PROJECT_ROOT = resolveFixture('project');
export const HOME_ROOT = resolveFixture('home');

function resolveFixture(name: string): string {
  return join('/fixtures', name);
}

export function manifest(name: string, description: string): string {
  return `---\nname: ${name}\ndescription: ${description}\n---\n\n# ${name}\n`;
}

/** Arquivos de um kit válido com um item de cada tipo, montados sob `KIT_ROOT`. */
export function validKitFiles(): Record<string, string> {
  return {
    [join(KIT_ROOT, 'instructions.md')]: '### Princípios\n\n1. Teste tudo.\n',
    [join(KIT_ROOT, 'knowledge', 'clean-code.md')]: manifest('clean-code', 'Regras de clean code.'),
    [join(KIT_ROOT, 'skills', 'code-review', 'SKILL.md')]: manifest('code-review', 'Revisa código.'),
    [join(KIT_ROOT, 'skills', 'code-review', 'checklist.md')]: '- [ ] item\n',
    [join(KIT_ROOT, 'agents', 'architect.md')]: manifest('architect', 'Desenha soluções.'),
  };
}
