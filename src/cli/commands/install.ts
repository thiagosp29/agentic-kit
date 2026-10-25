import { relative, resolve } from 'node:path';
import { UsageError } from '../../core/errors.js';
import { applyPlan, planInstall, type FileOperation, type OperationAction } from '../../core/installer.js';
import { resolveTarget, TARGET_IDS, type InstallScope } from '../../core/targets.js';
import { ExitCode, type CliContext, type Command } from '../context.js';
import { KIT_OPTION, kitDirectoryFrom, loadValidKit, parseOptions } from '../options.js';

const INSTALL_OPTIONS = {
  ...KIT_OPTION,
  target: { type: 'string', short: 't' },
  dir: { type: 'string', short: 'd' },
  global: { type: 'boolean', short: 'g' },
  force: { type: 'boolean', short: 'f' },
  'dry-run': { type: 'boolean' },
} as const;

const ACTION_LABELS: Readonly<Record<OperationAction, string>> = {
  create: '+ criar      ',
  overwrite: '! sobrescrever',
  update: '~ atualizar  ',
  unchanged: '= sem mudança',
  conflict: '✗ conflito   ',
};

export const installCommand: Command = async (args, context) => {
  const options = parseOptions(args, INSTALL_OPTIONS);

  if (options.target === undefined) {
    throw new UsageError(`Informe o destino com --target (${TARGET_IDS.join(' | ')}).`);
  }
  const target = resolveTarget(options.target);
  const scope: InstallScope = options.global === true ? 'global' : 'project';

  if (scope === 'global' && !target.supportsGlobal) {
    throw new UsageError(`O destino "${target.id}" não suporta --global.`);
  }
  if (scope === 'global' && options.dir !== undefined) {
    throw new UsageError('Use --global ou --dir, não os dois.');
  }

  const kit = await loadValidKit(kitDirectoryFrom(options.kit, context), context);
  if (kit === undefined) return ExitCode.Failure;

  const baseDirectory = scope === 'global' ? context.homeDirectory : resolve(context.cwd, options.dir ?? '.');
  const dryRun = options['dry-run'] === true;
  const plan = await planInstall(
    { kit, layout: target.layoutFor(scope), baseDirectory, force: options.force === true },
    context.fs,
  );

  report(plan, baseDirectory, dryRun, context);
  if (!dryRun) {
    await applyPlan(plan, context.fs);
  }
  return ExitCode.Success;
};

function report(
  plan: readonly FileOperation[],
  baseDirectory: string,
  dryRun: boolean,
  context: CliContext,
): void {
  const { output } = context;
  output.info(`${dryRun ? 'Simulação (nada será escrito)' : 'Instalando'} em ${baseDirectory}\n`);

  for (const operation of plan) {
    output.info(`  ${ACTION_LABELS[operation.action]}  ${relative(baseDirectory, operation.destination)}`);
  }

  const conflicts = plan.filter((operation) => operation.action === 'conflict').length;
  if (conflicts > 0) {
    output.info(
      `\n${conflicts} arquivo(s) foram alterados localmente e mantidos. Use --force para sobrescrever.`,
    );
  }
  if (!dryRun) {
    output.info('\n✓ Instalação concluída.');
  }
}
