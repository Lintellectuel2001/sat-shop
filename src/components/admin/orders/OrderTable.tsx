
import React from 'react';
import { Package } from 'lucide-react';  // Add this import
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import OrderTracking from '../../cart/OrderTracking';

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'pending':
    case 'en attente':
      return 'bg-yellow-100 text-yellow-800';
    case 'processing':
    case 'en traitement':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
    case 'expédié':
      return 'bg-purple-100 text-purple-800';
    case 'delivered':
    case 'livré':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
    case 'annulé':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const OrderTable = ({ orders, loading, onStatusUpdate }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-muted-foreground">Aucune commande trouvée</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableCaption>Liste des commandes</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Produit</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">
                {order.id.substring(0, 8)}...
              </TableCell>
              <TableCell>{formatDate(order.created_at)}</TableCell>
              <TableCell>
                <div className="max-w-[150px] truncate">{order.customer_name}</div>
                <div className="text-xs text-muted-foreground">{order.customer_phone}</div>
              </TableCell>
              <TableCell>
                {order.products ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center overflow-hidden">
                      {order.products.image ? (
                        <img 
                          src={order.products.image} 
                          alt={order.products.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="h-4 w-4" />
                      )}
                    </div>
                    <span className="truncate max-w-[120px]">
                      {order.products.name}
                    </span>
                  </div>
                ) : (
                  "N/A"
                )}
              </TableCell>
              <TableCell>{order.amount} DA</TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={getStatusColor(order.status)}
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="font-medium mb-2">Suivi de commande</div>
                            <OrderTracking tracking={order.order_tracking || []} />
                          </PopoverContent>
                        </Popover>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Voir le suivi</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onStatusUpdate(order)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Modifier le statut</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderTable;
