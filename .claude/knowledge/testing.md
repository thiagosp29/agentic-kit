---
name: testing
description: Estratégia de testes — pirâmide, estrutura AAA, test doubles e o que torna um teste confiável.
---

# Testes

## Pirâmide

- **Unitários (maioria)**: domínio e casos de uso, rápidos, sem I/O.
- **Integração**: adaptadores contra a dependência real (banco em container, API em sandbox).
- **End-to-end (poucos)**: os fluxos críticos do usuário.

## Estrutura: Arrange, Act, Assert

```ts
it('aplica 10% de desconto para clientes premium', () => {
  // Arrange
  const customer = aCustomer({ tier: 'premium' });
  const order = anOrder({ customer, subtotal: Money.of(200) });

  // Act
  const total = order.total();

  // Assert
  expect(total).toEqual(Money.of(180));
});
```

- O nome descreve o **comportamento** e a regra, não o método testado.
- Um comportamento por teste. Vários `expect` são ok se verificam o mesmo resultado.
- Use builders (`aCustomer`, `anOrder`) para esconder dados irrelevantes ao teste.

## Teste comportamento, não implementação

```ts
// ❌ Quebra a cada refatoração
expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({ status: 2 }));

// ✅ Verifica o resultado observável
await cancelOrder.execute({ orderId });
expect(await orders.findById(orderId)).toMatchObject({ status: 'cancelled' });
```

## Test doubles

- **Fake** (implementação em memória de uma porta) é o preferido para repositórios.
- **Stub** para respostas fixas de dependências externas.
- **Mock** só quando a interação **é** o comportamento (ex.: "deve enviar exatamente um e-mail").
- Não faça mock do que você não controla em testes de integração — teste o adaptador contra a coisa real.

## Testes confiáveis

- Determinísticos: injete relógio, gerador de IDs e aleatoriedade.
- Independentes: nenhuma ordem de execução necessária, nenhum estado compartilhado.
- Rápidos: a suíte unitária deve rodar em segundos.
- Um bug corrigido ganha primeiro um teste que reproduz o bug (vermelho), depois a correção (verde).

## Cobertura

Cobertura é um sinal, não uma meta. Priorize regras de negócio, casos de borda (vazio, nulo, limite, duplicado) e caminhos de erro.
