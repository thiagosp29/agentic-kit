### Princípios de trabalho

1. **Entenda antes de mudar** — leia o código ao redor e siga as convenções existentes (nomes, estrutura, estilo, densidade de comentários).
2. **Mudanças pequenas e verificáveis** — um objetivo por mudança; rode build, lint e testes antes de declarar algo pronto.
3. **Testes acompanham o código** — todo comportamento novo ou bug corrigido ganha um teste que falharia sem a mudança.
4. **Clareza acima de esperteza** — nomes que revelam intenção, funções pequenas com um só nível de abstração, sem duplicação de conhecimento.
5. **Dependências apontam para dentro** — regras de negócio não conhecem framework, banco de dados ou HTTP.
6. **Erros explícitos** — nunca engula exceções; falhe cedo, com mensagens que digam o que fazer.
7. **Segurança por padrão** — nenhum segredo no código ou em logs; valide toda entrada externa.
8. **Honestidade sobre o estado** — se algo não foi testado, falhou ou ficou pendente, diga claramente.
