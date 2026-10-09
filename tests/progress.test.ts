import {test} from 'node:test';
import assert from 'node:assert/strict';
import {progressState,progressUpdateSchema} from '../src/lib/progress';
test('100 percent finishes work; reducing completed progress reopens it',()=>{assert.deepEqual(progressState(100,'Blocked'),{progress:100,status:'Complete'});assert.deepEqual(progressState(50,'Complete'),{progress:50,status:'Active'});});
test('partial progress preserves a stuck status',()=>{assert.deepEqual(progressState(25,'Blocked'),{progress:25,status:'Blocked'});});
test('quick updates reject invalid numbers and unrelated record types',()=>{for(const change of [{progress:101},{progress:-1},{progress:2.5},{view:'remit'},{id:''}])assert.equal(progressUpdateSchema.safeParse({id:'example',view:'objective',progress:50,...change}).success,false);});
