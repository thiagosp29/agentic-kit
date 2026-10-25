---
name: clean-code
description: Nomes, funções, comentários e duplicação — as regras de clean code que valem em qualquer linguagem.
---

# Clean Code

Código é lido muito mais vezes do que é escrito. Otimize para quem vai ler.

## Nomes revelam intenção

```ts
// ❌ O leitor precisa decifrar
const d = 86400000;
function calc(u: User[]): number {
  return u.filter((x) => x.s === 1).length;
}

// ✅ O nome responde "o que é" e "por que existe"
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
function countActiveUsers(users: User[]): number {
  return users.filter((user) => user.status === UserStatus.Active).length;
}
```

- Classes e tipos são substantivos (`Invoice`, `PaymentGateway`); funções são verbos (`calculateTotal`, `sendReceipt`).
- Booleanos leem como pergunta: `isExpired`, `hasPermission`, `canRetry`.
- Use o vocabulário do negócio (linguagem ubíqua), não o da implementação: `cancelPolicy`, não `updateStatusToThree`.
- Evite ruído: `data`, `info`, `manager`, `helper`, `util` raramente dizem algo.

## Funções pequenas, um nível de abstração

```ts
// ❌ Mistura orquestração com detalhe
async function checkout(cart: Cart) {
  if (cart.items.length === 0) throw new Error('empty');
  let total = 0;
  for (const item of cart.items) total += item.price * item.quantity;
  if (cart.coupon) total = total * (1 - cart.coupon.percent / 100);
  await db.query('INSERT INTO orders ...', [cart.id, total]);
}

// ✅ Lê como uma história; cada detalhe vive em um lugar
async function checkout(cart: Cart): Promise<Order> {
  ensureNotEmpty(cart);
  const total = applyCoupon(subtotalOf(cart), cart.coupon);
  return orders.save(Order.create(cart, total));
}
```

- Uma função faz uma coisa. Se o nome precisa de "e", são duas.
- Prefira poucos parâmetros; acima de três, agrupe em um objeto com nome.
- Evite flags booleanas como parâmetro (`render(true)`) — crie duas funções.
- Retorne cedo (guard clauses) em vez de aninhar `if`.

## Comentários explicam o porquê

```ts
// ❌ Repete o código
// incrementa o contador
counter++;

// ✅ Explica uma decisão que o código não mostra
// O gateway rejeita valores com mais de 2 casas decimais, mesmo em moedas que permitem 3.
const amount = roundToCents(rawAmount);
```

Se precisa de comentário para explicar **o que** o código faz, renomeie ou extraia uma função.

## Não duplique conhecimento (DRY)

Duplicação ruim é a mesma **regra de negócio** em dois lugares. Código parecido que muda por motivos diferentes não é duplicação — não force a abstração.

## Sem números e strings mágicos

Dê nome a constantes (`MAX_LOGIN_ATTEMPTS = 5`) e use enums ou union types para conjuntos fechados de valores.

## Regra do escoteiro

Deixe o código um pouco melhor do que encontrou — mas mantenha a refatoração separada da mudança de comportamento (commits diferentes).
