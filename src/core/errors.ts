/** Erro causado por uso incorreto da CLI; a mensagem é exibida ao usuário sem stack trace. */
export class UsageError extends Error {
  override readonly name = 'UsageError';
}
