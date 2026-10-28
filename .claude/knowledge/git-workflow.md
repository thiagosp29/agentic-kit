---
name: git-workflow
description: Branches, commits convencionais e pull requests pequenos e revisáveis.
---

# Fluxo de Git

## Branches

- `main` está sempre pronta para deploy e protegida (PR + CI verde obrigatórios).
- Branches curtas, com prefixo do tipo: `feat/`, `fix/`, `refactor/`, `docs/`, `chore/`.
- Atualize a branch com a `main` com frequência para evitar conflitos grandes.

## Conventional Commits

```
<tipo>(<escopo opcional>): <resumo no imperativo, até ~72 caracteres>

<corpo opcional: o porquê da mudança, não o como>

<rodapé opcional: BREAKING CHANGE, refs a issues>
```

Tipos: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `perf`, `ci`, `build`.

```
❌ ajustes
❌ fix bug
✅ fix(checkout): recalcula frete quando o CEP muda
✅ refactor(orders): extrai cálculo de desconto para value object
```

- Um commit = uma mudança lógica que compila e passa nos testes.
- Refatoração e mudança de comportamento em commits separados.

## Pull requests

- Pequenos: idealmente menos de ~400 linhas alteradas.
- Descrição responde: **o que** muda, **por que**, **como foi testado**, riscos.
- O autor revisa o próprio diff antes de pedir revisão.
- Nunca faça commit de segredos, arquivos gerados ou `node_modules`.
