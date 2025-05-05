
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Order } from '../products/hooks/useProductTypes';
import OrderTableRow from './table/OrderTableRow';
import DeleteConfirmDialog from './table/DeleteConfirmDialog';
import LoadingState from './table/LoadingState';
import EmptyOrderState from './table/EmptyOrderState';

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
    return <LoadingState />;
  }

  if (orders.length === 0) {
    return <EmptyOrderState />;
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
            <OrderTableRow 
              key={order.id}
              order={order} 
              onStatusChange={onStatusChange}
              onDeleteClick={handleDeleteClick}
            />
          ))}
        </TableBody>
      </Table>
      
      <DeleteConfirmDialog 
        isOpen={showDialog}
        onOpenChange={setShowDialog}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default OrderTable;
