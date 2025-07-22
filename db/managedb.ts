// db/managedb.ts
import { neon } from '@netlify/neon';
import type { Material, User } from '../types';

console.log('Initializing Neon...');
const sql = neon(process.env.NETLIFY_DATABASE_URL);
console.log('Neon initialized.');

export async function getPostById(postId: number) {
  const result = await sql`SELECT * FROM posts WHERE id = ${postId}`;
  const [post] = result as any[];  // Cast aquí, por ahora any[]
  return post;
}

export async function initDatabase() {
  await sql`
    CREATE TABLE IF NOT EXISTS materials (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(255),
      quantity INTEGER NOT NULL DEFAULT 0
    );
  `;
  //await sql`DROP TABLE IF EXISTS users;`

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      category VARCHAR(255)
    );
  `;

  await sql`
  INSERT INTO users (email,password)
  VALUES ('demo@innovasport.com', 'demopassword')
  ON CONFLICT (email) DO NOTHING`

  console.log('Database initialized.');
}

initDatabase();

export async function getAllMaterials(): Promise<Material[]> {
  try {
    const materials = await sql`SELECT id, name, category, quantity FROM materials`;
    return materials as Material[];
  } catch (error) {
    console.error('Error fetching materials:', error);
    throw error;
  }
}

export async function getMaterialById(id: number): Promise<Material | undefined> {
  try {
    const result = await sql`SELECT id, name, category, quantity FROM materials WHERE id = ${id}`;
    const [material] = result as Material[];
    return material;
  } catch (error) {
    console.error(`Error fetching material with ID ${id}:`, error);
    throw error;
  }
}

export async function addMaterial(name: string, category: string | null, quantity: number): Promise<Material> {
  try {
    const result = await sql`
      INSERT INTO materials (name, category, quantity)
      VALUES (${name}, ${category}, ${quantity})
      RETURNING id, name, category, quantity
    `;
    const [newMaterial] = result as Material[];
    return newMaterial;
  } catch (error) {
    console.error('Error adding material:', error);
    throw error;
  }
}

export async function updateMaterialQuantity(id: number, quantity: number): Promise<Material> {
  try {
    const result = await sql`
      UPDATE materials SET quantity = ${quantity} WHERE id = ${id}
      RETURNING id, name, category, quantity
    `;
    const [updatedMaterial] = result as Material[];
    return updatedMaterial;
  } catch (error) {
    console.error(`Error updating material quantity for ID ${id}:`, error);
    throw error;
  }
}

export async function deleteMaterial(id: number): Promise<void> {
  try {
    await sql`DELETE FROM materials WHERE id = ${id}`;
  } catch (error) {
    console.error(`Error deleting material with ID ${id}:`, error);
    throw error;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await sql`
      SELECT id, email, password, category
      FROM users
      WHERE email = ${email}
    `;
    const [user] = result as User[];
    return user || null;
  } catch (error) {
    console.error(`Error fetching user with email ${email}:`, error);
    throw error;
  }
}

export async function getUser(email: string, password: string): Promise<User | null> {
  try {
    const result = await sql`
      SELECT id, email, password, category
      FROM users
      WHERE email = ${email} AND password = ${password}
    `;
    const [user] = result as User[];
    return user || null;
  } catch (error) {
    console.error(`Error fetching user with email ${email}:`, error);
    throw error;
  }
}

export async function createUser(authenticatedUserCategory: string, email: string, password: string, category: string): Promise<void> {
  if (authenticatedUserCategory !== 'admin') {
    throw new Error('Unauthorized: Only admins can create users.');
  }

  try {
    await sql`
      INSERT INTO users (email, password, category)
      VALUES (${email}, ${password}, ${category})
    `;
  } catch (error) {
    console.error(`Error creating user with email ${email}:`, error);
    throw error;
  }
}

export async function updatePassword(email: string, password: string): Promise<void> {
  try {
    await sql`
      UPDATE users SET password = ${password} WHERE email = ${email}
    `;
  } catch (error) {
    console.error(`Error updating user with email ${email}:`, error);
    throw error;
  }
}

export async function deleteUser(email: string): Promise<void> {
  try {
    await sql`DELETE FROM users WHERE email = ${email}`;
  } catch (error) {
    console.error(`Error deleting user with email ${email}:`, error);
    throw error;
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const result = await sql`SELECT id, email, password, category FROM users`;
    return result as User[];
  } catch (error) {
    console.error(`Error fetching all users:`, error);
    throw error;
  }
}
