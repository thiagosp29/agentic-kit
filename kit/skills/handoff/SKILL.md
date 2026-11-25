---
name: handoff
description: Registra o estado do trabalho para outra sessão, pessoa ou IA continuar sem redescobrir nada. Use ao pausar tarefa longa, trocar de sessão ou ferramenta, ou quando pedirem resumo para continuar depois.
---

# Passar o trabalho adiante

Escreva para quem não viu a conversa.

## Antes de escrever

1. Confira o estado real: branch, `git status`, commits não enviados, PR, CI, processos rodando.
2. Rode a verificação rápida ou diga que não rodou.
3. Não faça commit nem descarte mudanças só para "limpar": registre o que está pendente.

## Formato

Entregue na conversa. Se pedirem arquivo, use o local que o projeto definir ou `docs/handoff-<tema>.md`.

```markdown
# Handoff: <tema> (<data>)

## Objetivo

O pedido e os critérios de pronto.

## Estado

- Branch, commit, PR; mudanças não commitadas (o que são e de quem)
- Feito e verificado: com o comando
- Feito e não verificado
- Falta: em ordem

## Próximo passo

A primeira ação concreta: arquivo, comando, resultado esperado.

## Decisões

Escolha, motivo, e o que o usuário aprovou (nas palavras dele).

## O que não funcionou

Tentativa, resultado e por que descartar.

## Bloqueios e riscos

O que espera o usuário ou terceiro.
```

## Regras

- Aponte para spec, plano, ADR, commit e PR em vez de copiá-los.
- Separe fato verificado de suposição.
- Aprovação dada para uma ação não vale para outra: diga o alcance exato.
- Sem segredos, tokens ou dados pessoais.

## Pronto quando

Alguém sem a conversa consegue executar o próximo passo sem perguntar nada que você já sabia.
