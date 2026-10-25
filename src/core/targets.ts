import { UsageError } from './errors.js';

export const TARGET_IDS = ['claude', 'agents'] as const;
export type TargetId = (typeof TARGET_IDS)[number];

/** `project`: instala no repositório; `global`: instala no diretório do usuário. */
export type InstallScope = 'project' | 'global';

/** Onde os arquivos do kit ficam, relativo ao diretório base da instalação, sempre com `/`. */
export interface TargetLayout {
  readonly contentDirectory: string;
  readonly instructionsFile: string;
}

export interface Target {
  readonly id: TargetId;
  readonly label: string;
  readonly supportsGlobal: boolean;
  layoutFor(scope: InstallScope): TargetLayout;
}

const TARGETS: Readonly<Record<TargetId, Target>> = {
  claude: {
    id: 'claude',
    label: 'Claude Code — skills e agents em .claude/, instruções em CLAUDE.md',
    supportsGlobal: true,
    layoutFor: (scope) => ({
      contentDirectory: '.claude',
      instructionsFile: scope === 'global' ? '.claude/CLAUDE.md' : 'CLAUDE.md',
    }),
  },
  agents: {
    id: 'agents',
    label: 'Qualquer IA que lê AGENTS.md (Codex, Copilot, Cursor, Gemini...) — conteúdo em .ai/',
    supportsGlobal: false,
    layoutFor: () => ({ contentDirectory: '.ai', instructionsFile: 'AGENTS.md' }),
  },
};

export function listTargets(): readonly Target[] {
  return TARGET_IDS.map((id) => TARGETS[id]);
}

export function resolveTarget(id: string): Target {
  if (!isTargetId(id)) {
    throw new UsageError(`Destino desconhecido: "${id}". Use um de: ${TARGET_IDS.join(', ')}.`);
  }
  return TARGETS[id];
}

function isTargetId(id: string): id is TargetId {
  return (TARGET_IDS as readonly string[]).includes(id);
}
