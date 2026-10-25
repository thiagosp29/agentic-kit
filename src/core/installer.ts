import { join } from 'node:path';
import type { FileSystem } from './file-system.js';
import { renderInstructionsBlock, upsertBlock } from './instructions.js';
import type { Kit } from './kit.js';
import type { TargetLayout } from './targets.js';

/**
 * - `create`: arquivo novo
 * - `overwrite`: arquivo existente e diferente, substituído por causa de `--force`
 * - `update`: bloco gerenciado do arquivo de instruções atualizado
 * - `unchanged`: conteúdo já é idêntico
 * - `conflict`: arquivo existente e diferente, mantido (sem `--force`)
 */
export type OperationAction = 'create' | 'overwrite' | 'update' | 'unchanged' | 'conflict';

export interface FileOperation {
  readonly action: OperationAction;
  readonly destination: string;
  readonly content: string;
}

export interface InstallRequest {
  readonly kit: Kit;
  readonly layout: TargetLayout;
  readonly baseDirectory: string;
  readonly force: boolean;
}

const WRITING_ACTIONS: ReadonlySet<OperationAction> = new Set(['create', 'overwrite', 'update']);

/** Calcula o que a instalação faria, sem escrever nada. */
export async function planInstall(request: InstallRequest, fs: FileSystem): Promise<FileOperation[]> {
  const { kit, layout, baseDirectory, force } = request;
  const operations: FileOperation[] = [];

  for (const file of kit.items.flatMap((item) => item.files)) {
    const destination = join(baseDirectory, layout.contentDirectory, file);
    const content = await fs.readFile(join(kit.root, file));
    const current = await readIfExists(destination, fs);
    operations.push({ action: actionForKitFile(current, content, force), destination, content });
  }

  const instructionsPath = join(baseDirectory, layout.instructionsFile);
  const currentInstructions = await readIfExists(instructionsPath, fs);
  const instructions = upsertBlock(currentInstructions, renderInstructionsBlock(kit, layout));
  operations.push({
    action: actionForInstructions(currentInstructions, instructions),
    destination: instructionsPath,
    content: instructions,
  });

  return operations;
}

export async function applyPlan(operations: readonly FileOperation[], fs: FileSystem): Promise<void> {
  for (const operation of operations) {
    if (WRITING_ACTIONS.has(operation.action)) {
      await fs.writeFile(operation.destination, operation.content);
    }
  }
}

function actionForKitFile(current: string | undefined, content: string, force: boolean): OperationAction {
  if (current === undefined) return 'create';
  if (current === content) return 'unchanged';
  return force ? 'overwrite' : 'conflict';
}

function actionForInstructions(current: string | undefined, content: string): OperationAction {
  if (current === undefined) return 'create';
  return current === content ? 'unchanged' : 'update';
}

async function readIfExists(path: string, fs: FileSystem): Promise<string | undefined> {
  return (await fs.exists(path)) ? fs.readFile(path) : undefined;
}
