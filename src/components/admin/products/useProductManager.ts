
import { useProductCreation } from './hooks/useProductCreation';
import { useProductUpdate } from './hooks/useProductUpdate';
import { useProductDeletion } from './hooks/useProductDeletion';
import { useProductAvailability } from './hooks/useProductAvailability';
import { useRealtimeProducts } from './hooks/useRealtimeProducts';
import type { Product } from './hooks/useProductTypes';

export const useProductManager = (onProductsChange: () => void) => {
  // Utiliser les hooks individuels
  const { 
    newProduct, 
    setNewProduct, 
    isDialogOpen, 
    setIsDialogOpen, 
    handleProductCreate 
  } = useProductCreation(onProductsChange);
  
  const { handleProductUpdate } = useProductUpdate();
  const { handleProductDelete } = useProductDeletion();
  const { handleToggleAvailability } = useProductAvailability();
  
  // Configurer le listener en temps réel
  useRealtimeProducts(onProductsChange);

  return {
    newProduct,
    setNewProduct,
    isDialogOpen,
    setIsDialogOpen,
    handleProductCreate,
    handleProductUpdate,
    handleProductDelete,
    handleToggleAvailability,
  };
};

// Exporter le type Product pour être utilisé par d'autres composants
export type { Product } from './hooks/useProductTypes';
