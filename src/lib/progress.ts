import { z } from 'zod';
export const progressUpdateSchema=z.object({id:z.string().min(1),view:z.enum(['objective','initiative']),progress:z.coerce.number().int().min(0).max(100)});
export function progressState(progress:number,currentStatus:string){
 return {progress,status:progress===100?'Complete':currentStatus==='Complete'?'Active':currentStatus};
}
