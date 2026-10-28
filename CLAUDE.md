@AGENTS.md

## Específico do Claude Code

- Antes de declarar uma tarefa concluída, rode `npm run check`.
- Ao criar uma skill ou agent novo no kit, rode `npm run build && npm run validate:kit`.
- Para testar a instalação de ponta a ponta sem tocar em projetos reais, use `--dry-run` ou `--dir` apontando para uma pasta temporária.
- `.claude/` é uma cópia de `kit/` instalada no próprio repositório. Depois de mudar algo em `kit/`, rode `npm run build && node dist/index.js install --target claude --force` e commite as duas pastas juntas.

<!-- agentic-kit:start -->

## Agentic Kit

> Seção gerada pelo `agentic-kit`. Escreva suas instruções fora dos marcadores: o conteúdo entre eles é substituído a cada instalação.

### Princípios de trabalho

1. **Entenda antes de mudar** — leia o código ao redor e siga as convenções existentes (nomes, estrutura, estilo, densidade de comentários).
2. **Mudanças pequenas e verificáveis** — um objetivo por mudança; rode build, lint e testes antes de declarar algo pronto.
3. **Testes acompanham o código** — todo comportamento novo ou bug corrigido ganha um teste que falharia sem a mudança.
4. **Clareza acima de esperteza** — nomes que revelam intenção, funções pequenas com um só nível de abstração, sem duplicação de conhecimento.
5. **Dependências apontam para dentro** — regras de negócio não conhecem framework, banco de dados ou HTTP.
6. **Erros explícitos** — nunca engula exceções; falhe cedo, com mensagens que digam o que fazer.
7. **Segurança por padrão** — nenhum segredo no código ou em logs; valide toda entrada externa.
8. **Honestidade sobre o estado** — se algo não foi testado, falhou ou ficou pendente, diga claramente.

### Knowledge base

Consulte antes de decisões de design ou revisão. Leia apenas o que for relevante para a tarefa.

- [`clean-architecture`](.claude/knowledge/clean-architecture.md) — Camadas, regra de dependência e portas e adaptadores (hexagonal) — como organizar um serviço.
- [`clean-code`](.claude/knowledge/clean-code.md) — Nomes, funções, comentários e duplicação — as regras de clean code que valem em qualquer linguagem.
- [`error-handling`](.claude/knowledge/error-handling.md) — Como modelar, propagar, registrar e expor erros sem perder informação nem vazar detalhes.
- [`git-workflow`](.claude/knowledge/git-workflow.md) — Branches, commits convencionais e pull requests pequenos e revisáveis.
- [`solid`](.claude/knowledge/solid.md) — Os cinco princípios SOLID com exemplos de violação e correção em TypeScript.
- [`testing`](.claude/knowledge/testing.md) — Estratégia de testes — pirâmide, estrutura AAA, test doubles e o que torna um teste confiável.

### Skills

Procedimentos para tarefas específicas. Siga a skill correspondente quando a tarefa se encaixar.

- [`adr`](.claude/skills/adr/SKILL.md) — Escreve um Architecture Decision Record (ADR) registrando contexto, opções consideradas e consequências. Use ao tomar ou documentar uma decisão técnica relevante.
- [`code-review`](.claude/skills/code-review/SKILL.md) — Revisa um diff, arquivo ou PR procurando bugs, violações de arquitetura e problemas de clareza. Use ao revisar PRs, validar código gerado ou antes de abrir um PR.
- [`commit-message`](.claude/skills/commit-message/SKILL.md) — Gera mensagens de commit no padrão Conventional Commits a partir das mudanças em stage. Use ao commitar.
- [`refactor`](.claude/skills/refactor/SKILL.md) — Refatora código em passos pequenos e seguros, sem mudar comportamento. Use quando o código está difícil de ler, testar ou estender.
- [`write-tests`](.claude/skills/write-tests/SKILL.md) — Escreve testes para código novo ou existente seguindo AAA, nomes comportamentais e test doubles adequados. Use ao implementar uma feature, corrigir um bug ou cobrir código legado.

### Agents

Perfis especializados para delegar tarefas.

- [`architect`](.claude/agents/architect.md) — Arquiteto de software. Use para desenhar uma feature ou serviço novo, avaliar trade-offs entre abordagens, ou revisar se a estrutura de um módulo respeita a regra de dependência.
- [`code-reviewer`](.claude/agents/code-reviewer.md) — Revisor de código sênior. Use após implementar uma mudança ou ao revisar um PR, para encontrar bugs, violações de arquitetura e problemas de clareza antes do merge.
- [`test-engineer`](.claude/agents/test-engineer.md) — Engenheiro de testes. Use para escrever ou melhorar testes de uma feature, reproduzir um bug com um teste que falha, ou aumentar a confiança em código legado antes de uma refatoração.

<!-- agentic-kit:end -->
