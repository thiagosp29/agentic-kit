---
name: implementation-plan
description: Quebra uma spec ou mudança grande em fatias pequenas, ordenadas e verificáveis, e conduz a execução uma a uma. Use quando a mudança tocar vários arquivos ou módulos, levar mais de uma sessão ou precisar de ordem segura.
---

# Planejar e executar

Mudança de um ou dois arquivos não precisa de plano escrito: faça e verifique.

## 1. Planejar

1. Leia a spec e o código que será tocado. Com decisão estrutural em aberto, use o agent `architect`; se for cara de reverter, registre com a skill `adr`.
2. Fatie **na vertical**: cada fatia entrega um comportamento de ponta a ponta. "Todo o banco, depois toda a API, depois toda a tela" só descobre erro no fim.
3. Ponha o maior risco primeiro: a integração duvidosa, a regra mal conhecida.
4. Refatoração preparatória e migração são fatias próprias.

Salve em `docs/planos/<tema>.md`:

```markdown
# Plano: <tema>

Spec: docs/specs/<tema>.md

| #   | Fatia | Arquivos | Depende de | Como verificar | Critérios | Status   |
| --- | ----- | -------- | ---------- | -------------- | --------- | -------- |
| 1   | ...   | ...      | —          | `comando`      | 1, 2      | pendente |

## Riscos e rollback

## Descobertas
```

Cada fatia cabe num commit revisável, deixa a suíte verde e tem verificação própria. Todo critério da spec aparece em alguma fatia.

## 2. Executar

Para cada fatia:

1. Escreva o teste do comportamento e veja-o falhar (skill `write-tests`).
2. Implemente o mínimo.
3. Rode a verificação da fatia e a suíte.
4. Releia o diff: só o que a fatia pedia?
5. Commit, se o usuário autorizou (skill `commit-message`), e atualize o status.

Descobriu algo que invalida o plano? Pare, registre em "Descobertas" e ajuste o plano antes do código. Se mudar escopo ou critério, volte ao usuário. Se um erro resistir, use a skill `debug`.

Trabalho em paralelo só entre fatias sem arquivos nem dependências em comum.

## Pronto quando

Todas as fatias estão concluídas e verificadas, e a skill `verify-done` passou contra a spec.
