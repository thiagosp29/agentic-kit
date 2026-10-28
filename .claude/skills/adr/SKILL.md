---
name: adr
description: Escreve um Architecture Decision Record (ADR) registrando contexto, opções consideradas e consequências. Use ao tomar ou documentar uma decisão técnica relevante.
---

# Architecture Decision Record

Um ADR registra **uma** decisão, por que foi tomada e o que ela implica. Ele é imutável: se a decisão mudar, escreva um novo ADR que substitui o anterior.

## Onde salvar

`docs/adr/NNNN-titulo-em-kebab-case.md`, numerado em sequência. Verifique o último número existente antes de criar.

## Template

```markdown
# NNNN. Título curto da decisão

- Status: proposto | aceito | substituído por NNNN | descontinuado
- Data: AAAA-MM-DD

## Contexto

Qual problema ou força motiva a decisão? Restrições, requisitos, números relevantes.

## Opções consideradas

1. **Opção A** — prós / contras
2. **Opção B** — prós / contras

## Decisão

Escolhemos **X** porque ...

## Consequências

- Positivas: ...
- Negativas / custos aceitos: ...
- O que precisa acontecer a seguir: ...
```

## Boas práticas

- Escreva para alguém que chega daqui a um ano sem contexto.
- Inclua ao menos duas opções reais; "não fazer nada" pode ser uma delas.
- Seja honesto sobre os custos da opção escolhida.
- Pergunte ao usuário o que não puder inferir do código e da conversa — não invente restrições.
