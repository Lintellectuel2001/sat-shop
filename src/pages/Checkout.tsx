
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthState } from '@/hooks/useAuthState';
import { useOrderManagement } from '@/hooks/useOrderManagement';
import GuestOrderForm from '@/components/cart/GuestOrderForm';
import OrderConfirmation from '@/components/cart/OrderConfirmation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthState();
  const { createOrder, isLoading } = useOrderManagement();
  
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);
  
  // Récupérer les paramètres du produit depuis l'URL
  const productId = searchParams.get('productId');
  const productName = searchParams.get('productName');
  const productPrice = searchParams.get('productPrice');

  if (!productId || !productName || !productPrice) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Erreur - Produit non spécifié
          </h1>
          <Button onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  const handleGuestOrder = async (guestInfo: any) => {
    try {
      const order = await createOrder({
        product_id: productId,
        product_name: productName,
        amount: productPrice,
        guest_info: guestInfo
      });
      
      setConfirmedOrder(order);
    } catch (error) {
      console.error('Erreur lors de la commande invité:', error);
    }
  };

  const handleRegisteredUserOrder = async () => {
    try {
      const order = await createOrder({
        product_id: productId,
        product_name: productName,
        amount: productPrice
      });
      
      setConfirmedOrder(order);
    } catch (error) {
      console.error('Erreur lors de la commande utilisateur connecté:', error);
    }
  };

  if (confirmedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <OrderConfirmation 
              orderToken={confirmedOrder.order_token}
              customerEmail={confirmedOrder.guest_email}
              isGuest={!confirmedOrder.user_id}
            />
            <div className="text-center mt-6">
              <Button 
                onClick={() => navigate(`/order-tracking?token=${confirmedOrder.order_token}`)}
                className="mr-4"
              >
                Suivre ma commande
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Retour à l'accueil
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Finaliser la commande
            </h1>
          </div>

          <div className="space-y-6">
            {/* Résumé du produit */}
            <Card>
              <CardHeader>
                <CardTitle>Résumé de la commande</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{productName}</h3>
                    <p className="text-sm text-gray-600">Quantité: 1</p>
                  </div>
                  <p className="text-lg font-bold">{productPrice}</p>
                </div>
              </CardContent>
            </Card>

            {/* Formulaire de commande */}
            {isLoggedIn ? (
              <Card>
                <CardHeader>
                  <CardTitle>Commande pour utilisateur connecté</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Vous êtes connecté. Votre commande sera associée à votre compte.
                  </p>
                  <Button 
                    onClick={handleRegisteredUserOrder}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? 'Commande en cours...' : 'Confirmer la commande'}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <GuestOrderForm 
                onSubmit={handleGuestOrder}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
