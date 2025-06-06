
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrderManagement, OrderFormData } from '@/hooks/useOrderManagement';

interface GuestOrderFormProps {
  productId: string;
  productName: string;
  amount: string;
  onOrderCreated?: (orderToken: string) => void;
}

const GuestOrderForm = ({ productId, productName, amount, onOrderCreated }: GuestOrderFormProps) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
  });

  const { createOrder, isLoading } = useOrderManagement();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const orderData: OrderFormData = {
      productId,
      productName,
      amount,
      ...formData
    };

    try {
      const order = await createOrder(orderData, true);
      onOrderCreated?.(order.order_token);
    } catch (error) {
      // L'erreur est déjà gérée dans le hook
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Informations de commande</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Nom complet *</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerEmail">Email *</Label>
            <Input
              id="customerEmail"
              type="email"
              value={formData.customerEmail}
              onChange={(e) => handleInputChange('customerEmail', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerPhone">Téléphone</Label>
            <Input
              id="customerPhone"
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => handleInputChange('customerPhone', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerAddress">Adresse</Label>
            <Textarea
              id="customerAddress"
              value={formData.customerAddress}
              onChange={(e) => handleInputChange('customerAddress', e.target.value)}
              placeholder="Adresse complète pour la livraison"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || !formData.customerName || !formData.customerEmail}
          >
            {isLoading ? 'Création...' : 'Créer la commande'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GuestOrderForm;
