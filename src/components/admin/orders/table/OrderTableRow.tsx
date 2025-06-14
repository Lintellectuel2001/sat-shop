
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Order } from '../../products/hooks/useProductTypes';
import OrderStatusBadge from './OrderStatusBadge';
import OrderActions from './OrderActions';
import { formatDate, formatCustomerInfo } from './formatUtils';

interface OrderTableRowProps {
  order: Order;
  onStatusChange: (orderId: string, status: 'validated' | 'cancelled') => void;
  onDeleteClick: (orderId: string) => void;
}

const OrderTableRow: React.FC<OrderTableRowProps> = ({ order, onStatusChange, onDeleteClick }) => {
  // Déterminer les informations du client (utilisateur connecté ou invité)
  const getCustomerInfo = () => {
    if (order.user_id && order.customer_name) {
      // Utilisateur connecté
      return {
        name: order.customer_name,
        email: order.customer_email || 'Email non renseigné',
        type: 'Utilisateur inscrit'
      };
    } else if (order.guest_email) {
      // Client invité
      return {
        name: order.customer_name || 'Client invité',
        email: order.guest_email,
        type: 'Client invité'
      };
    } else {
      // Cas de fallback
      return {
        name: 'Client inconnu',
        email: 'Email non disponible',
        type: 'Non défini'
      };
    }
  };

  const customerInfo = getCustomerInfo();

  return (
    <TableRow>
      <TableCell>
        <div>
          <p className="font-medium">{order.product_name}</p>
          <p className="text-sm text-gray-500">ID: {order.id.substring(0, 8)}...</p>
        </div>
      </TableCell>
      
      <TableCell>
        <div>
          <p className="font-medium">{customerInfo.name}</p>
          <p className="text-sm text-gray-500">{customerInfo.email}</p>
          <p className="text-xs text-blue-600">{customerInfo.type}</p>
        </div>
      </TableCell>
      
      <TableCell>
        <span className="font-semibold text-primary">{order.amount}</span>
      </TableCell>
      
      <TableCell>
        {formatDate(order.created_at)}
      </TableCell>
      
      <TableCell>
        <OrderStatusBadge status={order.status} />
      </TableCell>
      
      <TableCell>
        <OrderActions 
          order={order} 
          onStatusChange={onStatusChange}
          onDeleteClick={onDeleteClick}
        />
      </TableCell>
    </TableRow>
  );
};

export default OrderTableRow;
