
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { handleImageUpload } from "@/utils/fileUpload";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductFormProps {
  product: {
    name: string;
    price: string;
    category: string;
    description?: string;
    image: string;
    payment_link: string;
    is_physical?: boolean;
    purchase_price?: number; // Ajout du prix d'achat
  };
  onProductChange: (field: string, value: any) => void;
  onSubmit: () => void;
  submitLabel: string;
}

// Liste des catégories prédéfinies
const CATEGORIES = ["iptv", "sharing", "vod", "code digital", "divers"];

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

    // Vérifier si un lien de paiement est requis (sauf pour les produits physiques)
    if (!product.is_physical && !product.payment_link) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez ajouter un lien de paiement pour les produits numériques",
      });
      return;
    }

    onSubmit();
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

  // Déterminer si le produit est dans la catégorie "divers"
  const isDiversCategory = product.category === 'divers';
  
  // Si c'est un produit de la catégorie "divers", définir is_physical à true
  if (isDiversCategory && !product.is_physical) {
    onProductChange('is_physical', true);
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Prix de vente *</Label>
          <Input
            id="price"
            placeholder="Prix de vente"
            value={product.price}
            onChange={(e) => onProductChange('price', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchase_price">Prix d'achat</Label>
          <Input
            id="purchase_price"
            type="number"
            placeholder="Prix d'achat"
            value={product.purchase_price || ''}
            onChange={(e) => onProductChange('purchase_price', e.target.value ? Number(e.target.value) : null)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Catégorie *</Label>
        <Select
          value={product.category}
          onValueChange={(value) => {
            onProductChange('category', value);
            // Si la catégorie est "divers", définir automatiquement is_physical à true
            if (value === 'divers') {
              onProductChange('is_physical', true);
            }
          }}
        >
          <SelectTrigger id="category" className="w-full">
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2 mt-4">
        <Checkbox 
          id="is_physical" 
          checked={!!product.is_physical}
          onCheckedChange={(checked) => onProductChange('is_physical', checked)}
          disabled={product.category === 'divers'} // Désactiver si catégorie "divers"
        />
        <Label htmlFor="is_physical" className={product.category === 'divers' ? "text-gray-500" : ""}>
          Produit physique (paiement à la livraison)
        </Label>
      </div>

      {!product.is_physical && (
        <div className="space-y-2">
          <Label htmlFor="payment_link">Lien de paiement *</Label>
          <Input
            id="payment_link"
            placeholder="Lien de paiement"
            value={product.payment_link || ''}
            onChange={(e) => onProductChange('payment_link', e.target.value)}
            required={!product.is_physical}
          />
        </div>
      )}

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
