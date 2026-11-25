---
name: pull-request
description: Prepara e abre um pull request pequeno, revisado e com evidência de teste. Use quando pedirem para abrir PR ou deixar a branch pronta para revisão.
---

# Pull request

## 1. Preparar

1. `git status` e `git diff <base>...HEAD`: leia o diff inteiro como se fosse de outra pessoa. Use a skill `code-review`, se não rodou desde a última mudança.
2. Mudança alheia, arquivo gerado, segredo ou alteração local do usuário fica de fora. Adicione arquivos pelo nome, não com `git add -A` às cegas.
3. Mais de um assunto, ou grande demais para revisar de uma vez (referência em `knowledge/git-workflow.md`)? Proponha dividir.
4. Branch defasada: atualize conforme a prática do projeto; resolva conflito entendendo os dois lados.
5. Rode a skill `verify-done`, se não rodou desde a última mudança.

## 2. Descrever

Use o template do repositório, se houver. Senão:

```markdown
## O que muda

## Por que

Problema e link da issue ou spec.

## Como foi testado

Comandos e resultados; capturas se houver interface.

## Riscos e como reverter

Migração, configuração, ordem de deploy, compatibilidade.

## Não verificado
```

Título em Conventional Commits. Diga o que o revisor deve olhar com mais atenção. Nada que não tenha sido feito.

## 3. Abrir

- Só faça push e abra o PR se o usuário pediu. Nunca push direto na branch principal; nunca `--force` em branch compartilhada.
- Passe o corpo por arquivo ou entrada padrão, para o shell não interpretar o texto.
- Confira base, arquivos e descrição depois de abrir.

## 4. Acompanhar

CI falhou: leia o log, reproduza e corrija a causa; não repita até passar. Comentários: skill `review-feedback`. Não faça merge sem pedido explícito.

## Pronto quando

O PR está aberto na base certa, só com a mudança pretendida, e o estado do CI foi informado como está.
