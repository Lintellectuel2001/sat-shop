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
  payment_link: string;
  rating?: number;
  reviews?: number;
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleOrder = () => {
    if (!product) return;

    // Redirect immediately to payment link
    window.location.href = product.payment_link;

    // Send notification email in the background
    supabase.functions.invoke('send-order-notification', {
      body: {
        productName: product.name,
        productPrice: product.price,
      },
    }).catch((error) => {
      console.error('Error sending notification:', error);
    });
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
            >
              Commander Maintenant
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