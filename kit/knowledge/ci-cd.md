---
name: ci-cd
description: Pipeline, segurança da cadeia de suprimentos, deploy e rollback — consulte ao criar ou mudar CI, publicação de pacote ou processo de deploy.
---

# CI/CD

## Pipeline

1. Rápido primeiro: formato, lint, tipos, testes unitários. Depois integração, build e e2e.
2. Os mesmos comandos rodam na máquina e no CI (`npm run check` ou equivalente).
3. Instalação pelo lockfile (`npm ci`, `uv sync --locked`, `bundle install` em modo congelado).
4. Um artefato só: o que foi testado é o que vai para produção.
5. Teste instável é bug. Repetir até passar esconde falha real; se for preciso isolar, tem dono e prazo.

## Segurança do pipeline

- Token com permissão mínima (`permissions: contents: read` por padrão no GitHub Actions).
- Action de terceiros fixada por SHA; atualização automática revisada.
- Código de fork não roda com segredos: cuidado com `pull_request_target`.
- Título de PR, nome de branch e mensagem de commit são entrada não confiável: passe por variável de ambiente, não interpole em script.
- Prefira credencial de curta duração (OIDC, publicação confiável) a token permanente.
- Auditoria de dependências e varredura de segredos no pipeline.

```yaml
# ❌ Título malicioso executa comando
- run: echo "${{ github.event.pull_request.title }}"

# ✅
- run: echo "$TITLE"
  env:
    TITLE: ${{ github.event.pull_request.title }}
```

## Deploy

- Configuração vem do ambiente e é validada na subida.
- Migração compatível com a versão anterior roda antes do código (veja `knowledge/database.md`).
- Publicar código e liberar recurso são decisões separadas: flag com dono e data de remoção.
- Mudança arriscada sai gradual, com critério objetivo para parar.
- Um deploy por vez por ambiente (controle de concorrência).

## Rollback

Escreva antes: comando, quem executa, quanto demora e o que ele **não** desfaz (dados migrados, e-mails enviados). Rollback nunca testado é esperança.

## Depois do deploy

- [ ] A versão no ar é a esperada
- [ ] O fluxo crítico foi exercitado
- [ ] Erros e latência comparados com antes
