---
name: write-tests
description: Escreve testes para código novo ou existente seguindo AAA, nomes comportamentais e test doubles adequados. Use ao implementar uma feature, corrigir um bug ou cobrir código legado.
---

# Escrever testes

## Antes de escrever

1. Descubra o framework e as convenções do projeto: leia testes existentes vizinhos e copie o estilo (nomes de arquivo, builders, helpers).
2. Liste os comportamentos a cobrir: caminho feliz, casos de borda, caminhos de erro.
3. Para bug: escreva primeiro o teste que reproduz o bug e confirme que ele **falha**.

## Regras

- Estrutura Arrange / Act / Assert, um comportamento por teste.
- Nome descreve a regra: `rejeita reembolso após 30 dias`, não `test refund 2`.
- Prefira fakes em memória para portas (repositórios, gateways); use mocks só quando a interação é o comportamento.
- Controle tempo, IDs e aleatoriedade por injeção — nada de `sleep` ou dependência do relógio real.
- Não teste detalhes privados; teste pela interface pública.
- Sem lógica no teste (`if`, laços) — use `it.each` para tabelas de casos.

Referência completa: `knowledge/testing.md`.

## Depois de escrever

1. Rode a suíte e confirme que tudo passa.
2. Quebre temporariamente o código testado e confirme que o teste falha (o teste testa algo).
3. Reporte o que foi coberto e o que ficou de fora, com o motivo.
