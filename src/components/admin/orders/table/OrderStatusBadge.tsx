
import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: string;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
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
};

export default OrderStatusBadge;
