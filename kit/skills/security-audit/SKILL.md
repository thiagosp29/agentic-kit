---
name: security-audit
description: Audita a segurança do código do próprio projeto por fronteira de confiança, com cenário de ataque e correção para cada achado. Use ao mudar login, permissões, pagamento, upload, webhook, dados pessoais ou IA, e antes da primeira publicação.
---

# Auditoria de segurança

Trabalho defensivo, no código do projeto. Não teste sistemas no ar nem de terceiros.

## 1. Modelar

1. O que vale a pena proteger? (contas, dinheiro, dados pessoais, segredos, disponibilidade)
2. Quem pode atacar? (anônimo, usuário comum, outro cliente, fornecedor, conteúdo lido pela IA)
3. Por onde entra dado não confiável? Liste rotas, formulários, uploads, webhooks, filas, argumentos, arquivos, respostas de API e de modelo.

Em diff pequeno, modele só o que ele toca.

## 2. Percorrer cada entrada até o efeito

Siga o dado até banco, shell, arquivo, rede, HTML, log ou permissão, e confira (detalhes em `knowledge/security.md`):

- [ ] Autorização do **recurso**, não só da rota; outro usuário ou cliente não alcança
- [ ] Validação na borda; consulta parametrizada; saída escapada
- [ ] Campos que o cliente não pode definir são ignorados
- [ ] Sessão, CSRF, limite de tentativas, recuperação de conta
- [ ] Valor, quantidade e estado calculados no servidor; repetição e corrida não duplicam efeito
- [ ] Upload, caminho, redirect e URL externa restritos
- [ ] Webhook com assinatura, validade e idempotência
- [ ] IA: saída não confiável, ferramenta com permissão própria, ação irreversível confirmada
- [ ] Erro falha fechado e não revela detalhe interno
- [ ] Dado pessoal minimizado e fora do log (`knowledge/privacy-lgpd.md`)

## 3. Percorrer o entorno

- [ ] Segredos no código e no histórico: informe local e tipo, nunca o valor
- [ ] Dependências: vulnerabilidade conhecida **e** alcançável; lockfile presente
- [ ] CI com permissão mínima e entrada de PR não interpolada (`knowledge/ci-cd.md`)
- [ ] Configuração de produção: debug desligado, CORS restrito, cabeçalhos, TLS

## 4. Derrubar a própria suspeita

Para cada achado, procure a defesa que já existe (middleware, ORM, restrição do banco, framework). Sem cenário concreto de entrada até impacto, descarte ou marque como BAIXO.

## 5. Reportar

| Nível   | Critério                                                                                                     |
| ------- | ------------------------------------------------------------------------------------------------------------ |
| CRÍTICO | Sem acesso prévio ou com conta que qualquer um cria, compromete contas, dados em massa, dinheiro ou servidor |
| ALTO    | Usuário comum acessa ou altera o que é de outro                                                              |
| MÉDIO   | Exige condição incomum ou tem impacto limitado                                                               |
| BAIXO   | Defesa em profundidade                                                                                       |

Cada achado: `arquivo:linha`, pré-condição, caminho, impacto, correção e teste. Segredo exposto: recomende revogar já, antes de limpar o código.

## Pronto quando

Toda entrada listada no passo 1 foi percorrida ou consta como não verificada, e cada achado tem cenário. Auditoria de código reduz risco; não prova ausência de falha.
