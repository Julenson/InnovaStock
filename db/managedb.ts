//db/managedb.ts
import { neon } from '@netlify/neon';
import { Material } from '../src/lib/types';

console.log('Initializing Neon...');
const sql = neon();
console.log('Neon initialized.');

//export async function setAdmins()

export async function getAllMaterials() {
    try {
      const materials = await sql`SELECT id, name, category, quantity FROM materials` as Material[];
      return materials.map(material => ({
        ...material,
        // Assuming 'lastUpdated' is a Date column, you might need to adjust this based on your actual schema
        lastUpdated: null // Or map to the actual column if it exists
      }));
    } catch (error) {
      console.error('Error fetching materials:', error);
      throw error; 
    }
 }

 export async function getMaterialById(id: number) {
    try {
      const [material] = await sql`SELECT id, name, category, quantity FROM materials WHERE id = ${id}`;
      return material;
    } catch (error) {
      console.error(`Error fetching material with ID ${id}:`, error);
      throw error;
    }
  }

  export async function addMaterial(name: string, category: string | null, quantity: number) {
    try {
      const [newMaterial] = await sql`INSERT INTO materials (name, category, quantity) VALUES (${name}, ${category}, ${quantity}) RETURNING id, name, category, quantity`;
      // Explicitly cast or map the returned data to the Material type
      return {
        id: newMaterial.id,
        name: newMaterial.name,
        category: newMaterial.category,
        quantity: newMaterial.quantity,
      } as Material; // Cast to Material type
    } catch (error) {
      console.error('Error adding material:', error);
      throw error;
    }
  }

  export async function updateMaterialQuantity(id: number, quantity: number) {
    try {
      const [updatedMaterial] = await sql`UPDATE materials SET quantity = ${quantity} WHERE id = ${id} RETURNING id, name, category, quantity`;
      // Explicitly cast or map the returned data to the Material type
      return {
        id: updatedMaterial.id,
        name: updatedMaterial.name,
        category: updatedMaterial.category,
        quantity: updatedMaterial.quantity,
      } as Material; // Cast to Material type
    } catch (error) {
      console.error(`Error updating material quantity for ID ${id}:`, error);
      throw error;
    }
  }

  export async function deleteMaterial(id: number) {
    try {
      await sql`DELETE FROM materials WHERE id = ${id}`;
    } catch (error) {
      console.error(`Error deleting material with ID ${id}:`, error);
      throw error;
    }
  }

  export async function getUserByEmail(email: string) {
    try{
      await sql`SELECT FROM users WHERE email = ${email}:`;
    } catch (error) {
      console.error(`Error fetching user with email ${email}:`, error);
      throw error;
    }
  }

  export async function getUser(email: string, password: string) {
    try {
      await sql`SELECT FROM users WHERE email = ${email} AND password = ${password}`;
    } catch (error) {
      console.error(`Error fetching user with email ${email}:`, error);
      throw error;
    }
  }

  export async function createUser(authenticatedUserCategory: string, email: string, password: string, category: string) {
    // Check if the authenticated user is an admin
    if (authenticatedUserCategory !== 'admin') {
      throw new Error('Unauthorized: Only admins can create users.');
    }
  
    try {
      await sql`INSERT INTO users (email, password, category) VALUES (${email}, ${password}, ${category})`;
    } catch (error) {
      console.error(`Error creating user with email ${email}:`, error);
      throw error;
    }
  }

  export async function updatePassword(email: string, password: string) {
    try {
      await sql`UPDATE users SET password = ${password} WHERE email = ${email}`;
    } catch (error) {
      console.error(`Error updating user with email ${email}:`, error);
      throw error;
    }
  }

  export async function deleteUser(email: string) {
    try {
      await sql`DELETE FROM users WHERE email = ${email}`;
    } catch (error) {
      console.error(`Error deleting user with email ${email}:`, error);
      throw error;
    }
  }

  export async function getAllUsers() {
    try {
      await sql`SELECT FROM users`;
    } catch (error) {
      console.error(`Error fetching all users:`, error);
      throw error;
    }
  }