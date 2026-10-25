#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import type { Output } from './cli/context.js';
import { run } from './cli/run.js';
import { NodeFileSystem } from './infra/node-file-system.js';
import { BUNDLED_KIT_DIRECTORY, PACKAGE_JSON_PATH } from './paths.js';

// Composition root: o único lugar que conhece as implementações concretas.
const consoleOutput: Output = {
  info: (message) => {
    console.log(message);
  },
  error: (message) => {
    console.error(message);
  },
};

const { version } = JSON.parse(await readFile(PACKAGE_JSON_PATH, 'utf8')) as { version: string };

try {
  process.exitCode = await run(process.argv.slice(2), {
    fs: new NodeFileSystem(),
    output: consoleOutput,
    cwd: process.cwd(),
    homeDirectory: homedir(),
    bundledKitDirectory: BUNDLED_KIT_DIRECTORY,
    version,
  });
} catch (error) {
  console.error('Erro inesperado:', error);
  process.exitCode = 1;
}
