---
name: release
description: Prepara uma versão com número semântico, notas, verificação do artefato e plano de volta. Use quando pedirem para preparar, lançar ou publicar uma versão.
---

# Preparar uma versão

## 1. Conferir a base

1. Descubra como o projeto já publica (scripts, CI, tags, releases anteriores) e siga isso.
2. Base atualizada, CI verde, versão publicada conferida no registro (não só no manifesto).
3. Liste o que mudou desde a última versão **publicada**.

## 2. Escolher o número

| Mudança                                                     | Versão |
| ----------------------------------------------------------- | ------ |
| Quebra quem usa (contrato, comportamento, requisito mínimo) | major  |
| Recurso novo compatível                                     | minor  |
| Correção compatível                                         | patch  |

Em `0.x`, siga a prática do projeto; o comum é quebra em minor. Na dúvida se quebra, trate como quebra e explique.

## 3. Escrever as notas

Para quem usa, não para quem programou: novidades, correções, **o que precisa fazer para atualizar**, problemas conhecidos. Só o que está nesta versão.

## 4. Verificar o artefato

- [ ] Manifesto e lockfile com a versão nova
- [ ] Testes, build e validações do projeto
- [ ] Conteúdo do pacote listado: nada faltando, nada sobrando (segredo, teste, arquivo local)
- [ ] Artefato instalado numa pasta limpa e usado
- [ ] Atualização a partir da versão **anterior publicada**, com dados existentes
- [ ] Volta atrás escrita e o que ela não desfaz

## 5. Publicar

Publicação, tag e deploy só com pedido explícito. Autenticação e segundo fator são do usuário: não leia nem copie tokens. Publique a partir do commit verificado.

## 6. Conferir

Instale do registro ou abra o ambiente real e confirme a versão e o fluxo principal. Só então marque como publicada. Versão com defeito já publicada: corrija com outra; não reescreva tag nem reaproveite número.

## Pronto quando

A versão está preparada ou publicada, dita qual das duas, com evidência do artefato e próximos passos de quem precisa agir.
