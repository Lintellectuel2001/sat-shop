
import React from 'react';
import { FileText, Package } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface OrderHeaderProps {
  ordersCount: number;
  onGenerateReport: () => void;
}

const OrderHeader = ({ ordersCount, onGenerateReport }: OrderHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
      <div className="flex items-center mb-4 md:mb-0">
        <div className="bg-primary/10 p-3 rounded-lg mr-4">
          <Package className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Gestion des commandes</h2>
          <p className="text-muted-foreground">{ordersCount} commandes au total</p>
        </div>
      </div>
      <Button 
        onClick={onGenerateReport}
        className="flex items-center"
      >
        <FileText className="mr-2 h-4 w-4" />
        Générer un rapport
      </Button>
    </div>
  );
};

export default OrderHeader;
