
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import OrderTrackingForm from '@/components/cart/OrderTrackingForm';
import OrderDetails from '@/components/cart/OrderDetails';
import { useOrderManagement } from '@/hooks/useOrderManagement';
import { useEffect } from 'react';

const OrderTracking = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<any>(null);
  const { trackOrder, isLoading } = useOrderManagement();

  // Récupérer le token depuis l'URL si présent
  const tokenFromUrl = searchParams.get('token');

  useEffect(() => {
    if (tokenFromUrl) {
      handleSearch(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  const handleSearch = async (token: string, email?: string) => {
    const foundOrder = await trackOrder(token, email);
    setOrder(foundOrder);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Suivi de commande
            </h1>
            <p className="text-gray-600">
              Entrez votre numéro de commande pour suivre votre livraison
            </p>
          </div>

          <div className="space-y-8">
            <OrderTrackingForm onSearch={handleSearch} isLoading={isLoading} />
            
            {order && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-center">
                  Détails de votre commande
                </h2>
                <OrderDetails order={order} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
