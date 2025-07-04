import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Home, Download, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        // Récupérer les détails de la commande
        const { data: order, error } = await supabase
          .from('orders')
          .select(`
            *,
            products (
              name,
              download_info,
              image
            )
          `)
          .eq('payment_id', sessionId)
          .single();

        if (error) {
          console.error('Error fetching order:', error);
          throw error;
        }

        setOrderData(order);
        
        if (order) {
          toast({
            title: "Paiement confirmé!",
            description: "Votre commande a été traitée avec succès.",
          });
        }
      } catch (error: any) {
        console.error('Error:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de récupérer les détails de votre commande.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [sessionId, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Vérification de votre paiement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-700">
            Paiement Confirmé!
          </CardTitle>
          <p className="text-muted-foreground">
            Merci pour votre achat. Votre commande a été traitée avec succès.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {orderData && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Détails de la commande</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Commande ID:</span>
                  <span className="font-mono">{orderData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Produit:</span>
                  <span>{orderData.product_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Montant:</span>
                  <span className="font-semibold">{orderData.amount} DZD</span>
                </div>
                <div className="flex justify-between">
                  <span>Client:</span>
                  <span>{orderData.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span>{orderData.customer_email}</span>
                </div>
                <div className="flex justify-between">
                  <span>Statut:</span>
                  <span className="text-green-600 font-semibold">Confirmé</span>
                </div>
              </div>
            </div>
          )}

          {orderData?.products?.download_info && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Informations de téléchargement
              </h3>
              <div className="text-sm text-blue-700">
                <p>Vos informations de téléchargement ont été envoyées par email.</p>
                <p className="mt-2">
                  Si vous ne recevez pas l'email dans les prochaines minutes, 
                  vérifiez votre dossier spam ou contactez-nous.
                </p>
              </div>
            </div>
          )}

          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2 flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              Email de confirmation
            </h3>
            <p className="text-sm text-yellow-700">
              Un email de confirmation avec tous les détails a été envoyé à votre adresse email.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={() => navigate('/')}
              className="flex-1"
            >
              <Home className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/orders')}
              className="flex-1"
            >
              Mes commandes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;