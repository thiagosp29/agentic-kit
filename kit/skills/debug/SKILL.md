---
name: debug
description: Investiga um bug, teste falhando ou comportamento inesperado até achar a causa raiz antes de corrigir. Use quando algo não funciona e a causa não é óbvia, ou quando uma primeira correção não resolveu.
---

# Depurar

Corrigir sem entender a causa troca um bug por outro. Primeiro a causa, depois a correção.

## 1. Reproduzir

1. Escreva o passo a passo exato que mostra o problema: entrada, comando, ambiente, resultado esperado e resultado obtido.
2. Leia a mensagem de erro e o stack trace inteiros. A linha que importa costuma ser a primeira do seu código, não a última.
3. Reduza ao menor caso que ainda falha. O ideal é um teste automatizado (veja a skill `write-tests`).
4. Se não consegue reproduzir, não corrija: colete mais dados (logs, versões, configuração) até conseguir.

## 2. Localizar

- **O que mudou?** Se funcionava antes, compare com a última versão boa: `git log`, `git diff` e, se o intervalo for grande, `git bisect`.
- **Siga o dado.** Volte pelo fluxo a partir do valor errado até o ponto em que ele deixou de estar certo.
- **Compare com o que funciona.** Ache um caso parecido que dá certo e liste as diferenças.

## 3. Testar hipóteses

1. Escreva a hipótese numa frase: "o valor chega nulo porque o cache devolve a entrada antiga".
2. Diga que observação a confirmaria ou a derrubaria.
3. Faça **uma** mudança ou medição por vez (um log, um breakpoint, um valor fixo) e observe.
4. Hipótese derrubada: desfaça a mudança antes de testar a próxima.

Se três correções seguidas não resolveram, pare de corrigir: o modelo mental está errado. Volte ao passo 1 e questione as premissas (a versão em execução, a configuração, o ambiente).

## 4. Corrigir

1. Com a causa confirmada, tenha um teste que falha por causa dela.
2. Corrija a causa, não o sintoma. Um `try/catch` ou um `if (x != null)` que só esconde o erro não é correção (veja `knowledge/error-handling.md`).
3. Rode o teste novo e a suíte inteira.
4. Procure o mesmo padrão em outros pontos do código.
5. Remova logs e código temporário da investigação.

## Ao terminar

Reporte em poucas linhas: o sintoma, a causa raiz, a correção, o teste que cobre o caso e o que não foi possível verificar.
