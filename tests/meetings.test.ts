import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createDb } from '../src/lib/client';
import { meetingSchema,meetingDetail,nextMeetingDate } from '../src/lib/meetings';
import { storeMeeting,storeMeetingAction,repeatMeeting } from '../src/lib/meeting-store';
const valid={id:'',title:'Fictional team check-in',participants:'Department leads',due:'2026-01-31',time:'09:30',agenda:'Agree the handover\nDecide next steps',notes:'A useful discussion',decisions:'Try the change',repeat:'Monthly',status:'Active'};
test('meetings reject blank names, invalid dates, times and unanswered repeat choices',()=>{for(const change of [{title:' '},{due:'2026-02-30'},{time:'25:00'},{repeat:''},{status:'invalid'}])assert.equal(meetingSchema.safeParse({...valid,...change}).success,false);});
test('weekly and monthly dates roll over correctly and clamp short months',()=>{assert.equal(nextMeetingDate('2026-12-28','Weekly'),'2027-01-04');assert.equal(nextMeetingDate('2026-01-31','Monthly'),'2026-02-28');assert.equal(nextMeetingDate('2028-01-31','Monthly'),'2028-02-29');});
test('meetings and actions persist; repeating copies the agenda but leaves notes, decisions and actions blank',async()=>{
 const db=createDb();const ids:string[]=[];
 try{
  const original=await storeMeeting(db,valid);ids.push(original.id);
  const action=await storeMeetingAction(db,{id:'',meetingId:original.id,title:'Try the handover',owner:'Fictional lead',due:'2026-02-03',status:'Active'});ids.push(action.id);
  await storeMeetingAction(db,{id:action.id,meetingId:original.id,title:action.title,owner:action.owner,due:action.due,status:'Complete'});
  const next=await repeatMeeting(db,original.id);ids.push(next.id);
  assert.equal(next.due,'2026-02-28');assert.equal(next.outcome,'');assert.equal(meetingDetail(next.detail).agenda,valid.agenda);assert.equal(meetingDetail(next.detail).notes,'');assert.equal(await db.record.count({where:{kind:'meeting-action',benefit:next.id}}),0);
  const fresh=createDb();try{assert.equal((await fresh.record.findUniqueOrThrow({where:{id:action.id}})).status,'Complete');assert.equal(meetingDetail((await fresh.record.findUniqueOrThrow({where:{id:original.id}})).detail).notes,valid.notes);}finally{await fresh.$disconnect();}
  await assert.rejects(storeMeetingAction(db,{id:action.id,meetingId:next.id,title:action.title,owner:action.owner,due:action.due,status:'Active'}),/Action not found/);
  await assert.rejects(storeMeeting(db,{...valid,id:action.id}),/Meeting not found/);
 }finally{await db.record.deleteMany({where:{id:{in:ids}}});await db.$disconnect();}
});
