
import React from 'react';
import ProductHeader from './products/ProductHeader';
import ProductGrid from './products/ProductGrid';
import { useProductManager } from './products/useProductManager';

interface Product {
  id: string;
  name: string;
  price: string;
  description?: string;
  image: string;
  category: string;
  features?: string[];
}

interface ProductManagerProps {
  products: Product[];
  onProductsChange: () => void;
}

const ProductManager = ({ products, onProductsChange }: ProductManagerProps) => {
  const {
    newProduct,
    setNewProduct,
    isDialogOpen,
    setIsDialogOpen,
    handleProductCreate,
    handleProductUpdate,
    handleProductDelete,
  } = useProductManager(onProductsChange);

  const handleCreateSuccess = async () => {
    await handleProductCreate();
    onProductsChange();
  };

  return (
    <div className="space-y-6">
      <ProductHeader
        productsCount={products.length}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        newProduct={newProduct}
        onProductChange={(field, value) => 
          setNewProduct({ ...newProduct, [field]: value })
        }
        onSubmit={handleCreateSuccess}
      />
      <ProductGrid
        products={products}
        onEdit={handleProductUpdate}
        onDelete={handleProductDelete}
      />
    </div>
  );
};

export default ProductManager;
