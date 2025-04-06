
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { handleImageUpload } from "@/utils/fileUpload";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { Switch } from "@/components/ui/switch";
import { Package, DollarSign } from "lucide-react";

interface ProductFormProps {
  product: {
    name: string;
    price: string;
    category: string;
    description?: string;
    image: string;
    payment_link: string;
    is_physical?: boolean;
    stock_quantity?: number;
    stock_alert_threshold?: number;
    purchase_price?: number;
  };
  onProductChange: (field: string, value: string | boolean | number) => void;
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
        <Label htmlFor="price">Prix de vente *</Label>
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
        <div className="flex items-center space-x-2">
          <Switch
            id="is_physical"
            checked={product.is_physical}
            onCheckedChange={(checked) => onProductChange('is_physical', checked)}
          />
          <Label htmlFor="is_physical" className="cursor-pointer">Produit physique</Label>
        </div>
        <p className="text-sm text-muted-foreground">
          Activez cette option si ce produit nécessite une gestion de stock
        </p>
      </div>

      {product.is_physical && (
        <div className="space-y-4 rounded-md border p-4">
          <h3 className="font-medium flex items-center">
            <Package className="mr-2 h-4 w-4" />
            Gestion de stock
          </h3>
          
          <div className="space-y-2">
            <Label htmlFor="stock_quantity">Quantité en stock</Label>
            <Input
              id="stock_quantity"
              type="number"
              min="0"
              value={product.stock_quantity || 0}
              onChange={(e) => onProductChange('stock_quantity', parseInt(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stock_alert_threshold">Seuil d'alerte</Label>
            <Input
              id="stock_alert_threshold"
              type="number"
              min="0"
              value={product.stock_alert_threshold || 5}
              onChange={(e) => onProductChange('stock_alert_threshold', parseInt(e.target.value) || 0)}
            />
            <p className="text-xs text-muted-foreground">
              Vous recevrez une alerte lorsque le stock sera inférieur ou égal à cette valeur
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="purchase_price">Prix d'achat</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="purchase_price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={product.purchase_price || 0}
                onChange={(e) => onProductChange('purchase_price', parseFloat(e.target.value) || 0)}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Utile pour calculer la marge bénéficiaire
            </p>
          </div>
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
