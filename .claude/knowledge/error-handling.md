---
name: error-handling
description: Como modelar, propagar, registrar e expor erros sem perder informação nem vazar detalhes.
---

# Tratamento de erros

## Nunca engula exceções

```ts
// ❌ O erro desaparece e o sistema segue em estado inválido
try {
  await sendInvoice(order);
} catch {}

// ✅ Trate o que sabe tratar; propague o resto com contexto
try {
  await sendInvoice(order);
} catch (error) {
  throw new InvoiceDeliveryError(order.id, { cause: error });
}
```

## Erros de domínio são explícitos

Crie tipos de erro com nome do negócio (`InsufficientBalanceError`, `PolicyAlreadyCancelledError`) em vez de `new Error('erro')`. Isso permite:

- mapear cada erro para a resposta certa na borda (HTTP 409, 422...);
- testar o caminho de erro com precisão;
- ler o log e entender o que aconteceu.

## Erro esperado vs. falha inesperada

| Tipo                        | Exemplo                       | Como tratar                                          |
| --------------------------- | ----------------------------- | ---------------------------------------------------- |
| Esperado (regra de negócio) | saldo insuficiente            | erro de domínio ou `Result`, mensagem para o usuário |
| Entrada inválida            | CPF malformado                | validar na borda, responder 400/422 com o campo      |
| Falha de infraestrutura     | timeout do banco              | retry com backoff se idempotente; senão propagar     |
| Bug                         | `undefined is not a function` | deixar falhar, registrar, alertar                    |

## Na borda do sistema

- Traduza erros internos para respostas estáveis; **nunca** devolva stack trace ao cliente.
- Registre uma vez, no ponto onde o erro é tratado — não em cada camada.
- Inclua um identificador de correlação no log e na resposta.
- Não registre segredos, tokens ou dados pessoais.

## Falhe cedo

Valide pré-condições no início (guard clauses) e na construção de value objects. Um objeto inválido não deveria nem existir.
