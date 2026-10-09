'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { recordSchema } from '@/lib/validation';
export async function saveRecord(form:FormData){
 const raw=Object.fromEntries(form.entries());
 const parsed=recordSchema.safeParse(raw);
 if(!parsed.success)redirect('/?view='+encodeURIComponent(String(raw.kind))+'&error='+encodeURIComponent(parsed.error.issues[0].message));
 const id=String(form.get('id')||'');
 if(id){const current=await db.record.findUnique({where:{id}});if(!current || current.kind!==parsed.data.kind)throw new Error('Record not found');await db.record.update({where:{id},data:parsed.data});}
 else {if(parsed.data.kind==='remit')throw new Error('Edit the existing five responsibility areas');await db.record.create({data:parsed.data});}
 revalidatePath('/');redirect('/?view='+parsed.data.kind+'&saved=1');
}
