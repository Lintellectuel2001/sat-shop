import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { handleImageUpload } from "@/utils/fileUpload";

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
  return (
    <div className="space-y-4">
      <Input
        placeholder="Nom"
        value={product.name}
        onChange={(e) => onProductChange('name', e.target.value)}
      />
      <Input
        placeholder="Prix"
        value={product.price}
        onChange={(e) => onProductChange('price', e.target.value)}
      />
      <Input
        placeholder="Catégorie"
        value={product.category}
        onChange={(e) => onProductChange('category', e.target.value)}
      />
      <Input
        placeholder="Lien de paiement"
        value={product.payment_link}
        onChange={(e) => onProductChange('payment_link', e.target.value)}
      />
      <Textarea
        placeholder="Description"
        value={product.description || ''}
        onChange={(e) => onProductChange('description', e.target.value)}
      />
      <Input
        type="file"
        accept="image/*"
        onChange={async (e) => {
          if (e.target.files?.[0]) {
            try {
              const url = await handleImageUpload(e.target.files[0]);
              onProductChange('image', url);
            } catch (error) {
              console.error('Error uploading image:', error);
            }
          }
        }}
      />
      <Button onClick={onSubmit}>{submitLabel}</Button>
    </div>
  );
};

export default ProductForm;