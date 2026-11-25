# agentic-kit

Knowledge base, skills e agents para desenvolvimento assistido por IA, com boas práticas de engenharia e clean code.

Feito com foco no **Claude Code**, mas funciona com **qualquer IA** que lê `AGENTS.md` (Codex, GitHub Copilot, Cursor, Gemini CLI e outras).

## O que vem no kit

| Tipo                            | Itens                                                                                                                                                                                                    | Para quê                                             |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **Knowledge**                   | `clean-code`, `solid`, `clean-architecture`, `testing`, `error-handling`, `git-workflow`, `security`, `privacy-lgpd`, `accessibility`, `performance`, `api-design`, `database`, `observability`, `ci-cd` | Referências que a IA consulta antes de decidir       |
| **Skills: da ideia ao plano**   | `project-setup`, `spec`, `implementation-plan`, `adr`                                                                                                                                                    | Adaptar ao projeto, entender o pedido e planejar     |
| **Skills: código**              | `write-tests`, `debug`, `refactor`, `performance-tuning`, `dependency-update`                                                                                                                            | Construir, corrigir e manter                         |
| **Skills: qualidade e entrega** | `code-review`, `security-audit`, `verify-done`, `commit-message`, `pull-request`, `review-feedback`, `release`                                                                                           | Provar que está pronto e entregar                    |
| **Skills: condução**            | `time-de-produto`, `handoff`                                                                                                                                                                             | Ciclo completo por papéis e troca de sessão          |
| **Agents**                      | `architect`, `test-engineer`, `code-reviewer`, `qa-verifier`, `security-auditor`, `ux-reviewer`, `performance-analyst`                                                                                   | Subagentes especializados, com ferramentas limitadas |

Além disso, a instalação adiciona ao `CLAUDE.md` / `AGENTS.md` um bloco com os princípios de trabalho e um índice do que foi instalado. No Claude Code, que já carrega as descrições de skills e agents, o índice traz só os nomes deles, para economizar contexto.

## Instalação

Requer Node.js 20+. Sem instalar nada, direto no repositório do seu projeto:

```bash
npx @thiagosp29/agentic-kit install --target claude
```

Ou instale o comando `agentic-kit` globalmente:

```bash
npm install -g @thiagosp29/agentic-kit
```

Para usar a versão em desenvolvimento, clone o repositório e rode `npm install`, `npm run build` e `npm link`.

## Primeiros passos num projeto

1. Instale o kit na raiz do projeto.
2. Peça à IA: "use a skill project-setup". Ela roda os comandos seguros, registra stack, convenções e limites no `CLAUDE.md` ou `AGENTS.md`, fora do bloco do kit.
3. Trabalhe normalmente. O bloco instalado indica qual skill cabe em cada momento; tarefas pequenas não passam pelo fluxo inteiro.

## Uso

```bash
# No repositório do seu projeto, para o Claude Code
agentic-kit install --target claude

# Para todos os seus projetos (instala em ~/.claude)
agentic-kit install --target claude --global

# Para qualquer IA compatível com AGENTS.md
agentic-kit install --target agents

# Para os dois de uma vez
agentic-kit install --target claude,agents

# Ver o que seria feito, sem escrever nada
agentic-kit install --target claude --dry-run
```

| Destino           | Conteúdo                                                   | Instruções            |
| ----------------- | ---------------------------------------------------------- | --------------------- |
| `claude`          | `.claude/skills/`, `.claude/agents/`, `.claude/knowledge/` | `CLAUDE.md`           |
| `claude --global` | `~/.claude/...`                                            | `~/.claude/CLAUDE.md` |
| `agents`          | `.agents/skills/`, `.agents/agents/`, `.agents/knowledge/` | `AGENTS.md`           |

Codex, GitHub Copilot e Cursor encontram as skills em `.agents/skills/` sem configuração. Versões anteriores do kit instalavam em `.ai/`: ao reinstalar, a CLI avisa se essa pasta existir, para você conferir e apagar.

### É seguro rodar de novo

- Arquivos idênticos são ignorados.
- Arquivos do kit que você não alterou são atualizados para a versão nova. O registro do que foi instalado fica em `agentic-kit.lock.json`, dentro de `.claude/` ou `.agents/`; se você versiona essa pasta, versione o registro junto.
- Arquivos do kit que você alterou localmente **não** são sobrescritos (aparecem como conflito) — use `--force` se quiser substituí-los.
- No `CLAUDE.md` / `AGENTS.md`, só o bloco entre `<!-- agentic-kit:start -->` e `<!-- agentic-kit:end -->` é atualizado. O resto do arquivo é seu.

### Usando o kit do seu time

A CLI aceita qualquer diretório com a mesma estrutura:

```bash
agentic-kit validate --kit ../kit-do-meu-time
agentic-kit install --target claude --kit ../kit-do-meu-time
```

Assim você mantém conteúdo interno (domínio, produtos, padrões da empresa) num repositório privado e reaproveita a mesma ferramenta.

## Comandos

| Comando                | Descrição                                   |
| ---------------------- | ------------------------------------------- |
| `agentic-kit install`  | Instala o kit (veja as opções com `--help`) |
| `agentic-kit list`     | Lista os itens do kit e os destinos         |
| `agentic-kit validate` | Valida estrutura e frontmatter do kit       |

## Estrutura do repositório

```
kit/                 conteúdo distribuído
  instructions.md    princípios inseridos no CLAUDE.md/AGENTS.md
  knowledge/         referências
  skills/<nome>/     SKILL.md + arquivos de apoio
  agents/            perfis de subagentes
src/
  core/              regras (sem I/O direto)
  infra/             adaptadores (sistema de arquivos)
  cli/               comandos e parsing
tests/               testes com Vitest
```

## Desenvolvimento

```bash
npm run check    # typecheck + lint + format + testes
npm run build
```

Veja [CONTRIBUTING.md](CONTRIBUTING.md) para adicionar skills, agents e knowledge.

## Licença

[MIT](LICENSE)
