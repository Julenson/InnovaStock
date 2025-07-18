//db/db.ts
import { neon } from '@netlify/neon';
import { Material } from '../src/lib/types';

const sql = neon();

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