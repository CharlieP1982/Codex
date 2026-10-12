import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,rmSync,existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createClient} from '@libsql/client';
import {prepareMacData} from '../scripts/mac-data.mjs';
import {packageWeb,allowedBundleFile} from '../scripts/package-mac-web.mjs';
test('Mac data import takes a consistent snapshot and never replaces saved app data',async()=>{
 const root=mkdtempSync(join(tmpdir(),'leadershipos-data-test-'));const source=join(root,'source.db'),dest=join(root,'support','leadership.db');const db=createClient({url:'file:'+source});
 try{await db.execute('CREATE TABLE Record (id TEXT PRIMARY KEY, title TEXT)');await db.execute("INSERT INTO Record VALUES ('example','Original')");assert.equal((await prepareMacData('file:'+source,dest)).imported,true);await db.execute("UPDATE Record SET title='Changed'");assert.equal((await prepareMacData('file:'+source,dest)).imported,false);const copy=createClient({url:'file:'+dest});try{assert.equal((await copy.execute('SELECT title FROM Record')).rows[0].title,'Original');}finally{copy.close();}await assert.rejects(prepareMacData('https://example.com',dest),/Only a local/);}finally{db.close();rmSync(root,{recursive:true,force:true});}
});
test('bundling includes runtime assets but excludes environment and SQLite data files',()=>{
 const root=mkdtempSync(join(tmpdir(),'leadershipos-bundle-test-'));const source=join(root,'.next','standalone');const dest=join(root,'bundle');
 try{mkdirSync(source,{recursive:true});mkdirSync(join(root,'.next','static'),{recursive:true});writeFileSync(join(source,'server.js'),'server');writeFileSync(join(source,'.env'),'PRIVATE');writeFileSync(join(source,'leadership.db'),'PRIVATE');writeFileSync(join(root,'.next','static','asset.js'),'asset');packageWeb(root,dest);assert.equal(readFileSync(join(dest,'server.js'),'utf8'),'server');assert.equal(existsSync(join(dest,'.env')),false);assert.equal(existsSync(join(dest,'leadership.db')),false);assert.equal(existsSync(join(dest,'.next','static','asset.js')),true);for(const file of ['.env.local','leadership.db-wal','leadership.db-shm'])assert.equal(allowedBundleFile(file),false);}finally{rmSync(root,{recursive:true,force:true});}
});
