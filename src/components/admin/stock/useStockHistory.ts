
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
      
      let query = supabase
        .from('stock_history')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (selectedProduct) {
        query = query.eq('product_id', selectedProduct);
      }
      
      if (startDate) {
        query = query.gte('created_at', startDate.toISOString());
      }
      
      if (endDate) {
        const nextDay = new Date(endDate);
        nextDay.setDate(nextDay.getDate() + 1);
        query = query.lt('created_at', nextDay.toISOString());
      }
      
      const { data: historyData, error: historyError } = await query;
      
      if (historyError) {
        console.error('Error fetching stock history:', historyError);
        setHistory([]);
        setIsLoading(false);
        return;
      }

      const enhancedHistory: StockHistoryEntry[] = [];
      
      for (const entry of historyData || []) {
        try {
          const { data: productData, error: productError } = await supabase
            .from('products')
            .select('name')
            .eq('id', entry.product_id)
            .single();
          
          enhancedHistory.push({
            ...entry,
            product_name: productError ? 'Produit inconnu' : productData.name
          } as StockHistoryEntry);
        } catch (e) {
          console.error('Error fetching product details:', e);
          enhancedHistory.push({
            ...entry,
            product_name: 'Produit inconnu'
          } as StockHistoryEntry);
        }
      }
      
      setHistory(enhancedHistory);
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
