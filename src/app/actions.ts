'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { recordSchema } from '@/lib/validation';
import { progressState, progressUpdateSchema } from '@/lib/progress';
export async function saveRecord(form:FormData){
 const raw=Object.fromEntries(form.entries());
 const parsed=recordSchema.safeParse(raw);
 if(!parsed.success)redirect('/?view='+encodeURIComponent(String(raw.kind))+'&error='+encodeURIComponent(parsed.error.issues[0].message));
 if(['objective','initiative'].includes(parsed.data.kind)){Object.assign(parsed.data,parsed.data.status==='Complete'?{progress:100}:progressState(parsed.data.progress,parsed.data.status));}
 const id=String(form.get('id')||'');
 if(id){const current=await db.record.findUnique({where:{id}});if(!current || current.kind!==parsed.data.kind)throw new Error('Record not found');await db.record.update({where:{id},data:parsed.data});}
 else {if(parsed.data.kind==='remit')throw new Error('Edit the existing five responsibility areas');await db.record.create({data:parsed.data});}
 revalidatePath('/');redirect('/?view='+parsed.data.kind+'&saved=1');
}

export async function updateProgress(form:FormData){
 const parsed=progressUpdateSchema.safeParse(Object.fromEntries(form.entries()));
 if(!parsed.success)redirect('/?error='+encodeURIComponent('Choose a progress number between 0 and 100.'));
 const {id,view,progress}=parsed.data;
 const current=await db.record.findUnique({where:{id}});
 if(!current||current.kind!==view)throw new Error('Goal or improvement not found');
 await db.record.update({where:{id},data:progressState(progress,current.status)});
 revalidatePath('/');redirect('/?view='+view+'&saved=1#record-'+id);
}
