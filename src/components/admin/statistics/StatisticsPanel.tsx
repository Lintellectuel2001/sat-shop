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
    recentSales,
    refetch
  } = useStatisticsData(viewMode, dateRange);

  // Calculer la somme des bénéfices des ventes récentes
  const recentSalesTotal = recentSales ? recentSales.reduce((sum, sale) => sum + sale.profit, 0) : 0;
  
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
    console.log("Demande de suppression pour le produit ID:", id);
    setProductToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      console.log("Suppression du produit avec ID:", productToDelete);
      try {
        await handleProductDelete(productToDelete);
        toast({
          title: "Produit supprimé",
          description: "Le produit a été supprimé avec succès",
        });
        // Rafraîchir les données après suppression
        refetch();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de supprimer le produit",
        });
      }
    }
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const cancelDelete = () => {
    setProductToDelete(null);
    setIsDeleteDialogOpen(false);
  };
  
  // Utiliser soit le total calculé, soit le total réinitialisé
  const effectiveTotal = displayedTotal !== null ? displayedTotal : recentSalesTotal;

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

        {/* Affichage des ventes récentes avec les bénéfices calculés */}
        {recentSales && recentSales.length > 0 && (
          <div className="md:col-span-3 bg-white p-6 rounded-xl shadow-elegant">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-primary">Bénéfices par article (ventes récentes)</h3>
              <div className="flex items-center gap-2">
                <div className="bg-green-50 px-4 py-2 rounded-lg">
                  <p className="text-sm font-medium">Bénéfice total:</p>
                  <p className={`text-lg font-bold ${effectiveTotal > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {new Intl.NumberFormat('fr-DZ', {
                      style: 'currency',
                      currency: 'DZD',
                      maximumFractionDigits: 0
                    }).format(effectiveTotal)}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetDisplayedTotal}
                  className="flex items-center gap-1"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Remettre à zéro</span>
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b">
                    <th className="text-sm font-medium text-left py-2">Produit</th>
                    <th className="text-sm font-medium text-right py-2">Prix d'achat</th>
                    <th className="text-sm font-medium text-right py-2">Prix de vente</th>
                    <th className="text-sm font-medium text-right py-2">Bénéfice</th>
                    <th className="text-sm font-medium text-right py-2">Marge</th>
                    <th className="text-sm font-medium text-right py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.map((sale, index) => {
                    // Calculer la marge en pourcentage - Converting the result to a string
                    const margin = sale.purchase_price > 0 
                      ? ((sale.selling_price - sale.purchase_price) / sale.purchase_price * 100).toFixed(1) 
                      : '∞';
                    
                    return (
                      <tr key={index} className="border-b">
                        <td className="py-2.5">{sale.product_name}</td>
                        <td className="text-right py-2.5">
                          {new Intl.NumberFormat('fr-DZ', {
                            style: 'currency',
                            currency: 'DZD',
                            maximumFractionDigits: 0
                          }).format(sale.purchase_price)}
                        </td>
                        <td className="text-right py-2.5">
                          {new Intl.NumberFormat('fr-DZ', {
                            style: 'currency',
                            currency: 'DZD',
                            maximumFractionDigits: 0
                          }).format(sale.selling_price)}
                        </td>
                        <td className={`text-right py-2.5 font-medium ${sale.profit > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {new Intl.NumberFormat('fr-DZ', {
                            style: 'currency',
                            currency: 'DZD',
                            maximumFractionDigits: 0
                          }).format(sale.profit)}
                        </td>
                        <td className={`text-right py-2.5 ${Number(margin) > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {margin}
                        </td>
                        <td className="text-right py-2.5">
                          {sale.product_id && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteClick(sale.product_id)}
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
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
