import { describe, expect, it } from 'vitest';
import { hashContent, isPristine } from '../../src/core/install-record.js';

const NO_RECORD = new Map<string, string>();

// SKILL.md de commit-message como distribuído na 0.3.0.
const COMMIT_MESSAGE_0_3_0 =
  '---\nname: commit-message\ndescription: Gera mensagens de commit no padrão Conventional Commits a partir das mudanças em stage. Use ao commitar.\n---\n\n# Mensagem de commit\n\n## Processo\n\n1. Leia `git diff --staged` (e `git status` para ver arquivos novos).\n2. Leia `git log --oneline -10` para seguir o idioma e o estilo já usados no repositório.\n3. Se o stage mistura mudanças sem relação, sugira dividir em commits separados.\n4. Escreva a mensagem.\n\n## Formato\n\n```\n<tipo>(<escopo>): <resumo no imperativo>\n\n<corpo: por que a mudança foi feita, em até 3 linhas curtas>\n```\n\n- Tipos: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `perf`, `ci`, `build`.\n- Resumo com até ~72 caracteres, sem ponto final.\n- Corpo explica o **porquê**; o diff já mostra o como.\n- Mudança incompatível: rodapé `BREAKING CHANGE: <descrição>`.\n\nVeja `knowledge/git-workflow.md` para exemplos.\n\n## Nunca\n\n- Commitar segredos, `.env`, arquivos gerados ou dependências.\n- Usar `--no-verify` para pular hooks sem pedido explícito do usuário.\n';

// test-engineer.md da primeira versão do kit.
const FIRST_TEST_ENGINEER =
  '---\nname: test-engineer\ndescription: Engenheiro de testes. Use para escrever ou melhorar testes de uma feature, reproduzir um bug com um teste que falha, ou aumentar a confiança em código legado antes de uma refatoração.\ntools: Read, Grep, Glob, Edit, Write, Bash\n---\n\nVocê é um engenheiro de testes pragmático. Testes bons documentam regras de negócio e dão coragem para mudar o código.\n\n## Como trabalhar\n\n1. Leia o código alvo e os testes vizinhos; siga o framework, os helpers e o estilo já usados.\n2. Siga a skill `write-tests` e a knowledge `testing`.\n3. Para bugs: escreva o teste que reproduz o problema e mostre que ele falha antes de qualquer correção.\n4. Rode a suíte inteira ao final.\n\n## Regras\n\n- Não altere código de produção, exceto para torná-lo testável (injeção de dependência) — e explique por quê.\n- Nunca enfraqueça ou apague um teste existente para fazer a suíte passar.\n- Reporte o que foi coberto, o que não foi e qualquer teste instável encontrado.\n';

describe('isPristine sem registro de instalação', () => {
  it('reconhece um arquivo distribuído até a 0.3.0', () => {
    expect(isPristine('skills/commit-message/SKILL.md', COMMIT_MESSAGE_0_3_0, NO_RECORD)).toBe(true);
  });

  it('não reconhece o mesmo arquivo depois de editado', () => {
    expect(isPristine('skills/commit-message/SKILL.md', COMMIT_MESSAGE_0_3_0 + 'x', NO_RECORD)).toBe(false);
  });

  it('não reconhece o conteúdo de um item no caminho de outro', () => {
    expect(isPristine('skills/adr/SKILL.md', COMMIT_MESSAGE_0_3_0, NO_RECORD)).toBe(false);
  });

  it('reconhece uma versão anterior à última distribuída sem registro', () => {
    expect(isPristine('agents/test-engineer.md', FIRST_TEST_ENGINEER, NO_RECORD)).toBe(true);
  });

  it('ignora a diferença entre CRLF e LF', () => {
    expect(hashContent('a\r\nb')).toBe(hashContent('a\nb'));
  });
});
