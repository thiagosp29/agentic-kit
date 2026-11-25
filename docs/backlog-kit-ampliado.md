# Backlog: kit ampliado (nov/2026)

## O que a pesquisa mostrou

Comparados em 25/11/2026: [superpowers](https://github.com/obra/superpowers), [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills), [mattpocock/skills](https://github.com/mattpocock/skills), [wshobson/agents](https://github.com/wshobson/agents) e [anthropics/skills](https://github.com/anthropics/skills). Serviram de referência de temas; os textos do kit são próprios.

- **Ciclo completo.** superpowers, agent-skills e mattpocock/skills cobrem o caminho da ideia à entrega (brainstorm ou spec, plano, verificação). O kit começava no código.
- **Prova antes de "pronto".** superpowers (`verification-before-completion`) e agent-skills (`definition-of-done`) tratam isso como item próprio.
- **Adaptação ao repositório.** mattpocock/skills tem uma skill de setup por projeto. O kit era instalado igual em todos e não registrava comandos nem convenções.
- **Especialistas.** agent-skills traz auditores de segurança, acessibilidade e desempenho. O kit tinha só arquitetura, revisão e testes.
- **Custo de contexto.** A [documentação do Claude Code](https://code.claude.com/docs/en/skills) diz que as descrições das skills já entram no contexto, com orçamento de 1% da janela, e recomenda [CLAUDE.md abaixo de 200 linhas](https://code.claude.com/docs/en/memory). O bloco do kit repetia essas descrições.
- **Coleções enormes.** wshobson/agents tem centenas de itens por linguagem. Copiar isso custaria contexto em todo projeto: o kit segue independente de linguagem.

## Tarefas

| #   | Tarefa                               | Critério de aceite                                                                                                                                 | Status                          |
| --- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| 1   | Ciclo da ideia à entrega             | skills `project-setup`, `spec`, `implementation-plan`, `verify-done`, `pull-request`, `review-feedback`, `release`, `handoff` instaladas e válidas | feito (PR #17, 0.5.0 publicada) |
| 2   | Skills de qualidade                  | `security-audit`, `performance-tuning`, `dependency-update` instaladas e válidas                                                                   | feito (PR #17, 0.5.0 publicada) |
| 3   | Agents especialistas                 | `security-auditor`, `ux-reviewer`, `performance-analyst`, `qa-verifier` somente leitura no código (sem Edit/Write)                                 | feito (PR #17, 0.5.0 publicada) |
| 4   | Knowledge                            | `security`, `privacy-lgpd`, `accessibility`, `performance`, `api-design`, `database`, `observability`, `ci-cd`                                     | feito (PR #17, 0.5.0 publicada) |
| 5   | Índice enxuto no Claude Code         | o bloco do `CLAUDE.md` não repete descrições de skills e agents; o do `AGENTS.md` mantém tudo                                                      | feito (PR #17, 0.5.0 publicada) |
| 6   | Referências internas verificadas     | teste falha se um item citar skill, agent ou knowledge que não existe                                                                              | feito (PR #17, 0.5.0 publicada) |
| 7   | Sem colisão com nomes do Claude Code | teste falha se uma skill nova usar nome de comando embutido (`verify`, `security-review`...)                                                       | feito (PR #17, 0.5.0 publicada) |

## Bugs

| #   | Bug                                                                                                                                       | Teste que cobre                                       | Correção                                                                   | Status                          |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------- |
| B1  | Quem está na 0.3.0 ou anterior (sem registro) teria conflito falso ao pular para uma versão que mude outros arquivos do kit               | `tests/core/install-record.test.ts`                   | hashes de todos os arquivos distribuídos até a 0.3.0                       | feito (PR #17, 0.5.0 publicada) |
| B2  | Texto novo da knowledge `database` podia ser lido como "teste no banco de produção", e o passo de renomear coluna quebrava com `NOT NULL` | revisão de conteúdo                                   | texto corrigido                                                            | feito (PR #17, 0.5.0 publicada) |
| B3  | Teste de referências não via itens citados sem a palavra "skill/agent/knowledge" antes                                                    | `tests/kit/bundled-kit.test.ts` (provado por mutação) | todo identificador entre crases precisa ser item do kit ou exceção listada | feito (PR #17, 0.5.0 publicada) |
| B4  | `project-setup` mandava importar `@AGENTS.md`, carregando o bloco do kit duas vezes                                                       | revisão de conteúdo                                   | arquivo à parte quando os dois têm o bloco                                 | feito (PR #17, 0.5.0 publicada) |

## Fora do escopo (e por quê)

- **Itens por linguagem ou framework:** custam contexto em todo projeto e envelhecem rápido; `--kit` atende times.
- **Instalação seletiva (`--only`):** o índice enxuto reduz o custo; a seleção teria de ser lembrada entre reinstalações, o que pede desenho próprio.
- **Hooks, MCP e permissões:** mudam o ambiente do usuário; exigem escolha explícita.
- **Skill para criar skills:** a Anthropic já distribui `skill-creator`.
- **Remover arquivos retirados do kit:** nenhum foi retirado.
- **Avaliação automática das skills (evals):** continua sem infraestrutura; a qualidade foi conferida por revisão, não por medição de comportamento.

## Suposições

- Conteúdo em português, como o resto do kit.
- Nomes existentes (`code-review`, `debug`) colidem com comandos do Claude Code, mas foram mantidos para não quebrar quem usa.
- `privacy-lgpd` entra porque os projetos do mantenedor são brasileiros; é orientação de engenharia, não jurídica.
