import { db } from '@/lib/db';
export const dynamic='force-dynamic';
export async function GET(){
 try{await db.record.count();return Response.json({app:'LeadershipOS',instance:process.env.LEADERSHIPOS_INSTANCE??null},{headers:{'Cache-Control':'no-store'}});}
 catch{return Response.json({app:'LeadershipOS',ready:false},{status:503,headers:{'Cache-Control':'no-store'}});}
}
