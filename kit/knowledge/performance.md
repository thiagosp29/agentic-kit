---
name: performance
description: Medir e melhorar desempenho de página, API e banco — consulte quando algo está lento, antes de otimizar ou ao definir metas de desempenho.
---

# Desempenho

Meça, mude uma coisa, meça de novo. Otimização sem medição é palpite que custa clareza.

## Defina a meta

Use percentis, não média: p95 e p99 mostram quem sofre. Anote carga, dados e ambiente da medição, senão a comparação não vale.

Core Web Vitals, no percentil 75 das visitas reais: LCP até 2,5 s, INP até 200 ms, CLS até 0,1.

## Onde o tempo costuma estar

| Sintoma                          | Suspeito                                  | Verificação                       |
| -------------------------------- | ----------------------------------------- | --------------------------------- |
| Lento conforme a lista cresce    | N+1, falta de paginação, laço aninhado    | contar consultas por requisição   |
| Lento só com muitos dados        | falta de índice                           | plano de execução com dados reais |
| Lento sob carga, rápido sozinho  | pool esgotado, lock, fila                 | tempo de espera por conexão       |
| Primeira resposta lenta          | cold start, cache frio                    | comparar 1ª e 2ª chamadas         |
| Página demora a mostrar conteúdo | imagem principal, CSS ou fonte bloqueando | cascata de rede                   |
| Clique demora a responder        | tarefa longa de JavaScript                | perfil da thread principal        |
| Memória só cresce                | cache sem limite, listener não removido   | comparar dois heap snapshots      |

## N+1

```ts
// ❌ 1 + N consultas
const orders = await db.orders.list();
for (const order of orders) order.customer = await db.customers.find(order.customerId);

// ✅ 2 consultas
const orders = await db.orders.list();
const customers = await db.customers.findMany(orders.map((order) => order.customerId));
```

## Cache

Antes de criar um cache, responda: qual é a chave (inclui usuário e permissões?), quando invalida, quanto pode ficar desatualizado, qual o limite de tamanho. Sem essas respostas, o cache vira bug. Dado de um usuário nunca entra em cache compartilhado sem ele na chave.

## Rede e concorrência

- Todo I/O externo tem timeout; retry só em operação idempotente, com espera crescente e variação aleatória.
- Chamadas independentes em paralelo, com limite de concorrência.
- Trabalho demorado sai da requisição para uma fila.

## Front-end

- Imagem no tamanho exibido, formato moderno, com `width` e `height`; a principal não usa `loading="lazy"`.
- Carregue só o JavaScript da página; terceiros com `async`/`defer` e justificativa.
- Reserve espaço para o que chega depois (anúncio, imagem, aviso).

## Quando parar

Ao atingir a meta. Ganho dentro do ruído da medição não é ganho: desfaça a mudança.
