import { ExitCode, type Command } from '../context.js';
import { KIT_OPTION, kitDirectoryFrom, loadValidKit, parseOptions } from '../options.js';

export const validateCommand: Command = async (args, context) => {
  const options = parseOptions(args, KIT_OPTION);
  const directory = kitDirectoryFrom(options.kit, context);
  const kit = await loadValidKit(directory, context);

  if (kit === undefined) {
    context.output.error('\nKit inválido. Corrija os problemas acima.');
    return ExitCode.Failure;
  }

  context.output.info(`✓ Kit válido: ${kit.items.length} itens em ${directory}`);
  return ExitCode.Success;
};
