import { KIT_ITEM_KINDS, type KitItemKind } from '../../core/kit.js';
import { listTargets } from '../../core/targets.js';
import { ExitCode, type Command } from '../context.js';
import { KIT_OPTION, kitDirectoryFrom, loadValidKit, parseOptions } from '../options.js';

const KIND_TITLES: Readonly<Record<KitItemKind, string>> = {
  knowledge: 'Knowledge',
  skill: 'Skills',
  agent: 'Agents',
};

export const listCommand: Command = async (args, context) => {
  const options = parseOptions(args, KIT_OPTION);
  const kit = await loadValidKit(kitDirectoryFrom(options.kit, context), context);
  if (kit === undefined) return ExitCode.Failure;

  const { output } = context;
  for (const kind of KIT_ITEM_KINDS) {
    const items = kit.items.filter((item) => item.kind === kind);
    if (items.length === 0) continue;
    output.info(`\n${KIND_TITLES[kind]}`);
    for (const item of items) {
      output.info(`  ${item.name.padEnd(20)} ${item.description}`);
    }
  }

  output.info('\nDestinos (--target)');
  for (const target of listTargets()) {
    output.info(`  ${target.id.padEnd(20)} ${target.label}`);
  }

  return ExitCode.Success;
};
