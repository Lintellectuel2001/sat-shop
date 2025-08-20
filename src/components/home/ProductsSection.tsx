
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "../ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, Sparkles } from "lucide-react";

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

  // Animation variants pour Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  if (products.length === 0 && searchQuery) {
    return (
      <section className="section-spacing bg-background">
        <div className="container-modern">
          <motion.div 
            className="text-center max-w-2xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={headerVariants}
          >
            <div className="flex items-center justify-center mb-6">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-foreground">Aucun résultat trouvé</h2>
            <p className="text-muted-foreground text-lg">
              Aucun produit ne correspond à votre recherche "{searchQuery}". 
              Essayez avec d'autres mots-clés.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-spacing bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-secondary/10 pointer-events-none" />
      
      <div className="container-modern relative">
        {/* Modern Header */}
        <motion.div 
          className="text-center max-w-4xl mx-auto mb-16"
          initial="hidden"
          animate="visible"
          variants={headerVariants}
        >
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-8 w-8 text-accent mr-3" />
            <span className="text-sm font-medium text-accent uppercase tracking-wider">
              Découvrez nos services
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Nos <span className="gradient-text">Services Premium</span>
          </h2>
          
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Une sélection rigoureusement choisie de services de qualité supérieure, 
            conçus pour répondre à tous vos besoins avec excellence.
          </p>
          
          {searchQuery && (
            <motion.div 
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-accent/10 border border-accent/20 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Search className="h-4 w-4 text-accent" />
              <span className="text-accent font-medium">
                Résultats pour "{searchQuery}"
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Products Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
              }}
              className="group"
            >
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                rating={product.rating || 5}
                reviews={product.reviews || 0}
                paymentLink={product.payment_link}
                isAvailable={product.is_available !== false}
                category={product.category?.toUpperCase()}
                isPhysical={product.is_physical}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        {products.length > 0 && !searchQuery && (
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <p className="text-muted-foreground mb-6">
              Vous ne trouvez pas ce que vous cherchez ?
            </p>
            <button className="btn-modern group">
              Voir tous nos services
              <motion.span 
                className="ml-2 inline-block"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                →
              </motion.span>
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
