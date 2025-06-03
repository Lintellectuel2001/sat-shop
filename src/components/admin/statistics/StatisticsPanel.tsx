
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';

import StatsCards from './StatsCards';
import FinancialMetrics from './FinancialMetrics';
import SalesAnalytics from './SalesAnalytics';
import RecentSalesTable from './RecentSalesTable';
import PeriodFilter from './PeriodFilter';
import { useStatisticsData } from './hooks/useStatisticsData';
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
    recentSales,
    validatedOrdersSum,
    validatedOrdersProfit
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
      {/* En-tête avec filtres */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Tableau de Bord
          </h2>
          <p className="text-muted-foreground">
            Vue d'ensemble des performances et tendances de la boutique
          </p>
        </div>
        <PeriodFilter 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      </div>
      
      {/* Métriques générales */}
      <div>
        <h3 className="text-lg font-semibold text-primary mb-4">Vue d'ensemble</h3>
        <StatsCards
          totalProducts={totalProducts}
          totalOrders={totalOrders}
          popularCategory={popularCategory}
          categoryPercentage={categoryPercentage}
          recentSalesGrowth={recentSalesGrowth}
          isLoading={isLoading}
        />
      </div>

      {/* Métriques financières */}
      <FinancialMetrics
        validatedOrdersSum={validatedOrdersSum}
        validatedOrdersProfit={validatedOrdersProfit}
        totalOrders={totalOrders}
        isLoading={isLoading}
      />

      {/* Analyse des ventes et utilisateurs */}
      <SalesAnalytics
        salesData={salesData}
        recentSalesGrowth={recentSalesGrowth}
        viewMode={viewMode}
        totalUsers={totalUsers}
        newUsers={newUsers}
        averageSessionTime={averageSessionTime}
        registrationRate={registrationRate}
        isLoading={isLoading}
      />

      {/* Détail des ventes */}
      <RecentSalesTable
        recentSales={recentSales}
        onDeleteClick={handleDeleteClick}
        onReset={resetDisplayedTotal}
      />

      {/* Dialogue de confirmation */}
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
