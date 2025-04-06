import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Check, X, Package, AlertTriangle } from "lucide-react";
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
  is_physical?: boolean;
  stock_quantity?: number;
  stock_alert_threshold?: number;
  purchase_price?: number;
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

  const handleProductChange = (field: string, value: string | boolean | number) => {
    if (editingProduct) {
      setEditingProduct({ 
        ...editingProduct, 
        [field]: value 
      });
    }
  };

  const getStockStatus = (product: Product) => {
    if (!product.is_physical) return null;
    
    if (product.stock_quantity === 0) {
      return <Badge variant="destructive">Épuisé</Badge>;
    } else if (product.stock_quantity && product.stock_alert_threshold && 
               product.stock_quantity <= product.stock_alert_threshold) {
      return <Badge variant="outline" className="bg-amber-500 text-white">Stock bas</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-500 text-white">En stock</Badge>;
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
                  
                  {product.is_physical && (
                    <div className="absolute -top-2 -right-2">
                      {getStockStatus(product)}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium max-w-[200px] truncate">
                <div className="flex items-center">
                  {product.name}
                  {product.is_physical && (
                    <Package className="ml-2 h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.category}</TableCell>
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
                        onProductChange={handleProductChange}
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
