
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  price: string;
  description?: string;
  image: string;
  category: string;
  features?: string[];
  payment_link?: string;
  rating?: number;
  reviews?: number;
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

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

        console.log("Fetched product:", data);
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
    if (!product) {
      console.error("No product data available");
      return;
    }
    
    try {
      setProcessingPayment(true);
      console.log("Starting payment process for:", product);

      // Si le produit a déjà un lien de paiement Chargily, l'utiliser directement
      if (product.payment_link) {
        console.log("Using existing payment link:", product.payment_link);
        window.location.href = product.payment_link;
        return;
      }
      
      // Convertir le prix en nombre en enlevant "DZD" et les espaces
      const priceString = product.price.replace(/[^0-9]/g, '');
      const amount = parseInt(priceString);
      
      console.log("Processing payment with amount:", {
        originalPrice: product.price,
        cleanedPrice: priceString,
        amount: amount
      });
      
      if (isNaN(amount)) {
        throw new Error('Prix invalide');
      }

      // Enregistrer d'abord la tentative d'achat avec le statut initial
      const { data: cartEntry, error: cartError } = await supabase
        .from('cart_history')
        .insert([{
          action_type: 'purchase_initiated',
          product_id: product.id,
          payment_status: 'pending'
        }])
        .select()
        .single();

      if (cartError) {
        console.error("Error recording purchase attempt:", cartError);
        throw cartError;
      }

      console.log("Created cart entry:", cartEntry);

      // Générer correctement l'URL Chargily Pay
      const chargilyBaseUrl = "https://pay.chargily.net/checkout";
      const paymentUrl = `${chargilyBaseUrl}?amount=${amount}&client_name=Customer&back_url=${encodeURIComponent(window.location.origin)}&webhook_url=${encodeURIComponent(window.location.origin + '/api/webhook')}&mode=CIB&comment=${encodeURIComponent(product.name)}`;
      
      console.log("Generated payment URL:", paymentUrl);
      
      // Mettre à jour le produit avec le lien de paiement
      await supabase
        .from('products')
        .update({ payment_link: paymentUrl })
        .eq('id', product.id);
        
      // Mettre à jour le statut de l'entrée du panier
      await supabase
        .from('cart_history')
        .update({ 
          payment_status: 'direct_checkout_created',
        })
        .eq('id', cartEntry.id);
        
      // Rediriger vers le lien de paiement
      window.location.href = paymentUrl;

    } catch (error) {
      console.error('Error processing order:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement de la commande. Veuillez réessayer."
      });
    } finally {
      setProcessingPayment(false);
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
              disabled={processingPayment}
            >
              {processingPayment ? 'Traitement en cours...' : 'Commander Maintenant'}
            </Button>

            <div className="bg-muted p-4 rounded-lg mt-8">
              <h3 className="font-semibold mb-2">Paiement sécurisé</h3>
              <p className="text-sm text-accent">
                Paiement sécurisé via Chargily. Livraison immédiate après confirmation du paiement.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
