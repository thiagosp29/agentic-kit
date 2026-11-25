---
name: spec
description: Transforma uma ideia ou pedido vago em especificação curta com problema, escopo, regras e critérios de aceite testáveis. Use antes de planejar feature nova, quando o pedido tiver mais de uma interpretação ou o que é "pronto" não estiver claro.
---

# Especificar

Descobrir o mal-entendido na spec custa uma pergunta; no PR, custa o PR.

Pule esta skill quando o pedido já for claro e pequeno.

## 1. Entender

1. Leia o código e os documentos relacionados antes de perguntar: não pergunte o que o repositório responde.
2. Separe o **problema** (quem sofre, quando, quanto) da **solução pedida**.
3. Liste as ambiguidades. Pergunte primeiro a que mais muda o resultado, com uma recomendação e as consequências de cada opção. Uma por vez.
4. O que for barato de reverter vira suposição registrada, não pergunta.

## 2. Escrever

Salve em `docs/specs/<tema>.md`, ou onde o projeto já guarda:

```markdown
# <Tema>

- Status: rascunho | aprovada | implementada

## Problema

Quem, em que situação, e o que acontece hoje.

## Resultado esperado

O que muda para a pessoa e como saberemos que funcionou.

## Regras e critérios de aceite

1. Dado <contexto>, quando <ação>, então <resultado observável>.

## Casos de borda e erros

Vazio, limite, duplicado, sem permissão, concorrência, dependência fora do ar.

## Fora do escopo

Item e motivo.

## Suposições e perguntas abertas

## Impactos

Dados pessoais, segurança, contratos, migração, desempenho, textos.
```

## 3. Testar a spec

- Cada critério dá para verificar com um teste ou uma observação? "Rápido" vira "p95 abaixo de 300 ms com 10 mil pedidos".
- Duas pessoas implementariam a mesma coisa?
- Há caminho de erro para cada dependência?
- Algum critério descreve a implementação em vez do resultado? Reescreva.
- Nada foi inventado: número sem fonte vira pergunta.

## Pronto quando

Os critérios são testáveis, as perguntas que bloqueiam têm resposta e o usuário aprovou. Se ele pediu autonomia, siga e destaque as suposições. Próximo passo: skill `implementation-plan`.
