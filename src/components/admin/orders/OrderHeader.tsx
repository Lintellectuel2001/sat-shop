import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { PackageCheck, Clock, PackageX, Package } from 'lucide-react';
import { OrderStats } from './hooks/useOrderManagement';

interface OrderHeaderProps {
  stats: OrderStats;
  isLoading: boolean;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({ stats, isLoading }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Commandes</h2>
          <p className="text-muted-foreground mt-1">
            Gérez les commandes des clients et suivez les ventes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total des commandes" 
          value={stats.total} 
          icon={<Package className="h-5 w-5 text-blue-500" />} 
          isLoading={isLoading}
          color="bg-blue-50"
        />
        <StatsCard 
          title="Commandes validées" 
          value={stats.validated} 
          icon={<PackageCheck className="h-5 w-5 text-green-500" />} 
          isLoading={isLoading}
          color="bg-green-50"
        />
        <StatsCard 
          title="Commandes en attente" 
          value={stats.pending} 
          icon={<Clock className="h-5 w-5 text-yellow-500" />} 
          isLoading={isLoading}
          color="bg-yellow-50"
        />
        <StatsCard 
          title="Commandes annulées" 
          value={stats.cancelled} 
          icon={<PackageX className="h-5 w-5 text-red-500" />} 
          isLoading={isLoading}
          color="bg-red-50"
        />
      </div>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  isLoading: boolean;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, isLoading, color }) => {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className={`p-4 ${color} rounded-lg`}>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {isLoading ? (
              <div className="h-7 w-16 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-2xl font-bold">{value}</p>
            )}
          </div>
          <div className="p-2 rounded-full bg-white/80">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderHeader;
