---
name: project-setup
description: Adapta o kit a um projeto, registrando stack, comandos verificados, convenções e limites no CLAUDE.md ou AGENTS.md. Use logo após instalar o kit, ao assumir um repositório ou quando as instruções estiverem desatualizadas.
---

# Configurar o projeto

O kit é genérico. O que faz a IA acertar neste repositório é o que só ele tem: comandos, convenções e armadilhas.

## 1. Explorar

1. Leia `README`, manifestos (`package.json`, `pyproject.toml`, `go.mod`...), CI, lint e as instruções que já existem.
2. Identifique: linguagem e versão, framework, banco, testes, build, deploy, monorepo.
3. Leia dois ou três módulos representativos e o `git log` recente para extrair convenções **observadas**.
4. Não abra `.env` nem arquivos de segredo; use `.env.example`.

## 2. Verificar os comandos

Rode os que são seguros (testes, lint, tipos, build). Anote o que funcionou, o que falhou e o tempo. Não execute deploy, migração, publicação nem script que fale com serviço externo. Comando não rodado entra marcado como "não verificado".

## 3. Perguntar o que o código não conta

No máximo três perguntas, só se a resposta mudar o resultado: o que nunca deve ser alterado? Quem aprova e publica? Há decisão antiga que parece erro?

## 4. Escrever

Fora dos marcadores `agentic-kit:start` e `agentic-kit:end`, preservando o que já existe:

```markdown
## Projeto

O que é e para quem, em até duas frases.

### Comandos

- Testes: `...` (um arquivo: `...`)
- Verificação completa: `...`
- Rodar local: `...`

### Mapa

- `src/...` — responsabilidade

### Convenções

- Regra específica e verificável, com exemplo em `caminho/arquivo`

### Cuidados

- O que quebra, onde e por quê

### Limites

- Pedir antes: migração, dependência nova, mudança de contrato
- Nunca: ...
```

Só entra o que é específico, estável e não óbvio pelo código. O arquivo todo deve ficar abaixo de 200 linhas: procedimento longo vira skill; regra que o linter cobra fica no linter.

Se o projeto usa mais de uma ferramenta de IA, não duplique o conteúdo:

- `AGENTS.md` sem o bloco do kit: escreva nele e importe no `CLAUDE.md` com `@AGENTS.md`.
- Os dois com o bloco do kit: importar um no outro carregaria o bloco duas vezes. Escreva em `docs/projeto.md`, importe no `CLAUDE.md` com `@docs/projeto.md` e, no `AGENTS.md`, mande ler esse arquivo antes de começar.

## Pronto quando

- Cada comando foi rodado ou está marcado como não verificado.
- Cada caminho citado existe.
- O bloco do kit não foi editado e nada do usuário se perdeu (`git diff`).
- O usuário recebeu o resumo do que foi inferido, para corrigir.
