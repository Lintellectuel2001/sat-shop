
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { useOrderManagement, Order } from '@/hooks/useOrderManagement';

interface OrderTrackingFormProps {
  onOrderFound?: (order: Order) => void;
}

const OrderTrackingForm = ({ onOrderFound }: OrderTrackingFormProps) => {
  const [orderToken, setOrderToken] = useState('');
  const { getOrderByToken, isLoading } = useOrderManagement();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderToken.trim()) return;

    try {
      const order = await getOrderByToken(orderToken.trim());
      onOrderFound?.(order);
    } catch (error) {
      // L'erreur est déjà gérée dans le hook
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Suivre ma commande
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orderToken">Numéro de suivi</Label>
            <Input
              id="orderToken"
              value={orderToken}
              onChange={(e) => setOrderToken(e.target.value)}
              placeholder="Entrez votre numéro de suivi"
              className="font-mono"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || !orderToken.trim()}
          >
            {isLoading ? 'Recherche...' : 'Suivre la commande'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default OrderTrackingForm;
