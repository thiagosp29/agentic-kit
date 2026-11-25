---
name: performance-tuning
description: Investiga lentidão ou consumo excessivo com medição antes e depois de cada mudança. Use quando página, endpoint, consulta, build ou job estiver lento, ou para cumprir meta de desempenho.
---

# Melhorar desempenho

Referência de causas e números: `knowledge/performance.md`.

## 1. Medir

1. Escreva cenário e meta: "listar pedidos com 10 mil registros, p95 abaixo de 300 ms".
2. Crie um comando repetível em ambiente local ou de teste, com dados de tamanho realista. Nunca gere carga em produção.
3. Rode várias vezes; anote p50, p95 e a variação. Essa é a linha de base.

## 2. Localizar

Use o perfilador da plataforma, o contador de consultas, o plano de execução ou a cascata de rede. Siga o tempo do mais externo ao mais interno até achar o trecho que domina. Otimize só o que tem parcela relevante.

## 3. Mudar

Na ordem, do mais barato ao mais caro de manter:

1. Não fazer o trabalho (dado não usado, chamada repetida).
2. Fazer menos (paginar, filtrar no banco, agrupar, índice).
3. Fazer em paralelo, com limite, ou depois (fila).
4. Guardar o resultado (cache), com chave, validade e limite definidos.
5. Trocar algoritmo, estrutura ou infraestrutura.

Uma mudança por vez, com a suíte verde. Na dúvida sobre correção, escreva antes o teste de caracterização (skill `write-tests`).

## 4. Comparar

Mesmo comando, mesmos dados. Ganho menor que a variação: desfaça. Confira o que pode ter piorado: memória, escrita, primeira carga, clareza.

## 5. Proteger

Se a regressão for provável, deixe um limite automático estável, como número de consultas ou tamanho do pacote. Teste por tempo absoluto em CI costuma ser instável.

## Pronto quando

A meta foi atingida ou o limite está explicado, com tabela de antes e depois, comando para repetir e custos aceitos.
