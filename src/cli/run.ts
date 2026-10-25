import { UsageError } from '../core/errors.js';
import { installCommand } from './commands/install.js';
import { listCommand } from './commands/list.js';
import { validateCommand } from './commands/validate.js';
import { ExitCode, type CliContext, type Command } from './context.js';

const COMMANDS: Readonly<Record<string, Command>> = {
  install: installCommand,
  list: listCommand,
  validate: validateCommand,
};

const HELP = `agentic-kit — knowledge, skills e agents para desenvolvimento com IA

Uso:
  agentic-kit <comando> [opções]

Comandos:
  install    Instala o kit em um projeto ou no diretório do usuário
  list       Lista os itens do kit e os destinos disponíveis
  validate   Valida a estrutura e os manifestos do kit

Opções de install:
  -t, --target <id>   claude | agents (obrigatório)
  -d, --dir <path>    Diretório do projeto (padrão: diretório atual)
  -g, --global        Instala para o usuário (~/.claude); apenas --target claude
  -f, --force         Sobrescreve arquivos do kit alterados localmente
      --dry-run       Mostra o que seria feito, sem escrever nada

Opções comuns:
  -k, --kit <path>    Usa outro diretório de kit (ex.: o kit do seu time)
  -h, --help          Mostra esta ajuda
  -v, --version       Mostra a versão

Exemplos:
  agentic-kit install --target claude
  agentic-kit install --target claude --global
  agentic-kit install --target agents --dir ../meu-projeto --dry-run`;

export async function run(argv: string[], context: CliContext): Promise<number> {
  const [commandName, ...args] = argv;

  if (
    commandName === undefined ||
    commandName === '-h' ||
    commandName === '--help' ||
    commandName === 'help'
  ) {
    context.output.info(HELP);
    return ExitCode.Success;
  }
  if (commandName === '-v' || commandName === '--version') {
    context.output.info(context.version);
    return ExitCode.Success;
  }

  const command = COMMANDS[commandName];
  if (command === undefined) {
    context.output.error(`Comando desconhecido: "${commandName}". Veja agentic-kit --help.`);
    return ExitCode.Usage;
  }

  try {
    return await command(args, context);
  } catch (error) {
    if (error instanceof UsageError) {
      context.output.error(`${error.message}\nVeja agentic-kit --help.`);
      return ExitCode.Usage;
    }
    throw error;
  }
}
