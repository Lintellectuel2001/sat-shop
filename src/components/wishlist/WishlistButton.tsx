
import React, { useState, useEffect } from 'react';
import { Heart, HeartOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

const WishlistButton = ({ productId, className = '' }: WishlistButtonProps) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkWishlistStatus();
  }, [productId]);

  const checkWishlistStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('wishlists')
        .select('id')
        .eq('product_id', productId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking wishlist status:', error);
        setLoading(false);
        return;
      }

      setIsInWishlist(!!data);
      setLoading(false);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      setLoading(false);
    }
  };

  const toggleWishlist = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour gérer votre liste de souhaits",
          variant: "destructive",
        });
        return;
      }

      if (isInWishlist) {
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('product_id', productId)
          .eq('user_id', user.id);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Produit retiré de votre liste de souhaits",
        });
      } else {
        const { error } = await supabase
          .from('wishlists')
          .insert([
            { product_id: productId, user_id: user.id }
          ]);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Produit ajouté à votre liste de souhaits",
        });
      }

      setIsInWishlist(!isInWishlist);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  if (loading) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      className={className}
      onClick={toggleWishlist}
    >
      {isInWishlist ? (
        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
      ) : (
        <HeartOff className="h-4 w-4" />
      )}
    </Button>
  );
};

export default WishlistButton;
