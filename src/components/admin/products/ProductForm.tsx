
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { handleImageUpload } from "@/utils/fileUpload";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { useAdminCheck } from "@/hooks/useAdminCheck";

interface Product {
  name: string;
  price: string;
  category: string;
  description?: string;
  image: string;
  features?: string[];
  rating?: number;
  reviews?: number;
}

interface ProductFormProps {
  product: Product;
  onProductChange: (field: string, value: string) => void;
  onSubmit: () => void;
  submitLabel: string;
}

const ProductForm = ({ product, onProductChange, onSubmit, submitLabel }: ProductFormProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const { isAdmin, isLoading, sessionChecked } = useAdminCheck();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous devez être administrateur pour effectuer cette action",
      });
      return;
    }

    if (!product.name || !product.price || !product.category) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
      });
      return;
    }

    if (!product.image) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez ajouter une image",
      });
      return;
    }

    // Vérifier que le prix est un nombre valide
    const priceValue = product.price.replace(/[^0-9]/g, '');
    if (!priceValue || isNaN(Number(priceValue))) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le prix doit être un nombre valide",
      });
      return;
    }

    onSubmit();
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Nettoyer le prix pour ne garder que les chiffres
    let value = e.target.value.replace(/[^0-9]/g, '');
    // Formater le prix avec DZD
    const formattedPrice = value ? `${value} DZD` : '';
    onProductChange('price', formattedPrice);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous devez être administrateur pour uploader des images",
      });
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await handleImageUpload(file);
      onProductChange('image', url);
      toast({
        title: "Succès",
        description: "Image téléchargée avec succès",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors du téléchargement de l'image",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading || !sessionChecked) {
    return <div>Chargement...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom *</Label>
        <Input
          id="name"
          placeholder="Nom du produit"
          value={product.name}
          onChange={(e) => onProductChange('name', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Prix * (DZD)</Label>
        <Input
          id="price"
          placeholder="Prix (ex: 1000 DZD)"
          value={product.price}
          onChange={handlePriceChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Catégorie *</Label>
        <Input
          id="category"
          placeholder="Catégorie"
          value={product.category}
          onChange={(e) => onProductChange('category', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Description"
          value={product.description || ''}
          onChange={(e) => onProductChange('description', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image *</Label>
        <div className="flex flex-col gap-2">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isUploading}
          />
          {product.image && (
            <div className="mt-2">
              <img 
                src={product.image} 
                alt="Aperçu du produit" 
                className="w-32 h-32 object-cover rounded-md"
              />
            </div>
          )}
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={isUploading}
      >
        {isUploading ? 'Téléchargement...' : submitLabel}
      </Button>
    </form>
  );
};

export default ProductForm;
