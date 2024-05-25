import dotenv from 'dotenv';

dotenv.config({ path: `.env` });

export const {
  DB_USER,
  DB_NAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
} = {...process.env } as { [key: string]: string };