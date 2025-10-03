
import { drizzle } from "drizzle-orm/mysql2"

//    if(!process.env.DATABSE_URL) {
//    throw new Error('DATABASE_URL must be set.')
//    }

export const db = drizzle(process.env.DATABASE_URL!);

