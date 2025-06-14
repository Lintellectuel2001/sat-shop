
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";

interface Order {
  id: string;
  product_name: string;
  amount: string;
  status: 'pending' | 'validated' | 'cancelled';
  created_at: string;
  order_token?: string;
}

const UserOrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useAuthState();
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchUserOrders();
    }
  }, [userId]);

  const fetchUserOrders = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger vos commandes",
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucune commande</h3>
          <p className="text-gray-600">
            Vous n'avez pas encore passé de commande.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <CardHeader className="px-0">
        <CardTitle>Mes commandes ({orders.length})</CardTitle>
      </CardHeader>
      
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
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
                <p className="text-sm text-gray-600">Date de commande</p>
                <p className="font-medium">
                  {new Date(order.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
              {order.order_token && (
                <div>
                  <p className="text-sm text-gray-600">Token de suivi</p>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {order.order_token}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserOrderHistory;
