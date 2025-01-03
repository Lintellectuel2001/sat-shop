import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { handleImageUpload } from "@/utils/fileUpload";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous devez être connecté pour accéder à cette page",
      });
      navigate('/login');
      return;
    }

    const { data: adminData } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', session.user.id)
      .single();

    if (!adminData) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous n'avez pas les droits d'administration",
      });
      navigate('/');
      return;
    }

    setIsAdmin(true);
  };

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

    console.log('Submitting form with product:', product);
    
    if (!product.name || !product.price || !product.category || !product.payment_link) {
      console.log('Missing required fields:', {
        name: !product.name,
        price: !product.price,
        category: !product.category,
        payment_link: !product.payment_link
      });
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
      });
      return;
    }

    if (!product.image) {
      console.log('Missing image');
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
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('Starting image upload:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    setIsUploading(true);
    try {
      const url = await handleImageUpload(file);
      console.log('Image uploaded successfully:', url);
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

  // ... keep existing code (form JSX structure)

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
            disabled={isUploading || !isAdmin}
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
        disabled={isUploading || !isAdmin}
      >
        {isUploading ? 'Téléchargement...' : submitLabel}
      </Button>
    </form>
  );
};

export default ProductForm;
