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

| #   | Tarefa                                                           | Critério de aceite                                                                                                                           | Status                         |
| --- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| 1   | Agentes melhores (`code-reviewer`, `architect`, `test-engineer`) | escopo padrão, "quando entrar em ação", formato de saída fixo, código lido tratado como dado                                                 | feito (PR #6)                  |
| 2   | Destino `agents` em `.agents/`                                   | `install -t agents` grava em `.agents/skills/`, `.agents/agents/`, `.agents/knowledge/`; se existir `.ai/` de instalação antiga, a CLI avisa | feito (PR #7)                  |
| 3   | Vários destinos num comando                                      | `--target claude,agents` e `-t claude -t agents` instalam nos dois; destino repetido conta uma vez                                           | feito (PR #7)                  |
| 4   | Validação conforme Agent Skills                                  | `validate` reprova `name` com mais de 64 caracteres e `description` com mais de 1024                                                         | feito (PR #7)                  |
| 5   | Skill `debug`                                                    | procedimento de depuração com reprodução, hipóteses testadas uma a uma, teste que falha antes da correção; aparece no índice                 | feito (PR #7)                  |
| 6   | Instalar sem clonar                                              | `npx @thiagosp29/agentic-kit install ...` funciona; o pacote não dispara aviso de script de instalação no npm 11                             | feito (PR #8, 0.2.0 publicada) |

## Bugs

| #   | Bug                                                                                                                  | Correção                                                                                                                                     | Status                          |
| --- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| B1  | `-t claude -t agents` instalava só em `agents`, sem aviso                                                            | aceitar vários destinos (tarefa 3)                                                                                                           | feito (PR #7)                   |
| B2  | `npx github:...` falha no npm 11                                                                                     | publicar no npm como `@thiagosp29/agentic-kit` (o nome `agentic-kit` já é de outro autor)                                                    | feito (0.2.0 publicada)         |
| B3  | Reinstalar não atualizava arquivos de versões antigas do kit: apareciam como "alterados localmente" mesmo sem edição | registro do que foi instalado (`agentic-kit.lock.json`); versões anteriores ao registro reconhecidas por hash; CRLF/LF não conta como edição | feito (PR #15, 0.4.0 publicada) |

## Publicação

- O nome `agentic-kit` já existe no npm (outro autor), então o pacote sai como `@thiagosp29/agentic-kit`. O comando instalado continua sendo `agentic-kit`.
- O script `prepare` foi trocado por `prepack`: o npm 11 trata `prepare` como script de instalação e mostrava aviso a quem instalasse o pacote.
- `publicar.cmd` (dois cliques) confere o login no npm, atualiza a main, instala as dependências e publica. O `prepublishOnly` roda `check` e `validate:kit` antes.
- O npm exige 2FA para publicar, e contas novas não podem mais usar app autenticador (TOTP): a confirmação é por passkey (Windows Hello).
- 0.2.0 publicada em 15/11/2026. Conferido: `npx @thiagosp29/agentic-kit@0.2.0 install -t claude,agents` numa pasta limpa instala os dois destinos.
- 0.3.0 publicada em 16/11/2026: leva ao npm a skill `time-de-produto` (PR #11), que a 0.2.0 não tem. Conferido: `npx @thiagosp29/agentic-kit@0.3.0 install -t claude,agents` numa pasta limpa instala a skill nos dois destinos.
- 0.4.0 publicada em 25/11/2026: leva ao npm a correção do falso conflito na reinstalação (PR #15).
- 0.5.0 publicada em 25/11/2026: leva ao npm o kit ampliado (PR #17). Conferido: `npx @thiagosp29/agentic-kit@0.5.0 install -t claude,agents` numa pasta limpa instala os dois destinos, e a atualização da 0.4.0 preserva arquivo editado. Detalhes em `docs/backlog-kit-ampliado.md`.
- 0.5.1 publicada em 25/11/2026: leva ao npm a correção da reinstalação em CRLF (PR #20). Conferido com o pacote do npm: instalação limpa nos dois destinos, e uma 0.5.0 toda em CRLF reinstalada sem mudar nenhum byte.
- O token do `npm login` expira: a primeira tentativa da 0.3.0 parou no `npm whoami` com 401. Se o `publicar.cmd` falhar nesse passo, rode `npm login` e tente de novo.

## Fora do escopo, e por quê

- **Comando `uninstall`:** útil, mas nenhum usuário pediu ainda; o `--dry-run` e os marcadores do bloco já tornam a remoção manual segura.
- **Instalação seletiva (`--only`):** o kit é pequeno (16 itens); revisitar quando crescer.
- **MCP, hooks e permissões:** o kit não tem esse conteúdo; distribuir configuração vazia não ajuda.
- **Destino `agents` com `--global`:** cada ferramenta lê o `AGENTS.md` global num lugar diferente (`~/.codex/AGENTS.md` etc.); exige um destino por ferramenta.
- **Avaliação automática dos agentes (evals):** precisa de infraestrutura e de casos de teste próprios; fica para depois.
