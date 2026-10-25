---
name: clean-architecture
description: Camadas, regra de dependência e portas e adaptadores (hexagonal) — como organizar um serviço.
---

# Clean Architecture e Hexagonal

## Regra de dependência

Dependências de código-fonte apontam **sempre para dentro**:

```
infrastructure  →  application  →  domain
(HTTP, banco,       (casos de uso,    (entidades, value objects,
 filas, SDKs)        portas)           regras de negócio)
```

- **domain** não importa nada de fora dele: nem framework, nem ORM, nem `process.env`.
- **application** orquestra o domínio e declara **portas** (interfaces) para o que precisa do mundo externo.
- **infrastructure** implementa as portas (**adaptadores**) e faz a composição (injeção de dependências).

## Estrutura sugerida

```
src/
  domain/          entidades, value objects, erros de domínio, eventos
  application/     casos de uso + portas (interfaces de repositórios, gateways)
  infrastructure/  adaptadores: http/, persistence/, messaging/
  main.ts          composition root — o único lugar que conhece tudo
```

## Portas e adaptadores

```ts
// application/ports/payment-gateway.ts — definida por quem usa
export interface PaymentGateway {
  charge(amount: Money, customer: CustomerId): Promise<ChargeResult>;
}

// infrastructure/payments/stripe-payment-gateway.ts — detalhe substituível
export class StripePaymentGateway implements PaymentGateway {
  /* ... */
}
```

## Anti-patterns comuns

| Anti-pattern                                      | Correção                                                    |
| ------------------------------------------------- | ----------------------------------------------------------- |
| Entidade anotada com decorators do ORM            | Mapeie entre modelo de persistência e entidade no adaptador |
| Caso de uso recebe `req`/`res` do framework       | Receba um comando/DTO simples; o controller traduz          |
| Regra de negócio no controller ou na query SQL    | Mova para a entidade ou para o caso de uso                  |
| "Anemic domain": entidades só com getters/setters | Coloque invariantes e comportamento dentro da entidade      |
| Evento de domínio publicado antes de persistir    | Publique **após** salvar com sucesso (ou use outbox)        |

## Quando não usar

Scripts, protótipos e CRUDs triviais não precisam de todas as camadas. Aplique a regra de dependência na proporção da complexidade do domínio.
