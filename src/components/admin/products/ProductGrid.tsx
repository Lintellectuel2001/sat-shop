import React from 'react';
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
  is_physical?: boolean;
  available_for_delivery?: boolean;
}

interface ProductGridProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductGrid = ({ products, onEdit, onDelete }: ProductGridProps) => {
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);

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
            <TableHead>Type</TableHead>
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
              <TableCell>
                {product.is_physical ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {product.available_for_delivery ? 'Livraison' : 'Physique'}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Digital
                  </span>
                )}
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
                  onClick={() => onDelete(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductGrid;