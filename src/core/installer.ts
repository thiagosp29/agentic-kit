import { join } from 'node:path';
import type { FileSystem } from './file-system.js';
import {
  hashContent,
  INSTALL_RECORD_FILE,
  isPristine,
  parseInstallRecord,
  renderInstallRecord,
  type InstallRecord,
} from './install-record.js';
import { renderInstructionsBlock, upsertBlock } from './instructions.js';
import type { Kit } from './kit.js';
import type { TargetLayout } from './targets.js';

/**
 * - `create`: arquivo novo
 * - `overwrite`: arquivo alterado localmente, substituído por causa de `--force`
 * - `update`: arquivo instalado ou gerado pelo kit, sem edições locais, atualizado
 * - `unchanged`: conteúdo já é idêntico (a menos de CRLF/LF, nos arquivos do kit)
 * - `conflict`: arquivo alterado localmente, mantido (sem `--force`)
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
  const contentRoot = join(baseDirectory, layout.contentDirectory);

  const recordPath = join(contentRoot, INSTALL_RECORD_FILE);
  const currentRecord = await readIfExists(recordPath, fs);
  const record: InstallRecord =
    currentRecord === undefined ? new Map() : parseInstallRecord(currentRecord, recordPath);
  const nextRecord = new Map(record);

  for (const file of kit.items.flatMap((item) => item.files)) {
    const destination = join(contentRoot, file);
    const content = await fs.readFile(join(kit.root, file));
    const current = await readIfExists(destination, fs);
    const pristine = current !== undefined && isPristine(file, current, record);
    const action = actionForKitFile(current, content, pristine, force);
    operations.push({ action, destination, content });
    if (action !== 'conflict') {
      nextRecord.set(file, hashContent(content));
    }
  }

  const recordContent = renderInstallRecord(nextRecord);
  operations.push({
    action: actionForGeneratedFile(currentRecord, recordContent),
    destination: recordPath,
    content: recordContent,
  });

  const instructionsPath = join(baseDirectory, layout.instructionsFile);
  const currentInstructions = await readIfExists(instructionsPath, fs);
  const instructions = upsertBlock(currentInstructions, renderInstructionsBlock(kit, layout));
  operations.push({
    action: actionForGeneratedFile(currentInstructions, instructions),
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

function actionForKitFile(
  current: string | undefined,
  content: string,
  pristine: boolean,
  force: boolean,
): OperationAction {
  if (current === undefined) return 'create';
  if (hashContent(current) === hashContent(content)) return 'unchanged';
  if (pristine) return 'update';
  return force ? 'overwrite' : 'conflict';
}

function actionForGeneratedFile(current: string | undefined, content: string): OperationAction {
  if (current === undefined) return 'create';
  return current === content ? 'unchanged' : 'update';
}

async function readIfExists(path: string, fs: FileSystem): Promise<string | undefined> {
  return (await fs.exists(path)) ? fs.readFile(path) : undefined;
}
