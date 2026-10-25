# Como contribuir

## Ambiente

```bash
npm install       # instala dependências e compila
npm run check     # typecheck + lint + format + testes
```

Requer Node.js 20 ou superior.

## Adicionando conteúdo ao kit

| Tipo      | Onde                 | Arquivo                                       |
| --------- | -------------------- | --------------------------------------------- |
| Knowledge | `kit/knowledge/`     | `<nome>.md`                                   |
| Skill     | `kit/skills/<nome>/` | `SKILL.md` (+ arquivos de apoio, se precisar) |
| Agent     | `kit/agents/`        | `<nome>.md`                                   |

Todo item começa com frontmatter:

```markdown
---
name: nome-em-kebab-case
description: O que faz e QUANDO usar. A IA decide usar o item a partir desta frase.
---
```

Agents podem declarar também `tools:` (ex.: `Read, Grep, Glob`) para limitar o que o subagente pode fazer no Claude Code.

Boas práticas para o conteúdo:

- Seja específico e acionável: checklists e exemplos de antes/depois funcionam melhor que teoria.
- Mostre o anti-pattern antes do pattern correto.
- Mantenha cada arquivo focado em um assunto; prefira referenciar outro item do kit a repetir conteúdo.
- Evite conteúdo específico de uma empresa ou produto — este kit é genérico. Use `--kit` para kits internos.

Depois de adicionar, rode `npm run build && npm run validate:kit`.

## Pull requests

- Uma mudança lógica por PR, com testes.
- Commits no padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/).
- O CI precisa estar verde.
