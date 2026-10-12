import 'dotenv/config';
import { createClient } from '@libsql/client';
import { existsSync, mkdirSync, statSync, chmodSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Take a consistent SQLite snapshot once. Never replace an existing app database. */
export async function prepareMacData(sourceUrl, destination) {
  if (!sourceUrl.startsWith('file:')) throw new Error('Only a local SQLite database can be imported.');
  destination = resolve(destination);
  if (existsSync(destination)) {
    if (!statSync(destination).isFile()) throw new Error('The app database path is not a file.');
    const existing = createClient({ url: 'file:' + destination });
    try { await existing.execute('SELECT id FROM "Record" LIMIT 1'); }
    finally { existing.close(); }
    return { imported: false, destination };
  }
  const source = resolve(sourceUrl.slice(5));
  if (!existsSync(source)) throw new Error('The source database does not exist. Run npm run db:setup first.');
  mkdirSync(dirname(destination), { recursive: true, mode: 0o700 });
  const client = createClient({ url: 'file:' + source });
  try {
    await client.execute('SELECT id FROM "Record" LIMIT 1');
    await client.execute({ sql: 'VACUUM INTO ?', args: [destination] });
    chmodSync(destination, 0o600);
  } finally { client.close(); }
  return { imported: true, destination };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const destination = process.argv[2];
  if (!destination) throw new Error('An app database destination is required.');
  prepareMacData(process.env.DATABASE_URL || 'file:./prisma/leadership.db', destination)
    .then(result => console.log(result.imported ? 'Imported a safe copy of your current data.' : 'Kept the app’s existing saved data.'))
    .catch(error => { console.error(error.message); process.exitCode = 1; });
}
