import { join, relative, resolve } from 'node:path';
import { UsageError } from '../../core/errors.js';
import { applyPlan, planInstall, type FileOperation, type OperationAction } from '../../core/installer.js';
import { resolveTargets, TARGET_IDS, type InstallScope, type Target } from '../../core/targets.js';
import { ExitCode, type CliContext, type Command } from '../context.js';
import { KIT_OPTION, kitDirectoryFrom, loadValidKit, parseOptions } from '../options.js';

const INSTALL_OPTIONS = {
  ...KIT_OPTION,
  target: { type: 'string', short: 't', multiple: true },
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
  const targets = resolveTargets(options.target);
  const scope: InstallScope = options.global === true ? 'global' : 'project';

  const withoutGlobal = targets.find((target) => !target.supportsGlobal);
  if (scope === 'global' && withoutGlobal !== undefined) {
    throw new UsageError(`O destino "${withoutGlobal.id}" não suporta --global.`);
  }
  if (scope === 'global' && options.dir !== undefined) {
    throw new UsageError('Use --global ou --dir, não os dois.');
  }

  const kit = await loadValidKit(kitDirectoryFrom(options.kit, context), context);
  if (kit === undefined) return ExitCode.Failure;

  const baseDirectory = scope === 'global' ? context.homeDirectory : resolve(context.cwd, options.dir ?? '.');
  const dryRun = options['dry-run'] === true;

  for (const target of targets) {
    const plan = await planInstall(
      { kit, layout: target.layoutFor(scope), baseDirectory, force: options.force === true },
      context.fs,
    );

    report(target, plan, baseDirectory, dryRun, context);
    await warnAboutLegacyDirectories(target, baseDirectory, context);
    if (!dryRun) {
      await applyPlan(plan, context.fs);
    }
  }

  if (!dryRun) {
    context.output.info('\n✓ Instalação concluída.');
  }
  return ExitCode.Success;
};

async function warnAboutLegacyDirectories(
  target: Target,
  baseDirectory: string,
  context: CliContext,
): Promise<void> {
  const { contentDirectory } = target.layoutFor('project');
  for (const legacy of target.legacyContentDirectories) {
    if (await context.fs.exists(join(baseDirectory, legacy))) {
      context.output.info(
        `\n! Encontrei ${legacy}/, usada por versões antigas do kit. O conteúdo agora fica em ${contentDirectory}/. ` +
          `Confira se ${legacy}/ tem algo seu e apague a pasta.`,
      );
    }
  }
}

function report(
  target: Target,
  plan: readonly FileOperation[],
  baseDirectory: string,
  dryRun: boolean,
  context: CliContext,
): void {
  const { output } = context;
  output.info(
    `${dryRun ? 'Simulação (nada será escrito)' : 'Instalando'} para ${target.id} em ${baseDirectory}\n`,
  );

  for (const operation of plan) {
    output.info(`  ${ACTION_LABELS[operation.action]}  ${relative(baseDirectory, operation.destination)}`);
  }

  const conflicts = plan.filter((operation) => operation.action === 'conflict').length;
  if (conflicts > 0) {
    output.info(
      `\n${conflicts} arquivo(s) foram alterados localmente e mantidos. Use --force para sobrescrever.`,
    );
  }
}
