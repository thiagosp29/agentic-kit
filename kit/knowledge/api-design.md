---
name: api-design
description: Contratos HTTP e interfaces públicas — consulte ao criar ou mudar endpoint, webhook, evento ou API de biblioteca.
---

# Design de APIs

Tudo o que é observável num contrato acaba virando dependência de alguém. Exponha o mínimo.

## HTTP

- Recurso no plural e substantivo: `POST /orders`, `GET /orders/{id}`. Ação que não cabe em CRUD: `POST /orders/{id}/cancellation`.
- `GET` não altera estado; `PUT` e `DELETE` são idempotentes.

| Situação                        | Status                              |
| ------------------------------- | ----------------------------------- |
| Criado                          | 201, com `Location`                 |
| Aceito para processar depois    | 202, com onde consultar             |
| Entrada malformada              | 400                                 |
| Não autenticado / sem permissão | 401 / 403 (ou 404 para não revelar) |
| Conflito de estado ou versão    | 409 (412 com `If-Match`)            |
| Regra de validação              | 422 (ou 400; escolha um e mantenha) |
| Limite excedido                 | 429, com `Retry-After`              |

## Erros com formato único

```json
{
  "type": "https://exemplo.com/erros/saldo-insuficiente",
  "title": "Saldo insuficiente",
  "status": 409,
  "detail": "O saldo não cobre o valor pedido.",
  "requestId": "req_123"
}
```

Formato Problem Details (RFC 9457). O cliente decide pelo `type`, nunca pelo texto.

## Detalhes que viram problema

- **Lista:** sempre paginada, com limite máximo; cursor quando os dados mudam durante a leitura.
- **Dinheiro:** inteiro na menor unidade (ou decimal em string) mais a moeda; nunca ponto flutuante.
- **Data:** ISO 8601 com fuso; data sem hora (`2026-01-31`) quando for data civil.
- **Identificador:** string opaca; sequencial revela volume.
- **Criação repetível:** aceite chave de idempotência em pagamento, pedido e envio; a mesma chave com corpo diferente é erro.
- **Concorrência:** versão ou `ETag` para não sobrescrever edição alheia.

## Evolução

| Compatível                      | Quebra o cliente                                 |
| ------------------------------- | ------------------------------------------------ |
| Novo campo opcional na entrada  | Novo campo obrigatório na entrada                |
| Novo campo na resposta          | Remover, renomear ou mudar tipo de campo         |
| Novo endpoint                   | Mudar significado, status ou valor padrão        |
| Aceitar mais valores na entrada | Novo valor de enum na resposta (cliente estrito) |

Para quebrar: publique a versão nova, anuncie prazo, meça quem usa a antiga e só então remova.

## Antes de publicar

- [ ] Autorização por recurso (veja `knowledge/security.md`)
- [ ] Contrato documentado (OpenAPI ou tipos) e testado, inclusive os erros
- [ ] Limites de tamanho, de página e de taxa definidos
- [ ] Nenhum campo interno ou pessoal sobrando na resposta
