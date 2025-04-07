
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
  payment_link: string;
  is_available?: boolean;
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
    handleToggleAvailability,
  } = useProductManager(onProductsChange);

  const handleCreateSuccess = async () => {
    await handleProductCreate();
    onProductsChange(); // Appeler explicitement onProductsChange après la création
  };

  // S'assurer que la catégorie par défaut est toujours définie
  React.useEffect(() => {
    if (!newProduct.category) {
      setNewProduct(prev => ({ ...prev, category: "iptv" }));
    }
  }, [newProduct.category, setNewProduct]);

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
        onToggleAvailability={handleToggleAvailability}
      />
    </div>
  );
};

export default ProductManager;
