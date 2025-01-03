import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
  payment_link: string;
  description?: string;
  features?: string[];
}

const ProductsManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les produits",
        variant: "destructive",
      });
      return;
    }

    setProducts(data || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData = {
      name: formData.get('name') as string,
      price: formData.get('price') as string,
      image: formData.get('image') as string,
      category: formData.get('category') as string,
      payment_link: formData.get('payment_link') as string,
      description: formData.get('description') as string,
      features: (formData.get('features') as string).split('\n').filter(f => f.trim()),
    };

    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le produit",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Produit mis à jour avec succès",
      });
    } else {
      const { error } = await supabase
        .from('products')
        .insert([productData]);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter le produit",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Produit ajouté avec succès",
      });
    }

    setEditingProduct(null);
    setIsAdding(false);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Produit supprimé avec succès",
    });
    fetchProducts();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Gestion des Produits</h2>
        <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Ajouter un produit
        </Button>
      </div>

      {(isAdding || editingProduct) && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
          <Input
            name="name"
            placeholder="Nom du produit"
            defaultValue={editingProduct?.name || ''}
            required
          />
          <Input
            name="price"
            placeholder="Prix"
            defaultValue={editingProduct?.price || ''}
            required
          />
          <Input
            name="image"
            placeholder="URL de l'image"
            defaultValue={editingProduct?.image || ''}
            required
          />
          <Input
            name="category"
            placeholder="Catégorie"
            defaultValue={editingProduct?.category || ''}
            required
          />
          <Input
            name="payment_link"
            placeholder="Lien de paiement"
            defaultValue={editingProduct?.payment_link || ''}
            required
          />
          <Textarea
            name="description"
            placeholder="Description"
            defaultValue={editingProduct?.description || ''}
          />
          <Textarea
            name="features"
            placeholder="Caractéristiques (une par ligne)"
            defaultValue={editingProduct?.features?.join('\n') || ''}
          />
          <div className="flex gap-4">
            <Button type="submit">
              {editingProduct ? 'Mettre à jour' : 'Ajouter'}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                setEditingProduct(null);
                setIsAdding(false);
              }}
            >
              Annuler
            </Button>
          </div>
        </form>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-16 h-16 object-contain"
                />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingProduct(product)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductsManager;