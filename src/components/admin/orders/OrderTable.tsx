
import React from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Order } from '../products/hooks/useProductTypes';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface OrderTableProps {
  orders: Order[];
  isLoading: boolean;
  onStatusChange: (orderId: string, status: 'validated' | 'cancelled') => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, isLoading, onStatusChange }) => {
  if (isLoading) {
    return (
      <div className="rounded-md border p-4">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <h3 className="font-medium text-lg mb-2">Aucune commande trouvée</h3>
        <p className="text-muted-foreground">
          Aucune commande n'a encore été passée par les clients.
        </p>
      </div>
    );
  }

  function formatDate(dateString: string) {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy à HH:mm', { locale: fr });
    } catch (error) {
      console.error('Erreur de formatage de date:', error);
      return dateString;
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'validated':
        return (
          <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium">
            <CheckCircle className="h-3 w-3" />
            <span>Validée</span>
          </div>
        );
      case 'cancelled':
        return (
          <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-medium">
            <XCircle className="h-3 w-3" />
            <span>Annulée</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-xs font-medium">
            <AlertCircle className="h-3 w-3" />
            <span>En attente</span>
          </div>
        );
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produit</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.product_name}</TableCell>
              <TableCell>{order.customer_name || 'Non spécifié'}</TableCell>
              <TableCell>{order.amount}</TableCell>
              <TableCell>{formatDate(order.created_at)}</TableCell>
              <TableCell>{getStatusBadge(order.status)}</TableCell>
              <TableCell>
                {order.status === 'pending' && (
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                      onClick={() => onStatusChange(order.id, 'validated')}
                    >
                      Valider
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                      onClick={() => onStatusChange(order.id, 'cancelled')}
                    >
                      Annuler
                    </Button>
                  </div>
                )}
                {order.status !== 'pending' && (
                  <span className="text-muted-foreground text-sm">
                    Traitement terminé
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderTable;
