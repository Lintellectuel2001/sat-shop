
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface OrderConfirmationProps {
  orderToken: string;
  productName: string;
  amount: string;
  customerName: string;
}

const OrderConfirmation = ({ orderToken, productName, amount, customerName }: OrderConfirmationProps) => {
  const { toast } = useToast();

  const copyOrderToken = () => {
    navigator.clipboard.writeText(orderToken);
    toast({
      title: "Token copié",
      description: "Le numéro de suivi a été copié dans le presse-papier",
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <CardTitle className="text-green-600">Commande confirmée !</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Numéro de suivi :</p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="text-lg font-mono">
              {orderToken}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyOrderToken}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Client :</span>
            <span className="text-sm font-medium">{customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Produit :</span>
            <span className="text-sm font-medium">{productName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Montant :</span>
            <span className="text-sm font-medium">{amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Statut :</span>
            <Badge variant="secondary">En attente</Badge>
          </div>
        </div>

        <div className="text-center pt-4 border-t">
          <p className="text-xs text-gray-500">
            Conservez ce numéro de suivi pour suivre votre commande
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderConfirmation;
