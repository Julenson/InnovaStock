// src/lib/db.ts
import { Client } from '@neondatabase/serverless';

// Asegúrate de que la variable de entorno esté definida
const connectionString = process.env.NETLIFY_DATABASE_URL;
if (!connectionString) {
  throw new Error('NETLIFY_DATABASE_URL no definida');
}

// Crear una única instancia del cliente
const client = new Client({ connectionString });

let isConnected = false;

// Función para conectar solo una vez por ejecución
export async function connectClient() {
  if (!isConnected) {
    console.log('Conectando a la base de datos...');
    await client.connect();
    isConnected = true;
    console.log('Conexión exitosa a la base de datos.');
  }
}

// ⚠️ No llames a esto en entornos serverless como Netlify o Vercel
// Solo útil para tests o scripts que se ejecutan y terminan
export async function endClient() {
  if (isConnected) {
    console.log('Cerrando conexión a la base de datos...');
    await client.end();
    isConnected = false;
    console.log('Conexion a la base de datos cerrada');
  }
}

export default client;
