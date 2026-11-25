---
name: verify-done
description: Confere, com evidência executada, se uma tarefa está mesmo pronta. Use antes de dizer que terminou, corrigiu ou passou, e antes de commit final, PR ou publicação.
---

# Verificar antes de declarar pronto

Afirmação sobre o estado do código precisa de evidência produzida **depois** da última mudança.

## 1. Critérios desta tarefa

Liste o que foi pedido, item por item, inclusive o que foi dito no meio da conversa. Para cada um, o que provaria que está atendido?

| Afirmação           | Prova                                              | Não basta                   |
| ------------------- | -------------------------------------------------- | --------------------------- |
| Testes passam       | saída da suíte completa, com 0 falhas              | rodada anterior, um arquivo |
| Bug corrigido       | sintoma original reproduzido antes e ausente agora | o código mudou              |
| Teste cobre a regra | falha quando a regra é quebrada                    | passa                       |
| Compila             | build com código de saída 0                        | editor sem erro             |
| Tela funciona       | vista e usada, em computador e celular             | HTML parece certo           |
| Migração funciona   | aplicada sobre cópia do esquema atual              | SQL revisado                |
| Subagente terminou  | diff e comandos conferidos por você                | ele disse que terminou      |

Execute e leia a saída inteira, incluindo avisos, testes pulados e código de saída.

## 2. Barra fixa de qualquer mudança

- [ ] Testes, tipos, lint, formato e build do projeto
- [ ] Caminho de erro e casos de borda exercitados
- [ ] Diff relido: só o necessário, sem log temporário, código morto, segredo ou arquivo gerado
- [ ] Contratos e dados existentes continuam compatíveis
- [ ] README, exemplos e textos da interface dizem a verdade de agora
- [ ] Migração, configuração e ordem de deploy anotadas, se houver

## 3. Se algo falhar

Corrija e **rode tudo de novo** a partir do item afetado. Falha que já existia antes: prove na base (worktree separado ou CI da base) e relate, sem esconder. Não enfraqueça o teste nem desligue a verificação.

## 4. Relatar

- O que foi pedido e o resultado de cada item, com o comando que prova.
- O que **não** foi verificado e por quê.
- Falhas e pendências, sem suavizar.

Sem conseguir executar a prova, diga "implementado, não verificado", nunca "pronto".
