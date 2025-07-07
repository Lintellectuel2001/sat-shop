
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import ShareButtons from "../components/product/ShareButtons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: string;
  description?: string;
  image: string;
  category: string;
  features?: string[];
  payment_link: string;
  rating?: number;
  reviews?: number;
  is_available?: boolean;
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les détails du produit",
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate, toast]);

  const handleOrder = async () => {
    if (!product) return;
    
    if (product.is_available === false) {
      toast({
        variant: "destructive",
        title: "Article non disponible",
        description: "Cet article n'est actuellement pas disponible pour commande.",
      });
      return;
    }
    
    setOrderLoading(true);
    
    try {
      // Create a new order in the orders table
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          product_id: product.id,
          product_name: product.name,
          amount: product.price,
          status: 'pending'
        }])
        .select()
        .single();
      
      if (orderError) throw orderError;

      // Record the purchase action in cart_history
      await supabase.from('cart_history').insert({
        product_id: product.id,
        action_type: 'purchase',
        payment_status: 'initiated',
      });

      console.log('Order action recorded in statistics');
      
      // Send notification email in the background without waiting for result
      supabase.functions.invoke('send-order-notification', {
        body: {
          orderId: orderData.id,
          customerName: orderData.customer_name || 'Client anonyme',
          customerEmail: orderData.customer_email || orderData.guest_email || 'Non fourni',
          customerPhone: orderData.guest_phone || 'Non fourni',
          productName: product.name,
          productPrice: product.price
        },
      }).catch((error) => {
        console.error('Error sending notification:', error);
      });
      
      // Immediately redirect to payment link
      window.location.href = product.payment_link;
    } catch (error) {
      console.error('Error recording order action:', error);
      setOrderLoading(false);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Un problème est survenu lors de la commande",
      });
      
      // Still redirect to payment link even if tracking fails
      window.location.href = product.payment_link;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32">
          Chargement...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32">
          Produit non trouvé
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-white p-8">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold">{product.name}</h1>
            <p className="text-2xl font-semibold text-primary">{product.price}</p>
            
            {product.is_available === false && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Cet article n'est actuellement pas disponible (stock épuisé ou désactivé).
                </AlertDescription>
              </Alert>
            )}
            
            {product.description && (
              <div className="prose max-w-none">
                <p className="text-lg text-accent whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {product.features && product.features.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Caractéristiques :</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-primary">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button 
              onClick={handleOrder}
              className="w-full lg:w-auto text-lg py-6"
              disabled={orderLoading || product.is_available === false}
            >
              {orderLoading ? 'Redirection...' : 
               product.is_available === false ? 'Article non disponible' : 
               'Commander Maintenant'}
            </Button>

            <div className="bg-muted p-4 rounded-lg mt-8">
              <h3 className="font-semibold mb-2">Paiement sécurisé</h3>
              <p className="text-sm text-accent">
                Paiement sécurisé via Chargily. Livraison immédiate après confirmation du paiement.
              </p>
            </div>
            
            {/* Ajout des boutons de partage social */}
            <div className="mt-8 border-t pt-6">
              <ShareButtons productName={product.name} productId={product.id} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
