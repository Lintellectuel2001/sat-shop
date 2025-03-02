
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ProductForm from './ProductForm';

interface Product {
  id: string;
  name: string;
  price: string;
  description?: string;
  image: string;
  category: string;
  features?: string[];
  payment_link: string;
}

interface ProductGridProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductGrid = ({ products, onEdit, onDelete }: ProductGridProps) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
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
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-16 h-16 object-cover rounded"
                />
              </TableCell>
              <TableCell className="font-medium max-w-[200px] truncate">
                {product.name}
              </TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {product.description || '-'}
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                {product.payment_link}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditingProduct(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Modifier le Produit</DialogTitle>
                      <DialogDescription>
                        Modifiez les informations du produit.
                      </DialogDescription>
                    </DialogHeader>
                    {editingProduct && (
                      <ProductForm
                        product={editingProduct}
                        onProductChange={(field, value) => 
                          setEditingProduct({ ...editingProduct, [field]: value })
                        }
                        onSubmit={() => {
                          if (editingProduct) {
                            onEdit(editingProduct);
                            setEditingProduct(null);
                          }
                        }}
                        submitLabel="Mettre à jour"
                      />
                    )}
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDeleteClick(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce produit ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductGrid;
