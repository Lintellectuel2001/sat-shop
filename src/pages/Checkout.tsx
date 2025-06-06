
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import GuestOrderForm from '@/components/cart/GuestOrderForm';
import OrderConfirmation from '@/components/cart/OrderConfirmation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Checkout = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orderConfirmation, setOrderConfirmation] = useState<{
    orderToken: string;
    productName: string;
    amount: string;
    customerName: string;
  } | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (error) {
        console.error('Erreur lors du chargement du produit:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Produit non trouvé",
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, navigate, toast]);

  const handleOrderCreated = (orderToken: string) => {
    setOrderConfirmation({
      orderToken,
      productName: product.name,
      amount: product.price,
      customerName: 'Client' // This will be updated with actual customer name
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/30 to-accent/5 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 to-accent/5 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Finaliser la commande</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Résumé du produit */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Produit sélectionné
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-2xl font-bold text-primary">
                      {product.price}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulaire de commande ou confirmation */}
          <div>
            {!orderConfirmation ? (
              <GuestOrderForm
                productId={product.id}
                productName={product.name}
                amount={product.price}
                onOrderCreated={handleOrderCreated}
              />
            ) : (
              <OrderConfirmation {...orderConfirmation} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
