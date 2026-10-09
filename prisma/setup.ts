import { createClient } from '@libsql/client';
import { readFileSync } from 'node:fs';
import { localUrl } from '../src/lib/client';
const client=createClient({url:localUrl()});
async function main(){await client.executeMultiple(readFileSync(new URL('./migrations/202610090001_initial/migration.sql',import.meta.url),'utf8'));}
main().finally(()=>client.close());
