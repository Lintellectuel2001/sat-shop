
import React, { useState } from 'react';
import { Order } from '@/hooks/useOrderManagement';
import OrderTrackingForm from '@/components/cart/OrderTrackingForm';
import OrderDetails from '@/components/cart/OrderDetails';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const OrderTracking = () => {
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);

  const handleOrderFound = (order: Order) => {
    setFoundOrder(order);
  };

  const handleBackToSearch = () => {
    setFoundOrder(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 to-accent/5 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Suivi de commande</h1>
          <p className="text-muted-foreground">
            Entrez votre numéro de suivi pour voir l'état de votre commande
          </p>
        </div>

        {!foundOrder ? (
          <OrderTrackingForm onOrderFound={handleOrderFound} />
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <Button
                variant="outline"
                onClick={handleBackToSearch}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Nouvelle recherche
              </Button>
            </div>
            <OrderDetails order={foundOrder} />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
