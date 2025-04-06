
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package } from "lucide-react";
import InventoryTab from './InventoryTab';
import HistoryTab from './HistoryTab';
import AlertsTab from './AlertsTab';
import { useStockManager } from './useStockManager';

const StockManager = () => {
  const {
    products,
    isLoading,
    updateStock,
    updateStockAlert,
    updatePurchasePrice,
    getProductsWithLowStock
  } = useStockManager();

  const productsWithLowStock = getProductsWithLowStock();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Gestion des Stocks</h2>
      </div>
      
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="inventory">Inventaire</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="alerts" className="relative">
            Alertes
            {productsWithLowStock.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {productsWithLowStock.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory">
          <InventoryTab 
            products={products} 
            isLoading={isLoading} 
            onUpdateStock={updateStock}
            onUpdateStockAlert={updateStockAlert}
            onUpdatePurchasePrice={updatePurchasePrice}
          />
        </TabsContent>
        
        <TabsContent value="history">
          <HistoryTab />
        </TabsContent>
        
        <TabsContent value="alerts">
          <AlertsTab 
            products={products} 
            onUpdateStock={updateStock} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StockManager;
