
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: string;
    image: string;
    description?: string;
  };
}

const Wishlist = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          id,
          product:products (
            id,
            name,
            price,
            image,
            description
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      setItems(data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger votre liste de souhaits",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (wishlistId: string) => {
    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('id', wishlistId);

      if (error) throw error;

      setItems(items.filter(item => item.id !== wishlistId));
      
      toast({
        title: "Succès",
        description: "Produit retiré de votre liste de souhaits",
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer le produit",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-16">
        <h1 className="text-3xl font-bold mb-8">Ma Liste de Souhaits</h1>
        
        {loading ? (
          <div>Chargement...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Votre liste de souhaits est vide</p>
            <Button onClick={() => navigate('/marketplace')}>
              Découvrir nos produits
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full aspect-video object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{item.product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {item.product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-primary">{item.product.price}</span>
                    <div className="space-x-2">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => navigate(`/product/${item.product.id}`)}
                      >
                        Voir détails
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;
