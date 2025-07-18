'use client';

import * as React from 'react';
import { PlusCircle, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddMaterialDialog } from '@/components/add-material-dialog';
import { PredictReorderDialog } from '@/components/predict-reorder-dialog';
import { MaterialsTable } from '@/components/materials-table';
import type { Material } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { getAllMaterials, addMaterial, updateMaterialQuantity, deleteMaterial } from '../../db/managedb'; // O usa el alias si aplica

export default function DashboardPage() {
  const [materials, setMaterials] = React.useState<Material[]>([]);
  const [isloading, setIsLoading] = React.useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setIsLoading(true); // Set loading to true before fetching
        const materialsData = await getAllMaterials();
        setMaterials(materialsData);
      } catch (error) {
        console.error('Error al Traer los materiales:', error);
        toast({
          title: "Error",
          description: "Error al cargar los materiales. Pro favor vuelve a intentarlo.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false); // Set loading to false after fetching (either success or error)
      }
    };
    fetchMaterials();
  }, []);

  const handleAddMaterial = async (newMaterialData: Omit<Material, 'id' | 'lastUpdated'>) => {
    try {
      // Call the addMaterial function from your managedb.ts
      const addedMaterial = await addMaterial(newMaterialData.name, newMaterialData.category, newMaterialData.quantity);

      // Update the state with the newly added material from the database (includes the generated ID)
      setMaterials(prev => [addedMaterial, ...prev]);

      toast({
        title: "Material Añadido",
        description: `${addedMaterial.name} ha sido añadido al inventario.`,
      });
    } catch (error) {
      console.error('Error al añadir el material:', error);
      toast({
        title: "Error",
        description: "Error al añadir el material. Por favor vuelve a intentarlo.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMaterial = async (materialId: string) => {
    const materialToRemove = materials.find(m => m.id === materialId);
    if (!materialToRemove) {
      return; // Material not found in current state
    }
    try {
      // Call the deleteMaterial function from your managedb.ts
      await deleteMaterial(materialId);

      // Update the state by removing the material
      setMaterials(prev => prev.filter(m => m.id !== materialId));

      toast({
        title: "Material Eliminado",
        description: `${materialToRemove.name} ha sido eliminado.`,
        variant: "destructive",
      });
    } catch (error) {
      console.error(`Error al eliminar el material ${materialId}:`, error);
      toast({
        title: "Error",
        description: "Error al eliminar el material. Por favor Vuelve a intentarlo",
        variant: "destructive",
      });
    }
  };

  const handleUpdateQuantity = async(materialId: string, change: number) => {
    const materialToUpdate = materials.find(m => m.id === materialId);
    if (!materialToUpdate) {
      return; // Material not found in current state
    }

    const newQuantity = Math.max(0, materialToUpdate.quantity + change);

    try {
      // Call the updateMaterialQuantity function from your managedb.ts
      const updatedMaterial = await updateMaterialQuantity(materialId, newQuantity);

      // Update the state with the updated material data from the database
      setMaterials(prev =>
        prev.map(m =>
          m.id === materialId
            ? updatedMaterial // Use the updated material data from the database
            : m
        )
      );
      toast({
        title: "Material Actualizado",
        description: `$La cantidad de {updatedMaterial.name} ha sido actualizada a ${updatedMaterial.quantity}.`,
      });
    } catch (error) {
        console.error(`Error al actualizar la cantidad del material con ID ${materialId}:`, error);
        toast({
          title: "Error",
          description: "Error al actualizar la cantidad del material. Por favor Vuelve a intentarlo",
          variant: "destructive",
        });
      }
    };

    if(isloading) {
      return<div>Loading materials ...</div>;
    }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">
          Inventory
        </h1>
        <div className="flex gap-2">
          <PredictReorderDialog />
          <AddMaterialDialog
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onAddMaterial={handleAddMaterial}
          />
        </div>
      </div>

      <MaterialsTable
        materials={materials}
        onRemove={handleRemoveMaterial}
        onUpdateQuantity={handleUpdateQuantity}
      />
    </>
  );
}