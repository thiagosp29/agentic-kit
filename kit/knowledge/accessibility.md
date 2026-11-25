---
name: accessibility
description: Acessibilidade web (WCAG 2.2 AA) — consulte ao criar ou revisar páginas, formulários, modais e componentes interativos.
---

# Acessibilidade

Use o elemento HTML certo antes de recorrer a ARIA: ele já traz foco, teclado e semântica.

```html
<!-- ❌ Não recebe foco, não responde a Enter, não é anunciado como botão -->
<div class="btn" onclick="salvar()">Salvar</div>

<!-- ✅ -->
<button type="button">Salvar</button>
```

## Números que valem conferir (nível AA)

| Item                                                         | Mínimo                                                    |
| ------------------------------------------------------------ | --------------------------------------------------------- |
| Contraste de texto                                           | 4,5:1                                                     |
| Contraste de texto grande (≥ 24 px ou ≥ 18,66 px em negrito) | 3:1                                                       |
| Contraste de componentes e foco                              | 3:1                                                       |
| Alvo de toque                                                | 24×24 px CSS, com exceções (44×44 é o AAA e uma boa meta) |
| Reflow                                                       | sem rolagem horizontal em 320 px de largura               |
| Zoom de texto                                                | 200% sem perder conteúdo                                  |

## Teclado e foco

- Tudo o que o mouse faz, o teclado faz, na ordem visual. Sem `tabindex` positivo.
- Foco sempre visível e não coberto por cabeçalho fixo.
- Modal: o foco entra, fica preso, `Esc` fecha e o foco volta para quem abriu. `<dialog>` com `showModal()` resolve boa parte.
- Link "pular para o conteúdo" em páginas com navegação longa.

## Formulários

- Todo campo tem `<label>`; `placeholder` não é rótulo.
- Erro em texto, ligado ao campo (`aria-describedby`, `aria-invalid`), dizendo como corrigir. Cor sozinha não informa.
- Depois do envio com erro, o foco vai para o resumo ou para o primeiro campo inválido.
- Use `autocomplete` e `type` corretos; não bloqueie colar em senha.

## Conteúdo

- `lang` na página, um título único por página, cabeçalhos em ordem.
- `alt` descreve a função da imagem; decorativa usa `alt=""`.
- Link faz sentido fora de contexto ("Ver fatura de maio", não "clique aqui").
- Mudança dinâmica importante é anunciada (`role="status"` ou `role="alert"`).
- Respeite `prefers-reduced-motion`; vídeo com som tem legenda.

## ARIA

ARIA errada é pior que nenhuma. Componente customizado (abas, combobox, menu) segue o padrão do ARIA Authoring Practices, com todo o teclado que ele descreve.

## Como verificar

1. Navegue só com o teclado.
2. Rode uma ferramenta automática (axe, Lighthouse): ela pega só parte dos problemas, e zero erro não prova conformidade.
3. Teste o fluxo principal com leitor de tela (NVDA, VoiceOver).
4. Confira em 320 px e com zoom de 200%.
