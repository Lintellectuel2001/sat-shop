
import { useEffect, useState } from "react";
import ProductCard from "../ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Removed useSearchParams import as it will be handled differently

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  // Function to extract search query from URL when in a router context
  useEffect(() => {
    // Use window.location to get search parameters without react-router
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let query = supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        // Si une recherche est active, filtrer les produits
        if (searchQuery) {
          query = query.ilike('name', `%${searchQuery}%`);
        }

        // Toujours récupérer tous les produits
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

    // Abonnement aux mises à jour en temps réel
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
  }, [toast, searchQuery]);

  if (products.length === 0 && searchQuery) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Nos Services</h2>
          <p className="text-center text-gray-500">
            Aucun produit trouvé pour "{searchQuery}"
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 px-4">Nos Services</h2>
        {searchQuery && (
          <p className="px-4 mb-4 text-gray-600">
            Résultats pour "{searchQuery}"
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
