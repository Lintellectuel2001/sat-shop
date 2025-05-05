
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';

interface OrderActionsProps {
  orderId: string;
  status: 'pending' | 'validated' | 'cancelled';
  onStatusChange: (orderId: string, status: 'validated' | 'cancelled') => void;
  onDeleteClick: (orderId: string) => void;
}

const OrderActions: React.FC<OrderActionsProps> = ({ 
  orderId, 
  status, 
  onStatusChange, 
  onDeleteClick 
}) => {
  return (
    <div className="flex space-x-2">
      {status === 'pending' && (
        <>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
            onClick={() => onStatusChange(orderId, 'validated')}
          >
            Valider
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            onClick={() => onStatusChange(orderId, 'cancelled')}
          >
            Annuler
          </Button>
        </>
      )}
      
      {status !== 'pending' && (
        <span className="text-muted-foreground text-sm mr-2">
          Traitement terminé
        </span>
      )}
      
      <Button 
        variant="outline" 
        size="sm"
        className="text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-700"
        onClick={() => onDeleteClick(orderId)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default OrderActions;
