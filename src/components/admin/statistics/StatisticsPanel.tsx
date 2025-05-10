
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
              {new Intl.NumberFormat('fr-DZ', {
                style: 'currency',
                currency: 'DZD',
                maximumFractionDigits: 0
              }).format(totalProfit)}
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

      {/* Dialogue de confirmation pour la suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce produit ? Cette action ne peut pas être annulée.
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
