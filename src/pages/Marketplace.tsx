import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader';
import FilterBar from '@/components/marketplace/FilterBar';
import ProductGrid from '@/components/marketplace/ProductGrid';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [category, setCategory] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let query = supabase
          .from('products')
          .select('*');

        // Appliquer le filtre par catégorie
        if (category !== "all") {
          query = query.eq('category', category);
        }

        // Appliquer le tri
        switch (sortOrder) {
          case "newest":
            query = query.order('created_at', { ascending: false });
            break;
          case "price-asc":
            query = query.order('price');
            break;
          case "price-desc":
            query = query.order('price', { ascending: false });
            break;
          case "rating":
            query = query.order('rating', { ascending: false });
            break;
          default:
            query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query;

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

    fetchProducts();
  }, [category, sortOrder, toast]);

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-16">
        <MarketplaceHeader />
        <FilterBar 
          productsCount={products.length}
          category={category}
          setCategory={setCategory}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
        <ProductGrid products={products} />
      </main>
    </div>
  );
};

export default Marketplace;