---
name: code-review
description: Revisa um diff, arquivo ou PR procurando bugs, violações de arquitetura e problemas de clareza. Use ao revisar PRs, validar código gerado ou antes de abrir um PR.
---

# Code Review

Revise focando no que importa para quem vai manter o código. Correção vem antes de estilo.

## Processo

1. Entenda o objetivo da mudança (descrição do PR, commits, issue).
2. Leia o diff inteiro antes de comentar; depois volte aos trechos suspeitos com o contexto ao redor.
3. Para cada suspeita de bug, construa o cenário concreto (entrada → resultado errado). Sem cenário, não é bug.
4. Classifique e reporte.

## Checklist

### Correção

- [ ] Casos de borda: vazio, nulo, limite, duplicado, concorrência
- [ ] Erros tratados ou propagados com contexto — nada engolido (veja `knowledge/error-handling.md`)
- [ ] Operações com efeito colateral são idempotentes quando podem ser repetidas
- [ ] Sem regressão de comportamento existente

### Arquitetura

- [ ] Dependências apontam para dentro (veja `knowledge/clean-architecture.md`)
- [ ] Domínio sem imports de infraestrutura ou framework
- [ ] Regra de negócio na entidade/caso de uso, não no controller ou na query

### Clareza

- [ ] Nomes revelam intenção e usam o vocabulário do negócio (veja `knowledge/clean-code.md`)
- [ ] Funções pequenas, um nível de abstração
- [ ] Sem duplicação de regra de negócio; sem abstração prematura

### Testes

- [ ] Comportamento novo e bugs corrigidos têm teste
- [ ] Testes verificam comportamento, não implementação (veja `knowledge/testing.md`)

### Segurança

- [ ] Nenhum segredo, token ou dado pessoal em código ou log
- [ ] Entrada externa validada; queries parametrizadas

## Formato da resposta

Liste os achados do mais grave para o menos grave:

```
[BLOQUEANTE | IMPORTANTE | SUGESTÃO] arquivo:linha — resumo em uma frase
Cenário: entrada/estado concreto → resultado errado
Correção: o que mudar
```

Termine com um veredito curto (aprovar / aprovar com ajustes / pedir mudanças). Se não encontrou problemas, diga isso — não invente achados.
