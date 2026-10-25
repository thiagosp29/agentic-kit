import { fileURLToPath } from 'node:url';

// Este arquivo fica em src/ (desenvolvimento) e em dist/ (build); nos dois casos o kit e o
// package.json estão um nível acima.
export const BUNDLED_KIT_DIRECTORY = fileURLToPath(new URL('../kit', import.meta.url));
export const PACKAGE_JSON_PATH = fileURLToPath(new URL('../package.json', import.meta.url));
