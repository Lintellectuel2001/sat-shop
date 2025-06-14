
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Order = Tables<'orders'>;

const OrderTracker = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const searchOrder = async () => {
    if (!searchQuery.trim()) {
      toast({
        variant: "destructive",
        title: "Recherche requise",
        description: "Veuillez entrer un email ou un token de commande",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Recherche par email ou token
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`customer_email.eq.${searchQuery},guest_email.eq.${searchQuery},order_token.eq.${searchQuery}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setOrder(data);
        toast({
          title: "Commande trouvée",
          description: "Voici les détails de votre commande",
        });
      } else {
        setOrder(null);
        toast({
          variant: "destructive",
          title: "Commande introuvable",
          description: "Aucune commande trouvée avec ces informations",
        });
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de rechercher la commande",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'validated':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'validated':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'validated':
        return 'Validée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Suivre ma commande
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="search">Email ou Token de commande</Label>
              <Input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="votre@email.com ou TOKEN123"
                onKeyDown={(e) => e.key === 'Enter' && searchOrder()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={searchOrder} disabled={isLoading}>
                {isLoading ? "Recherche..." : "Rechercher"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {order && (
        <Card>
          <CardHeader>
            <CardTitle>Détails de la commande</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{order.product_name}</h3>
                  <p className="text-2xl font-bold text-primary">{order.amount}</p>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(order.status)}
                    {getStatusText(order.status)}
                  </div>
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label>Client</Label>
                  <p className="font-medium">{order.customer_name || 'Client invité'}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="font-medium">{order.customer_email || order.guest_email}</p>
                </div>
                <div>
                  <Label>Date de commande</Label>
                  <p className="font-medium">
                    {new Date(order.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                {order.order_token && (
                  <div>
                    <Label>Token de suivi</Label>
                    <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                      {order.order_token}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrderTracker;
