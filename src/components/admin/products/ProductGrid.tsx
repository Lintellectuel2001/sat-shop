
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ProductRow from './ProductRow';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

interface Product {
  id: string;
  name: string;
  price: string;
  description?: string;
  image: string;
  category: string;
  features?: string[];
  payment_link: string;
  is_available?: boolean;
}

interface ProductGridProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string, newStatus: boolean) => void;
}

const ProductGrid = ({ products, onEdit, onDelete, onToggleAvailability }: ProductGridProps) => {
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      onDelete(productToDelete);
      setProductToDelete(null);
    }
    setIsDeleteDialogOpen(false);
  };

  const cancelDelete = () => {
    setProductToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const handleToggleAvailability = (productId: string, currentStatus: boolean) => {
    // Inverser le statut actuel pour obtenir le nouveau statut
    const newStatus = !currentStatus;
    onToggleAvailability(productId, newStatus);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Lien de paiement</TableHead>
            <TableHead>Disponibilité</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <ProductRow 
              key={product.id}
              product={product}
              onEdit={onEdit}
              onDeleteClick={handleDeleteClick}
              onToggleAvailability={handleToggleAvailability}
            />
          ))}
        </TableBody>
      </Table>

      <DeleteConfirmationDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default ProductGrid;
