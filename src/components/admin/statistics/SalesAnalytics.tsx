
import React from 'react';
import { Activity } from 'lucide-react';
import SalesChart from './SalesChart';
import UserStatistics from './UserStatistics';

interface SalesAnalyticsProps {
  salesData: Array<{ name: string; sales: number }>;
  recentSalesGrowth: number;
  viewMode: 'daily' | 'weekly' | 'monthly';
  totalUsers: number;
  newUsers: number;
  averageSessionTime: string;
  registrationRate: number;
  isLoading?: boolean;
}

const SalesAnalytics = ({ 
  salesData, 
  recentSalesGrowth, 
  viewMode, 
  totalUsers, 
  newUsers, 
  averageSessionTime, 
  registrationRate, 
  isLoading = false 
}: SalesAnalyticsProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-primary">Analyse des Ventes & Utilisateurs</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-elegant">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-primary">Évolution des Ventes</h4>
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
    </div>
  );
};

export default SalesAnalytics;
