import {z} from 'zod';
export const dashboardNoteSchema=z.object({
 id:z.string().max(100).default(''),kind:z.enum(['hod-support','staff-skill','staff-training','staff-recruitment','boss-update']),
 title:z.string().trim().min(1,'Give this a name.').max(160),detail:z.string().trim().max(8000),
 owner:z.string().trim().max(120).default(''),nextAction:z.string().trim().max(2000).default(''),
}).superRefine((data,ctx)=>{
 if(data.kind==='hod-support'&&!/^slot-[0-5]$/.test(data.owner))ctx.addIssue({code:'custom',path:['owner'],message:'Choose a department lead slot.'});
 if(data.kind==='boss-update'&&!['done','problems','decisions'].includes(data.owner))ctx.addIssue({code:'custom',path:['owner'],message:'Choose an update section.'});
});
