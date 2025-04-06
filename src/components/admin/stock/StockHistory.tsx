
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { AlertTriangle, ArrowDownCircle, ArrowUpCircle, Calendar } from "lucide-react";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
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

interface StockHistoryEntry {
  id: string;
  product_id: string;
  product_name: string;
  previous_quantity: number;
  new_quantity: number;
  change_type: string;
  notes: string;
  created_at: string;
  created_by: string;
}

const StockHistory = () => {
  const [history, setHistory] = useState<StockHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<{id: string, name: string}[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
    fetchHistory();
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [selectedProduct, startDate, endDate]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name')
        .eq('is_physical', true)
        .order('name');
      
      if (error) {
        throw error;
      }
      
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les produits",
      });
    }
  };

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('stock_history')
        .select(`
          id,
          product_id,
          previous_quantity,
          new_quantity,
          change_type,
          notes,
          created_at,
          created_by,
          products(name)
        `)
        .order('created_at', { ascending: false });
      
      if (selectedProduct) {
        query = query.eq('product_id', selectedProduct);
      }
      
      if (startDate) {
        query = query.gte('created_at', startDate.toISOString());
      }
      
      if (endDate) {
        // Add one day to end date to include entries from that day
        const nextDay = new Date(endDate);
        nextDay.setDate(nextDay.getDate() + 1);
        query = query.lt('created_at', nextDay.toISOString());
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }

      // Transform the data to include product name
      const formattedData = data.map(item => ({
        ...item,
        product_name: item.products?.name || 'Produit inconnu'
      }));
      
      setHistory(formattedData);
    } catch (error) {
      console.error('Error fetching stock history:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger l'historique",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetFilters = () => {
    setSelectedProduct(null);
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy - HH:mm', { locale: fr });
  };

  if (isLoading && history.length === 0) {
    return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full"></div></div>;
  }

  return (
    <div className="space-y-4">
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

      <Table className="border rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Produit</TableHead>
            <TableHead>Changement</TableHead>
            <TableHead>Quantité précédente</TableHead>
            <TableHead>Nouvelle quantité</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.length > 0 ? (
            history.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="whitespace-nowrap">
                  {formatDate(entry.created_at)}
                </TableCell>
                <TableCell className="font-medium">{entry.product_name}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {entry.change_type === 'increase' ? (
                      <>
                        <ArrowUpCircle className="mr-2 h-4 w-4 text-green-500" />
                        <span className="text-green-600">Augmentation</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownCircle className="mr-2 h-4 w-4 text-amber-500" />
                        <span className="text-amber-600">Diminution</span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell>{entry.previous_quantity}</TableCell>
                <TableCell>{entry.new_quantity}</TableCell>
                <TableCell className="max-w-xs truncate">{entry.notes}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                Aucun historique trouvé
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default StockHistory;
