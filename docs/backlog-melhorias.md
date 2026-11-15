# Backlog: melhorias do agentic-kit (nov/2026)

## O que a pesquisa mostrou

Projetos comparados: [ruler](https://github.com/intellectronica/ruler), [rulesync](https://github.com/dyoshikawa/rulesync), [superpowers](https://github.com/obra/superpowers), [wshobson/agents](https://github.com/wshobson/agents), [claude-code-templates](https://github.com/davila7/claude-code-templates) e os agentes oficiais em [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official).

- **Pasta de skills padrão.** Codex, GitHub Copilot e Cursor procuram skills em `.agents/skills/` (documentação oficial de cada um). O destino `agents` instalava em `.ai/`, que nenhuma ferramenta lê sozinha: as skills só eram achadas pelo índice no `AGENTS.md`.
- **Formato Agent Skills.** A especificação ([agentskills.io](https://agentskills.io/specification)) limita `name` a 64 caracteres e `description` a 1024. O validador do kit não checava isso.
- **Vários destinos de uma vez.** ruler e rulesync aplicam a vários agentes num só comando (`--agents a,b`, `--targets "*"`). No kit, repetir `--target` fazia o último valor vencer sem aviso.
- **Conteúdo.** A skill mais citada do superpowers é depuração sistemática (causa raiz antes de corrigir). O kit não tinha nada para depuração.
- **Agentes.** Os agentes oficiais da Anthropic trazem escopo padrão, cenários de uso, filtro de falsos positivos e proteção contra instruções no código lido.
- **Instalar sem clonar.** Os concorrentes rodam via `npx`. `npx github:thiagosp29/agentic-kit` falha no npm 11 (`EALLOWSCRIPTS`: o npm bloqueia o `prepare` de dependências git).

## Tarefas

| #   | Tarefa                                                           | Critério de aceite                                                                                                                           | Status                               |
| --- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| 1   | Agentes melhores (`code-reviewer`, `architect`, `test-engineer`) | escopo padrão, "quando entrar em ação", formato de saída fixo, código lido tratado como dado                                                 | feito (PR #6)                        |
| 2   | Destino `agents` em `.agents/`                                   | `install -t agents` grava em `.agents/skills/`, `.agents/agents/`, `.agents/knowledge/`; se existir `.ai/` de instalação antiga, a CLI avisa | feito                                |
| 3   | Vários destinos num comando                                      | `--target claude,agents` e `-t claude -t agents` instalam nos dois; destino repetido conta uma vez                                           | feito                                |
| 4   | Validação conforme Agent Skills                                  | `validate` reprova `name` com mais de 64 caracteres e `description` com mais de 1024                                                         | feito                                |
| 5   | Skill `debug`                                                    | procedimento de depuração com reprodução, hipóteses testadas uma a uma, teste que falha antes da correção; aparece no índice                 | feito                                |
| 6   | Instalar sem clonar                                              | `npx agentic-kit install ...` funciona                                                                                                       | pendente: depende de publicar no npm |

## Bugs

| #   | Bug                                                       | Correção                                          | Status |
| --- | --------------------------------------------------------- | ------------------------------------------------- | ------ |
| B1  | `-t claude -t agents` instalava só em `agents`, sem aviso | aceitar vários destinos (tarefa 3)                | feito  |
| B2  | `npx github:...` falha no npm 11                          | publicar no npm (tarefa 6), não resolve no código | aberto |

## Fora do escopo, e por quê

- **Comando `uninstall`:** útil, mas nenhum usuário pediu ainda; o `--dry-run` e os marcadores do bloco já tornam a remoção manual segura.
- **Instalação seletiva (`--only`):** o kit é pequeno (15 itens); revisitar quando crescer.
- **MCP, hooks e permissões:** o kit não tem esse conteúdo; distribuir configuração vazia não ajuda.
- **Destino `agents` com `--global`:** cada ferramenta lê o `AGENTS.md` global num lugar diferente (`~/.codex/AGENTS.md` etc.); exige um destino por ferramenta.
- **Avaliação automática dos agentes (evals):** precisa de infraestrutura e de casos de teste próprios; fica para depois.
