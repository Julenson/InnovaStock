// src/lib/db.ts (o similar)
import { Client } from '@neondatabase/serverless';

const connectionString = process.env.NETLIFY_DATABASE_URL;

if (!connectionString) {
  throw new Error('No se ha definido NETLIFY_DATABASE_URL');
}

const client = new Client({
  connectionString,
});

export default client;
