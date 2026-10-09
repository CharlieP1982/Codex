import { createDb } from './client';
const globalDb=globalThis as unknown as {prisma?:ReturnType<typeof createDb>};
export const db=globalDb.prisma??createDb();
if(process.env.NODE_ENV!=='production')globalDb.prisma=db;
