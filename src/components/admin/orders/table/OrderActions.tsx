
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, DollarSign, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  const [isValidating, setIsValidating] = useState(false);

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      await onStatusChange(orderId, 'validated');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="flex space-x-2">
      {status === 'pending' && (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                  onClick={handleValidate}
                  disabled={isValidating}
                >
                  {isValidating ? (
                    <span className="flex items-center">
                      <span className="h-3 w-3 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                      Calcul...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" />
                      Valider
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Valider la commande et calculer le bénéfice</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
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
        <span className="text-muted-foreground text-sm mr-2 flex items-center">
          {status === 'validated' ? (
            <>
              <DollarSign className="h-3 w-3 mr-1 text-green-500" />
              Bénéfice calculé
            </>
          ) : (
            <>
              <AlertCircle className="h-3 w-3 mr-1 text-red-500" />
              Annulée
            </>
          )}
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
