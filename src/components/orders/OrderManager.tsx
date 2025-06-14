
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthState } from "@/hooks/useAuthState";
import OrderTracker from './OrderTracker';
import UserOrderHistory from './UserOrderHistory';
import GuestOrderForm from './GuestOrderForm';

interface OrderManagerProps {
  productName?: string;
  productPrice?: string;
  showOrderForm?: boolean;
  onGuestOrder?: (guestInfo: any) => void;
}

const OrderManager = ({ 
  productName, 
  productPrice, 
  showOrderForm = false,
  onGuestOrder 
}: OrderManagerProps) => {
  const { isLoggedIn } = useAuthState();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gestion des commandes</h1>
      
      <Tabs defaultValue={showOrderForm ? "order" : "track"} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="track">Suivre</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          {showOrderForm && (
            <TabsTrigger value="order">Commander</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="track" className="mt-6">
          <OrderTracker />
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          {isLoggedIn ? (
            <UserOrderHistory />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Connectez-vous pour voir votre historique de commandes
              </p>
            </div>
          )}
        </TabsContent>
        
        {showOrderForm && (
          <TabsContent value="order" className="mt-6">
            {!isLoggedIn && productName && productPrice ? (
              <GuestOrderForm
                productName={productName}
                productPrice={productPrice}
                onSubmit={onGuestOrder || (() => {})}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  Formulaire de commande disponible pour les invités
                </p>
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default OrderManager;
