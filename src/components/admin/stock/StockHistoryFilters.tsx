
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface ProductData {
  id: string;
  name: string;
}

interface StockHistoryFiltersProps {
  products: ProductData[];
  selectedProduct: string | null;
  setSelectedProduct: (productId: string | null) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  resetFilters: () => void;
}

const StockHistoryFilters: React.FC<StockHistoryFiltersProps> = ({
  products,
  selectedProduct,
  setSelectedProduct,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  resetFilters
}) => {
  return (
    <div className="bg-muted p-4 rounded-md flex flex-col sm:flex-row gap-3 items-end">
      <div className="w-full sm:w-1/3">
        <label className="text-sm font-medium mb-1 block">Produit</label>
        <Select
          value={selectedProduct || ''}
          onValueChange={(value) => setSelectedProduct(value || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tous les produits" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les produits</SelectItem>
            {products.map(product => (
              <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex space-x-2 w-full sm:w-auto">
        <div>
          <label className="text-sm font-medium mb-1 block">Date début</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                {startDate ? format(startDate, 'dd/MM/yyyy') : 'Choisir...'}
                <Calendar className="ml-auto h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Date fin</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                {endDate ? format(endDate, 'dd/MM/yyyy') : 'Choisir...'}
                <Calendar className="ml-auto h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="self-end">
          <Button variant="ghost" onClick={resetFilters}>
            Réinitialiser
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StockHistoryFilters;
