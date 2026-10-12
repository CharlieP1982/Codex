import { z } from 'zod';
export const dateSchema=z.string().refine(value=>/^\d{4}-\d{2}-\d{2}$/.test(value)&&!isNaN(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value,'Choose a valid date.');
export const meetingSchema=z.object({
 id:z.string().max(100).default(''),title:z.string().trim().min(1,'Give the meeting a name.').max(160),
 participants:z.string().trim().max(500),due:dateSchema,time:z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/,'Choose a valid time.'),
 agenda:z.string().trim().max(8000),notes:z.string().trim().max(8000),decisions:z.string().trim().max(4000),
 repeat:z.enum(['Once','Weekly','Monthly']),status:z.enum(['Active','Complete']),
});
export const meetingDetailSchema=z.object({time:z.string(),agenda:z.string(),notes:z.string(),repeat:z.enum(['Once','Weekly','Monthly'])});
export function meetingDetail(detail:string){try{return meetingDetailSchema.parse(JSON.parse(detail));}catch{return {time:'',agenda:'',notes:'',repeat:'Once' as const};}}
export const meetingActionSchema=z.object({id:z.string().max(100).default(''),meetingId:z.string().min(1).max(100),title:z.string().trim().min(1,'Write down the action.').max(160),owner:z.string().trim().min(1,'Say who will do it.').max(120),due:dateSchema,status:z.enum(['Active','Complete'])});
export function nextMeetingDate(date:string,repeat:'Weekly'|'Monthly'){
 const current=new Date(date+'T12:00:00Z');
 if(repeat==='Weekly')current.setUTCDate(current.getUTCDate()+7);
 else{const day=current.getUTCDate();current.setUTCDate(1);current.setUTCMonth(current.getUTCMonth()+1);const last=new Date(Date.UTC(current.getUTCFullYear(),current.getUTCMonth()+1,0)).getUTCDate();current.setUTCDate(Math.min(day,last));}
 return current.toISOString().slice(0,10);
}
