import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { basename, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
export function allowedBundleFile(path) {
  const name = basename(path);
  return !name.startsWith('.env') && !/\.db(?:-(?:wal|shm|journal))?$/.test(name) && name !== '.git';
}
export function packageWeb(root, destination) {
  const standalone = join(root, '.next/standalone');
  if (!existsSync(join(standalone, 'server.js'))) throw new Error('Run npm run build first to create the standalone server.');
  mkdirSync(destination, { recursive: true });
  cpSync(standalone, destination, { recursive: true, filter: allowedBundleFile });
  cpSync(join(root, '.next/static'), join(destination, '.next/static'), { recursive: true });
  if (existsSync(join(root, 'public'))) cpSync(join(root, 'public'), join(destination, 'public'), { recursive: true, filter: allowedBundleFile });
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (!process.argv[2]) throw new Error('A bundle destination is required.');
  packageWeb(process.cwd(), resolve(process.argv[2]));
}
