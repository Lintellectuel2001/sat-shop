
import React from 'react';
import StockAlerts from './StockAlerts';
import { Product } from './useStockManager';

interface AlertsTabProps {
  products: Product[];
  onUpdateStock: (productId: string, newQuantity: number, notes?: string) => Promise<void>;
}

const AlertsTab: React.FC<AlertsTabProps> = ({ products, onUpdateStock }) => {
  // Filter products with low stock
  const productsWithLowStock = products.filter(
    product => product.stock_quantity <= product.stock_alert_threshold
  );

  return (
    <StockAlerts 
      products={productsWithLowStock} 
      onUpdateStock={onUpdateStock} 
    />
  );
};

export default AlertsTab;
