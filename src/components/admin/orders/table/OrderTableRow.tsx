
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Order } from '../../products/hooks/useProductTypes';
import OrderStatusBadge from './OrderStatusBadge';
import OrderActions from './OrderActions';
import { formatDate } from './formatUtils';

interface OrderTableRowProps {
  order: Order;
  onStatusChange: (orderId: string, status: 'validated' | 'cancelled') => void;
  onDeleteClick: (orderId: string) => void;
}

const OrderTableRow: React.FC<OrderTableRowProps> = ({ 
  order, 
  onStatusChange, 
  onDeleteClick 
}) => {
  return (
    <TableRow key={order.id}>
      <TableCell className="font-medium">{order.product_name}</TableCell>
      <TableCell>{order.customer_name || 'Non spécifié'}</TableCell>
      <TableCell>{order.amount}</TableCell>
      <TableCell>{formatDate(order.created_at)}</TableCell>
      <TableCell><OrderStatusBadge status={order.status} /></TableCell>
      <TableCell>
        <OrderActions 
          orderId={order.id}
          status={order.status}
          onStatusChange={onStatusChange}
          onDeleteClick={onDeleteClick}
        />
      </TableCell>
    </TableRow>
  );
};

export default OrderTableRow;
