
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

interface Order {
  id: string;
  order_token: string;
  product_name: string;
  amount: string;
  status: 'pending' | 'validated' | 'cancelled';
  customer_name?: string;
  customer_email?: string;
  guest_email?: string;
  guest_phone?: string;
  guest_address?: string;
  created_at: string;
  user_id?: string;
}

interface OrderDetailsProps {
  order: Order;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const isGuestOrder = !order.user_id;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'validated': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'validated': return 'Validée';
      case 'cancelled': return 'Annulée';
      default: return 'En attente';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Commande #{order.order_token}
          </CardTitle>
          <Badge className={getStatusColor(order.status)}>
            {getStatusText(order.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Détails de la commande</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-500" />
                <span>{order.product_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Montant:</span>
                <span className="font-semibold">{order.amount}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">
              {isGuestOrder ? 'Informations client (invité)' : 'Informations client'}
            </h4>
            <div className="space-y-2 text-sm">
              {(order.customer_name || order.guest_email) && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>{order.customer_name || 'Client invité'}</span>
                </div>
              )}
              
              {(order.customer_email || order.guest_email) && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{order.customer_email || order.guest_email}</span>
                </div>
              )}
              
              {order.guest_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{order.guest_phone}</span>
                </div>
              )}
              
              {order.guest_address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{order.guest_address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {isGuestOrder && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-700">
              Cette commande a été passée en tant qu'invité. 
              Conservez le numéro de commande pour le suivi.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderDetails;
