
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface StockHistoryEntry {
  id: string;
  product_id: string;
  product_name: string;
  previous_quantity: number;
  new_quantity: number;
  change_type: string;
  notes: string;
  created_at: string;
  created_by: string;
}

interface ProductData {
  id: string;
  name: string;
}

export const useStockHistory = () => {
  const [history, setHistory] = useState<StockHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [selectedProduct, startDate, endDate]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name')
        .eq('is_physical', true)
        .order('name');
      
      if (error) {
        throw error;
      }
      
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les produits",
      });
    }
  };

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      
      // Use RPC function to get stock history
      let { data: historyData, error: historyError } = await supabase.rpc('get_stock_history');
      
      if (historyError) {
        console.error('Error fetching stock history:', historyError);
        setHistory([]);
        setIsLoading(false);
        return;
      }
      
      // Apply filters on the data we received
      let filteredHistory = historyData || [];
      
      if (selectedProduct) {
        filteredHistory = filteredHistory.filter(entry => entry.product_id === selectedProduct);
      }
      
      if (startDate) {
        filteredHistory = filteredHistory.filter(entry => 
          new Date(entry.created_at) >= startDate
        );
      }
      
      if (endDate) {
        const nextDay = new Date(endDate);
        nextDay.setDate(nextDay.getDate() + 1);
        filteredHistory = filteredHistory.filter(entry => 
          new Date(entry.created_at) < nextDay
        );
      }
      
      setHistory(filteredHistory as StockHistoryEntry[]);
    } catch (error) {
      console.error('Error fetching stock history:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger l'historique",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetFilters = () => {
    setSelectedProduct(null);
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return {
    history,
    isLoading,
    products,
    selectedProduct,
    setSelectedProduct,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    resetFilters
  };
};
