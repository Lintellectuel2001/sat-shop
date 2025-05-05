
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle, Trash2 } from 'lucide-react';
import { Order } from '../products/hooks/useProductTypes';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OrderTableProps {
  orders: Order[];
  isLoading: boolean;
  onStatusChange: (orderId: string, status: 'validated' | 'cancelled') => void;
  onDeleteOrder: (orderId: string) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, isLoading, onStatusChange, onDeleteOrder }) => {
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);

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
  
  const handleDeleteClick = (id: string) => {
    console.log("Bouton de suppression cliqué pour la commande ID:", id);
    setOrderToDelete(id);
    setShowDialog(true);
  };

  const handleConfirmDelete = () => {
    console.log("Confirmation de suppression pour la commande ID:", orderToDelete);
    if (orderToDelete) {
      onDeleteOrder(orderToDelete);
      setShowDialog(false);
      setOrderToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    console.log("Suppression annulée");
    setShowDialog(false);
    setOrderToDelete(null);
  };

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
                <div className="flex space-x-2">
                  {order.status === 'pending' && (
                    <>
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
                    </>
                  )}
                  
                  {order.status !== 'pending' && (
                    <span className="text-muted-foreground text-sm mr-2">
                      Traitement terminé
                    </span>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-700"
                    onClick={() => handleDeleteClick(order.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={handleCancelDelete}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderTable;
