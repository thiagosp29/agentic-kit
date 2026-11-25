import { UsageError } from './errors.js';
import type { KitItemKind } from './kit.js';

export const TARGET_IDS = ['claude', 'agents'] as const;
export type TargetId = (typeof TARGET_IDS)[number];

/** `project`: instala no repositório; `global`: instala no diretório do usuário. */
export type InstallScope = 'project' | 'global';

/** Onde os arquivos do kit ficam, relativo ao diretório base da instalação, sempre com `/`. */
export interface TargetLayout {
  readonly contentDirectory: string;
  readonly instructionsFile: string;
  /** Tipos cujas descrições a ferramenta já carrega sozinha; o índice não as repete. */
  readonly preloadedKinds: readonly KitItemKind[];
}

export interface Target {
  readonly id: TargetId;
  readonly label: string;
  readonly supportsGlobal: boolean;
  /** Pastas usadas por versões antigas do kit, relativas ao diretório base; a CLI avisa se existirem. */
  readonly legacyContentDirectories: readonly string[];
  layoutFor(scope: InstallScope): TargetLayout;
}

const TARGETS: Readonly<Record<TargetId, Target>> = {
  claude: {
    id: 'claude',
    label: 'Claude Code — skills e agents em .claude/, instruções em CLAUDE.md',
    supportsGlobal: true,
    legacyContentDirectories: [],
    layoutFor: (scope) => ({
      contentDirectory: '.claude',
      instructionsFile: scope === 'global' ? '.claude/CLAUDE.md' : 'CLAUDE.md',
      preloadedKinds: ['skill', 'agent'],
    }),
  },
  agents: {
    id: 'agents',
    label: 'Qualquer IA que lê AGENTS.md (Codex, Copilot, Cursor, Gemini...) — conteúdo em .agents/',
    supportsGlobal: false,
    // `.agents/skills/` é onde Codex, GitHub Copilot e Cursor procuram skills sem configuração.
    legacyContentDirectories: ['.ai'],
    layoutFor: () => ({ contentDirectory: '.agents', instructionsFile: 'AGENTS.md', preloadedKinds: [] }),
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

/** Resolve uma lista de ids (cada um pode ter vários separados por vírgula), sem repetições. */
export function resolveTargets(values: readonly string[]): Target[] {
  const ids = values.flatMap((value) => value.split(',')).map((id) => id.trim());
  if (ids.some((id) => id === '')) {
    throw new UsageError(`Destino vazio em --target. Use um ou mais de: ${TARGET_IDS.join(', ')}.`);
  }
  return [...new Set(ids)].map(resolveTarget);
}

function isTargetId(id: string): id is TargetId {
  return (TARGET_IDS as readonly string[]).includes(id);
}
