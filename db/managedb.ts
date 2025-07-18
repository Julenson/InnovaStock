//db/db.ts
import { neon } from '@netlify/neon';

const sql = neon();

export async function getAllMaterials() {
    try {
      const materials = await sql`SELECT id, name, category, quantity FROM materials`;
      return materials;
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
      return newMaterial;
    } catch (error) {
      console.error('Error adding material:', error);
      throw error;
    }
  }

  export async function updateMaterialQuantity(id: number, quantity: number) {
    try {
      const [updatedMaterial] = await sql`UPDATE materials SET quantity = ${quantity} WHERE id = ${id} RETURNING id, name, category, quantity`;
      return updatedMaterial;
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