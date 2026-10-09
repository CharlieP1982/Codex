import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recordSchema, focus } from '../src/lib/validation';
const valid={kind:'objective',title:'Improve cover',detail:'Q4',owner:'Leader',outcome:'Cover three critical skills',nextAction:'Review gaps',benefit:'Resilience',cadence:'Weekly',due:'2026-12-01',status:'Active',progress:30};
test('accepts a measurable objective and coerces progress',()=>{assert.equal(recordSchema.parse({...valid,progress:'45'}).progress,45)});
test('rejects blank titles, missing outcomes and invalid progress',()=>{for(const change of [{title:' '},{outcome:''},{progress:101},{progress:-1},{progress:2.5},{due:'bad'},{due:'2026-02-30'},{kind:'unknown'}])assert.equal(recordSchema.safeParse({...valid,...change}).success,false)});
test('focus uses confirmed work, prioritises blockers and excludes completed records',()=>{const records=[{...valid,title:'Later'},{...valid,title:'Due',due:'2026-10-01'},{...valid,title:'Blocked',status:'Blocked'},{...valid,title:'Done',status:'Complete'},{...valid,title:'Remit',kind:'remit'}];const result=focus(records,'2026-10-09');assert.deepEqual(result.map(r=>r.record.title),['Blocked','Due','Later']);assert.match(result[0].reason,/blocker/)});
