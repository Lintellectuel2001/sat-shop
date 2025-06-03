
import React from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table";

interface RecentSale {
  id: string;
  product_name: string;
  selling_price: number;
  purchase_price: number;
  profit: number;
  created_at: string;
}

interface RecentSalesTableProps {
  recentSales: RecentSale[];
  onDeleteClick: (id: string) => void;
  onReset: () => void;
}

const RecentSalesTable = ({ recentSales, onDeleteClick, onReset }: RecentSalesTableProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-primary">Détail des Ventes</h3>
      
      <div className="bg-white p-6 rounded-xl shadow-elegant">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-primary">Bénéfices par article (ventes récentes)</h4>
          <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={onReset}>
            <RefreshCw className="h-4 w-4" />
            <span>Réinitialiser</span>
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead className="text-right">Prix de vente</TableHead>
              <TableHead className="text-right">Prix d'achat</TableHead>
              <TableHead className="text-right">Bénéfice</TableHead>
              <TableHead className="text-right">Date</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentSales.length > 0 ? (
              recentSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.product_name}</TableCell>
                  <TableCell className="text-right">{formatCurrency(sale.selling_price)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(sale.purchase_price)}</TableCell>
                  <TableCell className={`text-right font-semibold ${sale.profit > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {formatCurrency(sale.profit)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {new Date(sale.created_at).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteClick(sale.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  Aucune vente récente à afficher
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RecentSalesTable;
