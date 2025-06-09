
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from 'lucide-react';

interface OrderTrackingFormProps {
  onSearch: (token: string, email?: string) => void;
  isLoading: boolean;
}

const OrderTrackingForm: React.FC<OrderTrackingFormProps> = ({ onSearch, isLoading }) => {
  const [orderToken, setOrderToken] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderToken.trim()) {
      onSearch(orderToken.trim(), email.trim() || undefined);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Suivre ma commande
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="orderToken">Numéro de commande *</Label>
            <Input
              id="orderToken"
              type="text"
              value={orderToken}
              onChange={(e) => setOrderToken(e.target.value.toUpperCase())}
              placeholder="Ex: ABC12345"
              required
              className="uppercase"
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email (optionnel)</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              Pour les commandes invités, l'email aide à la vérification
            </p>
          </div>
          
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Recherche...' : 'Rechercher ma commande'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default OrderTrackingForm;
