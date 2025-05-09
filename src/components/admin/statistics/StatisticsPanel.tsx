
import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import StatsCards from './StatsCards';
import SalesChart from './SalesChart';
import UserStatistics from './UserStatistics';
import PeriodFilter from './PeriodFilter';
import ProfitabilityCard from './ProfitabilityCard';
import { useStatisticsData } from './hooks/useStatisticsData';

const StatisticsPanel = () => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
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
        
        <ProfitabilityCard 
          totalProfit={totalProfit}
          profitMargin={profitMargin}
        />

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
            <h3 className="text-lg font-semibold text-primary mb-4">Bénéfices par article (ventes récentes)</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b">
                    <th className="text-sm font-medium text-left py-2">Produit</th>
                    <th className="text-sm font-medium text-right py-2">Prix d'achat</th>
                    <th className="text-sm font-medium text-right py-2">Prix de vente</th>
                    <th className="text-sm font-medium text-right py-2">Bénéfice</th>
                    <th className="text-sm font-medium text-right py-2">Marge</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.map((sale, index) => {
                    // Calculer la marge en pourcentage
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
                          {margin}%
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
    </div>
  );
};

export default StatisticsPanel;
