
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  is_available?: boolean;
}

interface ProductGridProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string, newStatus: boolean) => void;
}

const ProductGrid = ({ products, onEdit, onDelete, onToggleAvailability }: ProductGridProps) => {
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

  const handleToggleAvailability = (id: string, currentStatus: boolean) => {
    onToggleAvailability(id, !currentStatus);
  };

  // Fonction pour obtenir la couleur de badge en fonction de la catégorie
  const getCategoryBadgeClass = (category: string) => {
    const lowerCategory = category.toLowerCase();
    switch (lowerCategory) {
      case 'iptv':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'sharing':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'vod':
        return 'bg-green-500 hover:bg-green-600';
      case 'code digital':
        return 'bg-amber-500 hover:bg-amber-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
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
            <TableRow key={product.id}>
              <TableCell>
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-16 h-16 object-cover rounded"
                  />
                  <Badge 
                    className={`absolute -top-2 -left-2 ${product.is_available ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                  >
                    {product.is_available ? 'Disponible' : 'Non Disponible'}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="font-medium max-w-[200px] truncate">
                {product.name}
              </TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>
                <Badge className={getCategoryBadgeClass(product.category)}>
                  {product.category.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                {product.description || '-'}
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                {product.payment_link}
              </TableCell>
              <TableCell>
                <Button
                  variant={product.is_available ? "outline" : "destructive"}
                  onClick={() => handleToggleAvailability(product.id, !!product.is_available)}
                  className={`flex items-center gap-1 ${product.is_available ? 'border-green-500 text-green-600 hover:bg-green-50' : 'bg-red-500 hover:bg-red-600'}`}
                >
                  {product.is_available ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Disponible</span>
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4" />
                      <span>Non Disponible</span>
                    </>
                  )}
                </Button>
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
