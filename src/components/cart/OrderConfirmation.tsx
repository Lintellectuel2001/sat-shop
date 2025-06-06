
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Copy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';

interface OrderConfirmationProps {
  orderToken: string;
  customerEmail?: string;
  isGuest: boolean;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ 
  orderToken, 
  customerEmail, 
  isGuest 
}) => {
  const { toast } = useToast();

  const copyToken = () => {
    navigator.clipboard.writeText(orderToken);
    toast({
      title: "Copié !",
      description: "Le numéro de commande a été copié dans le presse-papiers",
    });
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle className="text-green-600">Commande confirmée !</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Numéro de commande :</p>
          <div className="flex items-center justify-between">
            <span className="font-mono text-lg font-bold">{orderToken}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToken}
              className="ml-2"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {isGuest && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Important :</strong> Conservez ce numéro de commande pour suivre votre livraison.
              {customerEmail && ` Un email de confirmation a été envoyé à ${customerEmail}.`}
            </p>
          </div>
        )}
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Votre commande est en cours de traitement. 
            Vous recevrez bientôt une confirmation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderConfirmation;
