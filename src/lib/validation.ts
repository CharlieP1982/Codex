import { z } from 'zod';
export const kinds = ['remit','objective','activity','initiative','review'] as const;
export const recordSchema = z.object({
 kind: z.enum(kinds), title: z.string().trim().min(1,'A title is required').max(160),
 detail: z.string().trim().max(4000), owner: z.string().trim().max(120),
 outcome: z.string().trim().max(2000), nextAction: z.string().trim().max(2000), benefit: z.string().trim().max(2000),
 cadence: z.enum(['Weekly','Monthly']), due: z.string().refine(v => !v || /^\d{4}-\d{2}-\d{2}$/.test(v) && !isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0,10)===v,'Use a valid date'),
 status: z.enum(['Active','Blocked','Complete']), progress: z.coerce.number().int().min(0).max(100)
}).superRefine((v,ctx)=>{if(v.kind==='objective' && !v.outcome)ctx.addIssue({code:'custom',path:['outcome'],message:'Please say what success will look like for this goal'});});
export function focus<T extends {kind:string;status:string;due:string;title:string}>(records:T[],today:string) {
 return records.filter(r=>r.status!=='Complete' && ['objective','initiative','activity'].includes(r.kind)).map(r=>({record:r,score:r.status==='Blocked'?3:r.due && r.due<=today?2:1,reason:r.status==='Blocked'?'This is marked Stuck. What would help it move forward?':r.due && r.due<=today?'Its target date is today or has passed. Check the next step.':'Take the next small step you have written down.'})).sort((a,b)=>b.score-a.score).slice(0,3);
}
