---
name: security
description: Controle de acesso, entrada, segredos, sessão e dependências — consulte ao mexer em login, permissões, uploads, webhooks, dados sensíveis ou chamadas a modelos de IA.
---

# Segurança de aplicações

Todo dado que cruza uma fronteira (usuário, rede, fila, arquivo, modelo de IA) é não confiável até ser validado.

## Autorização em cada operação

A falha mais comum é verificar quem é o usuário e esquecer de verificar se o recurso é dele.

```ts
// ❌ Qualquer usuário logado lê qualquer pedido trocando o id
const order = await orders.findById(params.id);

// ✅ O dono faz parte da consulta
const order = await orders.findByIdForOwner(params.id, session.userId);
if (!order) throw new OrderNotFoundError(params.id);
```

- Negue por padrão; a permissão é verificada no servidor, nunca só na interface.
- Não aceite do cliente campos que ele não pode definir (`role`, `ownerId`, `price`): copie campo a campo.

## Entrada e saída

| Risco            | Defesa                                                                                                                                       |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| SQL injection    | Consulta parametrizada; nome de coluna vindo do usuário passa por lista fechada                                                              |
| XSS              | Escape do template ligado; HTML do usuário só depois de sanitizado; CSP                                                                      |
| Injeção de shell | Executar com lista de argumentos, sem montar string de comando                                                                               |
| Path traversal   | Resolver o caminho e conferir que continua dentro da pasta permitida                                                                         |
| SSRF             | Lista de destinos permitidos; bloquear IP interno também depois de redirect e resolução de DNS                                               |
| Upload malicioso | Limite de tamanho, tipo conferido pelo conteúdo, nome gerado, servido de origem separada                                                     |
| Redirect aberto  | Só caminhos internos ou lista fechada                                                                                                        |
| CSRF             | Token (ou proteção do framework) em toda mudança de estado com cookie; `SameSite=Lax` ou `Strict` como camada extra; `GET` não altera estado |

## Autenticação e sessão

- Senha com Argon2id, scrypt ou bcrypt; nunca hash rápido (MD5, SHA) nem criptografia reversível.
- Cookie de sessão `HttpOnly`, `Secure`, `SameSite`; novo identificador de sessão após o login; logout invalida no servidor.
- Login, recuperação de senha e códigos têm limite de tentativas e resposta igual para conta existente ou não.
- Token de recuperação: aleatório, de uso único, com validade, guardado como hash.

## Segredos

- Ficam no ambiente ou num cofre; `.env` fora do git, com `.env.example` sem valores.
- Segredo que entrou no histórico do git vazou: revogue e troque. Apagar o commit não basta.
- Compare tokens e assinaturas em tempo constante.

## Webhooks e integrações

Verifique a assinatura sobre o corpo bruto, rejeite timestamp antigo e trate o evento como repetível (idempotência por id do evento).

## Recursos com IA

- A saída do modelo é entrada não confiável: não vai direto para SQL, shell, `eval` ou HTML.
- Instrução no prompt não é controle de acesso. A permissão é checada no código da ferramenta, com a identidade do usuário.
- Conteúdo lido pelo modelo (página, e-mail, documento) pode conter instruções: ações irreversíveis pedem confirmação.
- Limite tokens, chamadas e recursão por usuário.

## Falhe fechado

Erro ao checar permissão, assinatura ou limite nega a operação. Resposta de erro não traz stack trace, SQL nem caminho interno (veja `knowledge/error-handling.md`).

## Referência

OWASP Top 10:2025: controle de acesso (A01), configuração insegura (A02), cadeia de suprimentos (A03), falhas criptográficas (A04), injeção (A05), design inseguro (A06), autenticação (A07), integridade de software e dados (A08), log e alerta (A09), condições excepcionais mal tratadas (A10). Confira a edição vigente em owasp.org.
