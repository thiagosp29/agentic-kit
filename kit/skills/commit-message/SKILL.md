---
name: commit-message
description: Gera mensagens de commit no padrão Conventional Commits a partir das mudanças em stage. Use ao commitar.
---

# Mensagem de commit

## Processo

1. Leia `git diff --staged` (e `git status` para ver arquivos novos).
2. Leia `git log --oneline -10` para seguir o idioma e o estilo já usados no repositório.
3. Se o stage mistura mudanças sem relação, sugira dividir em commits separados.
4. Escreva a mensagem.

## Formato

```
<tipo>(<escopo>): <resumo no imperativo>

<corpo: por que a mudança foi feita, em até 3 linhas curtas>
```

- Tipos: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `perf`, `ci`, `build`.
- Resumo com até ~72 caracteres, sem ponto final.
- Corpo explica o **porquê**; o diff já mostra o como.
- Mudança incompatível: rodapé `BREAKING CHANGE: <descrição>`.

Veja `knowledge/git-workflow.md` para exemplos.

## Nunca

- Commitar segredos, `.env`, arquivos gerados ou dependências.
- Usar `--no-verify` para pular hooks sem pedido explícito do usuário.
