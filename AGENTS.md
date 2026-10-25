# Instruções para agentes de IA

Este arquivo vale para qualquer assistente de IA trabalhando **neste repositório** (Claude Code, Codex, Copilot, Cursor, Gemini...).

## O projeto

`agentic-kit` tem duas partes:

- `kit/` — o conteúdo distribuído: `knowledge/` (referências), `skills/` (procedimentos, um diretório com `SKILL.md` cada) e `agents/` (perfis de subagentes), mais `instructions.md` (princípios inseridos no CLAUDE.md/AGENTS.md do usuário).
- `src/` — a CLI em TypeScript que valida e instala o kit.

## Arquitetura da CLI

```
src/
  core/      regras: carregar/validar kit, destinos, plano de instalação. Sem I/O direto.
  infra/     implementações de portas (NodeFileSystem)
  cli/       parsing de argumentos, comandos e saída
  index.ts   composition root
```

- `core/` depende apenas da porta `FileSystem`, nunca de `node:fs`.
- Instalar = `planInstall` (puro, calcula operações) + `applyPlan` (escreve). Mantenha essa separação: é o que permite `--dry-run` e testes sem disco.
- Sem dependências de runtime. Antes de adicionar uma, justifique por que a biblioteca padrão do Node não basta.

## Comandos

```bash
npm run check         # typecheck + lint + format + testes
npm run build         # compila para dist/
npm run validate:kit  # valida os manifestos do kit (após build)
```

## Convenções

- TypeScript estrito, ESM, imports com extensão `.js`.
- Testes em `tests/` espelhando `src/`, usando `MemoryFileSystem` como fake.
- Mensagens e documentação em português; identificadores de código em inglês.
- Todo item do kit tem frontmatter com `name` (kebab-case, igual ao nome do arquivo/pasta) e `description` (diz **quando** usar).
- Commits no padrão Conventional Commits.
