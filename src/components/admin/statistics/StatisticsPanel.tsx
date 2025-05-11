
import React, { useState } from 'react';
import { Activity, RefreshCw, Trash2 } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import StatsCards from './StatsCards';
import SalesChart from './SalesChart';
import UserStatistics from './UserStatistics';
import PeriodFilter from './PeriodFilter';
import { useStatisticsData } from './hooks/useStatisticsData';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useProductDeletion } from '@/components/admin/products/hooks/useProductDeletion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table";

const StatisticsPanel = () => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const { toast } = useToast();
  const { handleProductDelete } = useProductDeletion();
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { 
    totalProducts,
    totalOrders,
    popularCategory,
    categoryPercentage,
    salesData,
    recentSalesGrowth,
    isLoading,
    totalUsers,
    newUsers,
    averageSessionTime,
    registrationRate,
    totalProfit,
    profitMargin,
    recentSales
  } = useStatisticsData(viewMode, dateRange);

  // État local pour afficher ou réinitialiser le total
  const [displayedTotal, setDisplayedTotal] = useState<number | null>(null);
  
  // Fonction pour réinitialiser le total affiché
  const resetDisplayedTotal = () => {
    setDisplayedTotal(0);
    toast({
      title: "Réinitialisation",
      description: "Le total des bénéfices a été remis à zéro",
    });
  };
  
  // Gestion de la suppression de produit
  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      await handleProductDelete(productToDelete);
      // Refresh est géré par le hook useStatisticsData qui actualise les données
    }
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const cancelDelete = () => {
    setProductToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  // Format currency function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Statistiques
          </h2>
          <p className="text-muted-foreground">
            Vue d'ensemble des performances et tendances de la boutique
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white shadow-sm border px-3 py-2 rounded-lg">
            <p className="text-sm font-medium">Bénéfice total:</p>
            <p className={`text-lg font-bold ${totalProfit > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {formatCurrency(totalProfit)}
            </p>
          </div>
          <PeriodFilter 
            viewMode={viewMode} 
            setViewMode={setViewMode} 
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        </div>
      </div>
      
      <StatsCards
        totalProducts={totalProducts}
        totalOrders={totalOrders}
        popularCategory={popularCategory}
        categoryPercentage={categoryPercentage}
        recentSalesGrowth={recentSalesGrowth}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-elegant">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-primary">Évolution des Ventes</h3>
              <p className="text-sm text-muted-foreground">
                {viewMode === 'daily' && '7 derniers jours'}
                {viewMode === 'weekly' && 'Dernière semaine'}
                {viewMode === 'monthly' && 'Derniers 6 mois'}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-subtle px-3 py-1 rounded-full text-sm text-accent">
              <Activity className="h-4 w-4" />
              <span className={recentSalesGrowth >= 0 ? 'text-green-600' : 'text-red-500'}>
                {recentSalesGrowth >= 0 ? '+' : ''}{recentSalesGrowth.toFixed(1)}%
              </span>
            </div>
          </div>
          <SalesChart salesData={salesData} />
        </div>

        <UserStatistics
          totalUsers={totalUsers}
          newUsers={newUsers}
          averageSessionTime={averageSessionTime}
          registrationRate={registrationRate}
          isLoading={isLoading}
        />
      </div>

      {/* Section Bénéfices par article (ventes récentes) */}
      <div className="bg-white p-6 rounded-xl shadow-elegant">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary">Bénéfices par article (ventes récentes)</h3>
          <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={resetDisplayedTotal}>
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
                      onClick={() => handleDeleteClick(sale.id)}
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

      {/* Dialogue de confirmation pour la suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet enregistrement de vente ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StatisticsPanel;
