
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
    profitMargin
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
        <PeriodFilter 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
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
      </div>
    </div>
  );
};

export default StatisticsPanel;
