import type { PrismaClient } from '@prisma/client';
import { meetingSchema,meetingActionSchema,meetingDetail,nextMeetingDate } from './meetings';
export async function storeMeeting(db:PrismaClient,input:unknown){
 const data=meetingSchema.parse(input);const saved={kind:'meeting',title:data.title,owner:data.participants,due:data.due,outcome:data.decisions,status:data.status,detail:JSON.stringify({time:data.time,agenda:data.agenda,notes:data.notes,repeat:data.repeat})};
 if(data.id){const existing=await db.record.findUnique({where:{id:data.id}});if(existing?.kind!=='meeting')throw new Error('Meeting not found.');return db.record.update({where:{id:data.id},data:saved});}
 return db.record.create({data:saved});
}
export async function storeMeetingAction(db:PrismaClient,input:unknown){
 const data=meetingActionSchema.parse(input);const meeting=await db.record.findUnique({where:{id:data.meetingId}});if(meeting?.kind!=='meeting')throw new Error('Meeting not found.');
 const saved={kind:'meeting-action',title:data.title,owner:data.owner,due:data.due,status:data.status,progress:data.status==='Complete'?100:0,benefit:data.meetingId};
 if(data.id){const existing=await db.record.findUnique({where:{id:data.id}});if(existing?.kind!=='meeting-action'||existing.benefit!==data.meetingId)throw new Error('Action not found.');return db.record.update({where:{id:data.id},data:saved});}
 return db.record.create({data:saved});
}
export async function repeatMeeting(db:PrismaClient,id:string){
 const existing=await db.record.findUnique({where:{id}});if(existing?.kind!=='meeting')throw new Error('Meeting not found.');
 const detail=meetingDetail(existing.detail);if(detail.repeat==='Once')throw new Error('Choose a weekly or monthly repeat first.');
 return storeMeeting(db,{id:'',title:existing.title,participants:existing.owner,due:nextMeetingDate(existing.due,detail.repeat),time:detail.time,agenda:detail.agenda,notes:'',decisions:'',repeat:detail.repeat,status:'Active'});
}
