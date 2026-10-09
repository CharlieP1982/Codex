import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
export function localUrl(){const url=process.env.DATABASE_URL||'file:./prisma/leadership.db';if(!url.startsWith('file:'))throw new Error('LeadershipOS requires a local SQLite file');return url;}
export function createDb(){return new PrismaClient({adapter:new PrismaLibSQL({url:localUrl()})});}
