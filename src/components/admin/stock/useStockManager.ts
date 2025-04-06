
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  stock_quantity: number;
  stock_alert_threshold: number;
  price: string;
  purchase_price: number;
  is_physical: boolean;
}

export const useStockManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch products on component mount and setup realtime subscription
  useEffect(() => {
    fetchProducts();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Fetch all products from the database
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      // Filter to only include physical products and ensure all required fields
      const physicalProducts = data
        .filter(product => product.is_physical)
        .map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          is_physical: product.is_physical,
          stock_quantity: product.stock_quantity || 0,
          stock_alert_threshold: product.stock_alert_threshold || 5,
          purchase_price: product.purchase_price || 0
        }));
      
      setProducts(physicalProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les produits",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update stock quantity for a product
  const updateStock = async (productId: string, newQuantity: number, notes?: string) => {
    try {
      // Get current quantity first
      const { data: currentProduct, error: fetchError } = await supabase
        .from('products')
        .select('stock_quantity')
        .eq('id', productId)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }

      const previousQuantity = currentProduct.stock_quantity || 0;
      
      // Update product stock
      const { error: updateError } = await supabase
        .from('products')
        .update({ stock_quantity: newQuantity })
        .eq('id', productId);
      
      if (updateError) {
        throw updateError;
      }

      // Record in stock history
      const { error: historyError } = await supabase
        .from('stock_history')
        .insert({
          product_id: productId,
          previous_quantity: previousQuantity,
          new_quantity: newQuantity,
          change_type: newQuantity > previousQuantity ? 'increase' : 'decrease',
          notes: notes || `Stock modifié de ${previousQuantity} à ${newQuantity}`,
          created_by: (await supabase.auth.getSession()).data.session?.user.id
        });
      
      if (historyError) {
        throw historyError;
      }

      toast({
        title: "Succès",
        description: "Stock mis à jour avec succès",
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le stock",
      });
    }
  };

  // Update stock alert threshold
  const updateStockAlert = async (productId: string, threshold: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ stock_alert_threshold: threshold })
        .eq('id', productId);
      
      if (error) {
        throw error;
      }

      toast({
        title: "Succès",
        description: "Seuil d'alerte mis à jour",
      });
    } catch (error) {
      console.error('Error updating stock alert:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le seuil d'alerte",
      });
    }
  };

  // Update purchase price
  const updatePurchasePrice = async (productId: string, purchasePrice: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ purchase_price: purchasePrice })
        .eq('id', productId);
      
      if (error) {
        throw error;
      }

      toast({
        title: "Succès",
        description: "Prix d'achat mis à jour",
      });
    } catch (error) {
      console.error('Error updating purchase price:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le prix d'achat",
      });
    }
  };

  // Get products with low stock
  const getProductsWithLowStock = () => {
    return products.filter(
      product => product.stock_quantity <= product.stock_alert_threshold
    );
  };

  return {
    products,
    isLoading,
    updateStock,
    updateStockAlert,
    updatePurchasePrice,
    getProductsWithLowStock
  };
};

export type { Product };
