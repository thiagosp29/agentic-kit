---
name: database
description: Modelagem, índices, transações e migrações sem parada — consulte ao criar tabela, escrever consulta crítica ou mudar o esquema.
---

# Banco de dados

## Modelagem

- A regra que não pode ser violada fica no banco: `NOT NULL`, `UNIQUE`, `CHECK`, chave estrangeira. Verificar no código e depois inserir tem corrida.
- Tipos exatos: dinheiro em inteiro ou `DECIMAL`, instante com fuso, booleano em vez de `'S'/'N'`.
- `NULL` significa uma coisa só; se significa três, são três estados com nome.
- Desnormalize com medição e com dono definido para a cópia.

## Índices

- Siga as consultas reais: colunas de igualdade primeiro, depois intervalo ou ordenação.
- Índice em `(a, b)` serve a filtro por `a`, em geral não a filtro só por `b`.
- Função na coluna (`lower(email)`) ignora o índice comum: use índice de expressão.
- Cada índice custa na escrita; confira o plano de execução com volume realista.

## Transações e concorrência

```sql
-- ❌ Ler, calcular no código e gravar: duas compras simultâneas vendem o mesmo item
SELECT stock FROM products WHERE id = 1;
UPDATE products SET stock = 4 WHERE id = 1;

-- ✅ Condição na própria escrita; zero linhas afetadas = sem estoque
UPDATE products SET stock = stock - 1 WHERE id = 1 AND stock > 0;
```

- Transação curta e sem chamada externa dentro.
- Trave recursos sempre na mesma ordem; deadlock e falha de serialização pedem nova tentativa da transação inteira.
- Banco e fila não compartilham transação: grave o evento na mesma transação (outbox) e publique depois.

## Migração sem parada: expandir e contrair

Durante o deploy, a versão antiga e a nova do código rodam juntas. Renomear coluna vira:

1. **Expandir:** criar a coluna nova, anulável.
2. Código grava nas duas e lê a antiga. Só avance com ele em **todas** as instâncias.
3. **Preencher** os registros antigos em lotes, retomável.
4. Código lê a nova; conferir que os dados batem.
5. Tornar a antiga anulável (ou dar valor padrão) e aplicar na nova as restrições da antiga; então o código para de gravar na antiga.
6. **Contrair:** remover a antiga, num deploy posterior.

- Migração já aplicada não se edita: crie outra.
- Antes de rodar, saiba quais locks ela pega e por quanto tempo na tabela grande.
- `NOT NULL`, `UNIQUE` e chave estrangeira em tabela com dados: limpe e valide antes.
- Migração destrutiva exige backup restaurável **testado** e confirmação do usuário.
- Escreva como voltar atrás. Se não há volta, diga isso no PR.

## Verificação

- [ ] Migração testada a partir do esquema atual e a partir do zero
- [ ] Código antigo funciona com o esquema novo
- [ ] Teste de integração no mesmo SGBD e versão da produção, em instância isolada; nunca no banco de produção
- [ ] Consultas parametrizadas e listas com limite
