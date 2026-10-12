import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readAgenda,validAgenda,agendaTemplates} from '../src/lib/agenda';
import {meetingSchema} from '../src/lib/meetings';
test('old plain-text agendas become ordered discussion topics',()=>{assert.deepEqual(readAgenda('First topic\n\nSecond topic').map(t=>t.title),['First topic','Second topic']);assert.equal(readAgenda('')[0],undefined);});
test('structured agendas preserve purpose, owner, timings and order',()=>{const topics=[{title:'Agree next steps',purpose:'Decide',owner:'Fictional lead',minutes:15}];assert.deepEqual(readAgenda(JSON.stringify({version:1,topics})),topics);assert.equal(validAgenda(JSON.stringify({version:1,topics:[{...topics[0],minutes:-1}]})),false);assert.equal(validAgenda('{broken'),false);});
test('meeting validation rejects malformed structured agendas',()=>{const data={id:'',title:'Fictional meeting',participants:'',due:'2026-10-20',time:'10:00',agenda:JSON.stringify({version:1,topics:[{title:'',purpose:'Unknown',owner:'',minutes:10}]}),notes:'',decisions:'',repeat:'Once',status:'Active'};assert.equal(meetingSchema.safeParse(data).success,false);});
test('starter agendas each finish with a decision and are valid',()=>{for(const topics of Object.values(agendaTemplates)){assert.equal(topics.at(-1)?.purpose,'Decide');assert.equal(validAgenda(JSON.stringify({version:1,topics})),true);}});
