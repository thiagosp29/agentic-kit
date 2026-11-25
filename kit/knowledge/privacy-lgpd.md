---
name: privacy-lgpd
description: Privacidade e LGPD para quem desenvolve — consulte ao coletar, guardar, compartilhar, registrar em log ou apagar dados pessoais.
---

# Privacidade e LGPD

Orientação de engenharia sobre a Lei 13.709/2018, não parecer jurídico. Base legal, prazo de retenção e comunicação de incidente são decididos por quem responde pelo tratamento (encarregado, jurídico): sem essa definição, pergunte em vez de presumir.

## O que é dado pessoal

- **Pessoal:** identifica ou pode identificar alguém (nome, CPF, e-mail, IP, identificador de dispositivo, localização).
- **Sensível (art. 5º, II):** saúde, biometria, genética, origem racial ou étnica, religião, opinião política, filiação sindical, vida sexual. Exige hipótese própria (art. 11).
- **Criança e adolescente (art. 14):** tratamento no melhor interesse deles; peça orientação antes de coletar.
- **Pseudonimizado ainda é pessoal.** Hash de CPF é reversível por tentativa: o espaço de valores é pequeno.

## No projeto do sistema

| Princípio (art. 6º)    | No código                                                                    |
| ---------------------- | ---------------------------------------------------------------------------- |
| Finalidade e adequação | Cada campo coletado tem um uso nomeado; sem uso, sem campo                   |
| Necessidade            | Idade em vez de data de nascimento, cidade em vez de endereço, quando bastar |
| Segurança e prevenção  | Acesso por papel, criptografia em trânsito, cópias de teste sem dados reais  |
| Transparência          | O texto de privacidade bate com o que o código faz, inclusive terceiros      |
| Prestação de contas    | Registro de quem acessou ou alterou dados sensíveis                          |

A base legal (art. 7º) não é sempre consentimento. Quando for, precisa ser livre, informado e inequívoco, para finalidade determinada (art. 5º, XII), com revogação gratuita e facilitada (art. 8º, § 5º). Guarde quando, para quê e qual versão do texto, e deixe caixas desmarcadas por padrão.

## Direitos do titular (art. 18)

Desenhe desde o início: confirmar e acessar, corrigir, levar (portabilidade), eliminar e revogar consentimento.

- Exportar e eliminar precisam achar o dado em **todos** os lugares: banco, arquivos, busca, cache, filas, analytics, fornecedores.
- Eliminação tem exceções (art. 16), como obrigação legal: separe o que fica e o motivo.
- Backups: defina por quanto tempo o dado ainda vive neles e como não ressuscitá-lo numa restauração.
- Confirme a identidade de quem pede, sem coletar mais do que o necessário.

## Retenção

Cada tipo de dado tem prazo e uma rotina que apaga ou anonimiza, com teste. "Guardar para sempre" é decisão que precisa de motivo.

## Logs, testes e terceiros

```ts
// ❌ CPF e e-mail no log, para sempre e para todos
logger.info('cadastro', { body: req.body });

// ✅ Identificador interno basta para investigar
logger.info('cadastro', { userId: user.id });
```

- Nada de dado pessoal em URL, mensagem de erro, nome de arquivo ou evento de analytics.
- Dado de produção não vai para teste nem para prompt de IA sem autorização e minimização.
- Fornecedor novo que recebe dado pessoal (e-mail, IA, analytics) entra na lista de operadores; fora do Brasil, verifique a transferência internacional (art. 33).

## Incidente

Incidente que possa causar risco ou dano relevante é comunicado à ANPD e aos titulares (art. 48). A Resolução CD/ANPD 15/2024 fixa, em regra, **três dias úteis** a partir do conhecimento de que dados pessoais foram afetados. Na suspeita: preserve evidências, contenha e avise o responsável na hora; não decida sozinho que "não precisa". Confira a norma vigente.
