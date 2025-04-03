
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from "../components/Navbar";
import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader';
import FilterBar from '@/components/marketplace/FilterBar';
import ProductGrid from '@/components/marketplace/ProductGrid';
import CategoryNav from "@/components/CategoryNav";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [category, setCategory] = useState("all");
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize category from URL parameter if available
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let query = supabase
          .from('products')
          .select('*');

        // Apply category filter
        if (category !== "all") {
          query = query.eq('category', category);
        }

        // Apply sorting
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

        // Log for debugging
        console.log('Fetched products:', data);
        console.log('Current category:', category);
        
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

  // Handle category change and update URL
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    
    // Update URL with the new category
    if (newCategory === "all") {
      setSearchParams(params => {
        params.delete('category');
        return params;
      });
    } else {
      setSearchParams(params => {
        params.set('category', newCategory);
        return params;
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-16">
        <MarketplaceHeader />
        <div className="mb-8">
          <CategoryNav initialCategory={category} onCategoryChange={handleCategoryChange} />
        </div>
        <FilterBar 
          productsCount={products.length}
          category={category}
          setCategory={handleCategoryChange}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
        <ProductGrid products={products} />
      </main>
    </div>
  );
};

export default Marketplace;
