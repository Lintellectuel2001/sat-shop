import { useEffect, useState } from "react";
import ProductCard from "../ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

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
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              rating={product.rating || 5}
              reviews={product.reviews || 0}
              paymentLink={product.payment_link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;