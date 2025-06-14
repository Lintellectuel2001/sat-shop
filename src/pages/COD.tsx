
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "../components/Navbar";
import CODProductGrid from "../components/cod/CODProductGrid";
import CODHeader from "../components/cod/CODHeader";

interface Product {
  id: string;
  name: string;
  price: string;
  description?: string;
  image: string;
  category: string;
  rating?: number;
  reviews?: number;
  is_available?: boolean;
  is_physical?: boolean;
}

const COD = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    // Vérifier s'il y a un produit sélectionné passé via navigation
    if (location.state?.selectedProduct) {
      setSelectedProduct(location.state.selectedProduct);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchPhysicalProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_physical', true)
          .eq('is_available', true)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching physical products:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les produits physiques",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPhysicalProducts();

    // Abonnement aux mises à jour en temps réel
    const channel = supabase
      .channel('physical-products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
          filter: 'is_physical=eq.true'
        },
        () => {
          fetchPhysicalProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-16">
        <CODHeader />
        <CODProductGrid 
          products={products} 
          isLoading={loading} 
          preselectedProduct={selectedProduct}
        />
      </main>
    </div>
  );
};

export default COD;
