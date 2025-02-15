
import React from 'react';
import { Button } from "@/components/ui/button";
import PromoCodeInput from '@/components/marketing/PromoCodeInput';

interface Product {
  id: string;
  name: string;
  price: string;
}

interface OrderSummaryProps {
  product?: Product;
  onSaveCart: () => void;
  onOrder: () => void;
  onPromoCodeApply: (promoCode: any) => void;
}

const OrderSummary = ({ product, onSaveCart, onOrder, onPromoCodeApply }: OrderSummaryProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Récapitulatif de la commande</h2>
      </div>
      
      {product && (
        <div className="border-b pb-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.price}</p>
            </div>
            <Button
              variant="outline"
              onClick={onSaveCart}
              className="ml-4"
            >
              Sauvegarder pour plus tard
            </Button>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">Code Promo</h3>
        <PromoCodeInput onApply={onPromoCodeApply} />
      </div>

      <Button 
        onClick={onOrder}
        className="w-full lg:w-auto text-lg py-6 bg-primary hover:bg-primary/90"
      >
        Commander Maintenant
      </Button>
    </div>
  );
};

export default OrderSummary;
