
import React from 'react';
import StockTable from './StockTable';
import { Product } from './useStockManager';

interface InventoryTabProps {
  products: Product[];
  isLoading: boolean;
  onUpdateStock: (productId: string, newQuantity: number, notes?: string) => Promise<void>;
  onUpdateStockAlert: (productId: string, threshold: number) => Promise<void>;
  onUpdatePurchasePrice: (productId: string, purchasePrice: number) => Promise<void>;
}

const InventoryTab: React.FC<InventoryTabProps> = ({ 
  products, 
  isLoading, 
  onUpdateStock, 
  onUpdateStockAlert, 
  onUpdatePurchasePrice 
}) => {
  return (
    <StockTable 
      products={products} 
      isLoading={isLoading} 
      onUpdateStock={onUpdateStock}
      onUpdateStockAlert={onUpdateStockAlert}
      onUpdatePurchasePrice={onUpdatePurchasePrice}
    />
  );
};

export default InventoryTab;
