---
name: refactor
description: Refatora código em passos pequenos e seguros, sem mudar comportamento. Use quando o código está difícil de ler, testar ou estender.
---

# Refatorar

Refatorar é mudar a estrutura **sem mudar o comportamento**. Se o comportamento muda, é outra tarefa.

## Pré-condição: rede de segurança

1. Existem testes cobrindo o comportamento do trecho? Rode-os e confirme que passam.
2. Se não existem, escreva testes de caracterização (que registram o comportamento atual) antes de mexer.

## Passo a passo

Faça uma transformação por vez e rode os testes após cada uma:

| Sintoma                                     | Refatoração                             |
| ------------------------------------------- | --------------------------------------- |
| Função longa, vários níveis de abstração    | Extrair função                          |
| Nome que não explica                        | Renomear                                |
| Condicional repetido por tipo               | Substituir condicional por polimorfismo |
| Muitos parâmetros                           | Introduzir objeto de parâmetro          |
| Primitivo com regra (CPF, e-mail, dinheiro) | Introduzir value object                 |
| Classe com vários motivos para mudar        | Extrair classe                          |
| `if` aninhados                              | Guard clauses / retorno antecipado      |
| Código morto                                | Remover                                 |

## Regras

- Não misture refatoração com feature ou correção no mesmo commit.
- Preserve a API pública, a menos que a mudança dela seja o objetivo combinado.
- Prefira as refatorações automáticas da IDE/LSP quando disponíveis.
- Pare quando o código estiver claro o bastante para a próxima mudança — não refatore o mundo.

Ao terminar, resuma o que mudou na estrutura e confirme que os testes continuam verdes.
