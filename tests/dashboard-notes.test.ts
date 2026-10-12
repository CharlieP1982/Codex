import {test} from 'node:test';
import assert from 'node:assert/strict';
import {dashboardNoteSchema} from '../src/lib/dashboard-notes';
test('dashboard note validation protects role slots and report sections',()=>{
 const note={id:'',kind:'hod-support',title:'Fictional head',detail:'A support conversation',owner:'slot-0',nextAction:'Check next week'};
 assert.equal(dashboardNoteSchema.safeParse(note).success,true);
 for(const change of [{title:''},{owner:'slot-6'},{kind:'unknown'},{detail:'x'.repeat(8001)}])assert.equal(dashboardNoteSchema.safeParse({...note,...change}).success,false);
 assert.equal(dashboardNoteSchema.safeParse({...note,kind:'boss-update',owner:'decisions'}).success,true);
 assert.equal(dashboardNoteSchema.safeParse({...note,kind:'boss-update',owner:'invalid'}).success,false);
});
