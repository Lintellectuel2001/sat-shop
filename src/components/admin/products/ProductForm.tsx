import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { handleImageUpload } from "@/utils/fileUpload";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

interface ProductFormProps {
  product: {
    name: string;
    price: string;
    category: string;
    description?: string;
    image: string;
    payment_link: string;
  };
  onProductChange: (field: string, value: string) => void;
  onSubmit: () => void;
  submitLabel: string;
}

const ProductForm = ({ product, onProductChange, onSubmit, submitLabel }: ProductFormProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product.name || !product.price || !product.category || !product.payment_link) {
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

    onSubmit();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setIsUploading(true);
      try {
        const url = await handleImageUpload(e.target.files[0]);
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
          description: "Erreur lors du téléchargement de l'image",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

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
        <Label htmlFor="price">Prix *</Label>
        <Input
          id="price"
          placeholder="Prix"
          value={product.price}
          onChange={(e) => onProductChange('price', e.target.value)}
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
        <Label htmlFor="payment_link">Lien de paiement *</Label>
        <Input
          id="payment_link"
          placeholder="Lien de paiement"
          value={product.payment_link}
          onChange={(e) => onProductChange('payment_link', e.target.value)}
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