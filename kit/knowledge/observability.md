---
name: observability
description: Logs, métricas, traces e alertas que permitem diagnosticar produção — consulte ao criar serviço, job, integração ou fluxo crítico.
---

# Observabilidade

A pergunta de projeto é: quando isto falhar às 3 da manhã, o que vai mostrar onde e por quê?

| Sinal   | Responde                 | Exemplo                               |
| ------- | ------------------------ | ------------------------------------- |
| Métrica | Está ruim? Quanto?       | taxa de erro, p95, tamanho da fila    |
| Trace   | Onde, entre os serviços? | 1,8 s dos 2 s no gateway de pagamento |
| Log     | O que houve neste caso?  | `payment_declined` com `orderId`      |

## Logs

```ts
// ❌ Não dá para filtrar nem contar
logger.info(`Pedido ${id} falhou: ${error}`);

// ✅ Evento estável, campos, causa
logger.error('order_payment_failed', { orderId, gateway, requestId, error });
```

- Estruturado, com nome de evento fixo e identificador de correlação que atravessa serviços e filas.
- `error`: alguém precisa agir. `warn`: anormal, tratado. `info`: fato de negócio. `debug`: desligado em produção.
- Registre uma vez, onde o erro é tratado. Sem segredo nem dado pessoal (veja `knowledge/privacy-lgpd.md`).

## Métricas

- Serviço: taxa de requisições, erros e duração. Recurso: uso, saturação e erros.
- Inclua ao menos uma métrica de negócio (pedidos pagos por minuto): ela cai mesmo quando o HTTP responde 200.
- Rótulo com valores limitados. `userId` ou URL com id como rótulo explode o custo.

## Saúde

- **Liveness** (reiniciar?) não consulta dependências. **Readiness** (receber tráfego?) consulta só as indispensáveis.
- Job agendado avisa quando **não** rodou, além de quando falhou.

## Alertas

- Alerte no sintoma que o usuário sente, não em toda causa possível.
- Todo alerta tem ação, dono e link para o procedimento. Alerta que ninguém atende é removido ou corrigido.
- Prefira meta de serviço e consumo da margem de erro a limites arbitrários.

## Antes de publicar um fluxo crítico

- [ ] Sucesso e falha distinguíveis por métrica
- [ ] Uma requisição pode ser seguida de ponta a ponta
- [ ] Alerta testado disparando de propósito
- [ ] Versão implantada visível em logs e erros
