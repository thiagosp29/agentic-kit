---
name: solid
description: Os cinco princípios SOLID com exemplos de violação e correção em TypeScript.
---

# SOLID

## S — Single Responsibility

Um módulo deve ter **um único motivo para mudar** (um único ator que pede mudanças).

```ts
// ❌ Regra de negócio, formatação e persistência juntas
class ReportService {
  generate(sales: Sale[]) {
    /* calcula */
  }
  toPdf(report: Report) {
    /* formata */
  }
  saveToS3(file: Buffer) {
    /* persiste */
  }
}

// ✅ Cada motivo de mudança em seu lugar
class SalesReport {
  static from(sales: Sale[]): SalesReport {
    /* calcula */
  }
}
class PdfRenderer {
  render(report: SalesReport): Buffer {
    /* formata */
  }
}
interface ReportStorage {
  save(file: Buffer): Promise<void>;
}
```

## O — Open/Closed

Aberto para extensão, fechado para modificação. Novos comportamentos entram como novas implementações, não como mais um `if`.

```ts
// ❌ Cada novo meio de pagamento altera esta função
function fee(method: string, amount: number) {
  if (method === 'pix') return 0;
  if (method === 'card') return amount * 0.03;
  throw new Error('unknown');
}

// ✅ Novo meio de pagamento = nova classe
interface PaymentMethod {
  fee(amount: number): number;
}
class Pix implements PaymentMethod {
  fee() {
    return 0;
  }
}
class Card implements PaymentMethod {
  fee(amount: number) {
    return amount * 0.03;
  }
}
```

## L — Liskov Substitution

Um subtipo deve poder substituir o tipo base sem quebrar quem o usa. Sinais de violação: subclasse que lança `NotImplemented`, ignora parâmetros ou enfraquece garantias.

## I — Interface Segregation

Clientes não devem depender de métodos que não usam. Prefira interfaces pequenas e específicas (`OrderReader`, `OrderWriter`) a uma interface "faz-tudo".

## D — Dependency Inversion

Regras de alto nível dependem de **abstrações** que elas mesmas definem; detalhes implementam essas abstrações.

```ts
// ❌ Caso de uso preso ao banco
class RegisterUser {
  private readonly db = new PostgresClient();
}

// ✅ Caso de uso define a porta; a infraestrutura a implementa
interface UserRepository {
  save(user: User): Promise<void>;
}
class RegisterUser {
  constructor(private readonly users: UserRepository) {}
}
```

Isso também torna o caso de uso testável com um repositório em memória.
