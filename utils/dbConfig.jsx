import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'
const sql = neon('postgresql://neondb_owner:npg_ex9GWQMAln3N@ep-silent-wave-ae5uv7vu-pooler.c-2.us-east-2.aws.neon.tech/Expense-tracker?sslmode=require&channel_binding=require');
export const db = drizzle({client:sql},{schema});