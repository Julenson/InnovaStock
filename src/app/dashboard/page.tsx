'use client';

import * as React from 'react';
import { PlusCircle, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddMaterialDialog } from '@/components/add-material-dialog';
import { PredictReorderDialog } from '@/components/predict-reorder-dialog';
import { MaterialsTable } from '@/components/materials-table';
import { initialMaterials } from '@/lib/data';
import type { Material } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function DashboardPage() {
  const [materials, setMaterials] = React.useState<Material[]>(initialMaterials);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const { toast } = useToast();

  const handleAddMaterial = (newMaterialData: Omit<Material, 'id' | 'lastUpdated'>) => {
    const newMaterial: Material = {
      ...newMaterialData,
      id: `mat-${Date.now()}`,
      lastUpdated: format(new Date(), 'yyyy-MM-dd'),
    };
    setMaterials(prev => [newMaterial, ...prev]);
    toast({
      title: "Material Added",
      description: `${newMaterial.name} has been successfully added to the inventory.`,
    });
  };

  const handleRemoveMaterial = (materialId: string) => {
    const materialToRemove = materials.find(m => m.id === materialId);
    setMaterials(prev => prev.filter(m => m.id !== materialId));
    if (materialToRemove) {
      toast({
        title: "Material Removed",
        description: `${materialToRemove.name} has been removed.`,
        variant: "destructive",
      });
    }
  };

  const handleUpdateQuantity = (materialId: string, change: number) => {
    setMaterials(prev =>
      prev.map(m =>
        m.id === materialId
          ? { ...m, quantity: Math.max(0, m.quantity + change), lastUpdated: format(new Date(), 'yyyy-MM-dd') }
          : m
      )
    );
  };

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
