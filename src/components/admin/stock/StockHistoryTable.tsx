
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { StockHistoryEntry } from './useStockHistory';

interface StockHistoryTableProps {
  history: StockHistoryEntry[];
  isLoading: boolean;
}

const StockHistoryTable: React.FC<StockHistoryTableProps> = ({ history, isLoading }) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy - HH:mm', { locale: fr });
  };

  if (isLoading && history.length === 0) {
    return <div className="flex justify-center p-8">
      <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full"></div>
    </div>;
  }

  return (
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
  );
};

export default StockHistoryTable;
