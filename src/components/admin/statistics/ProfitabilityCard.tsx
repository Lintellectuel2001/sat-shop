
import React from 'react';
import { TrendingUp, DollarSign, ChartPie, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfitabilityCardProps {
  totalProfit: number;
  profitMargin: number;
}

const ProfitabilityCard = ({ totalProfit, profitMargin }: ProfitabilityCardProps) => {
  // Calculate additional metrics
  const isProfitable = totalProfit > 0;
  const profitStatus = isProfitable ? 'Profitable' : 'Unprofitable';
  const profitClass = isProfitable ? 'text-green-600' : 'text-red-500';
  const ArrowIcon = isProfitable ? ArrowUp : ArrowDown;

  // Format profit as money with DA currency
  const formattedProfit = new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: 'DZD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(totalProfit);

  return (
    <Card className="shadow-elegant">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-primary flex items-center gap-2">
          <ChartPie className="h-5 w-5" />
          Rentabilité
        </CardTitle>
        <p className="text-sm text-muted-foreground">Aperçu détaillé des bénéfices</p>
      </CardHeader>
      
      <CardContent className="pt-4 space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Bénéfice Total</p>
            <p className="text-2xl font-bold">{formattedProfit}</p>
          </div>
          <div className={`p-3 rounded-full ${isProfitable ? 'bg-green-50' : 'bg-red-50'}`}>
            <DollarSign className={`h-5 w-5 ${isProfitable ? 'text-green-500' : 'text-red-500'}`} />
          </div>
        </div>
        
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Marge Bénéficiaire</p>
            <p className="text-xl font-semibold flex items-center gap-1">
              {profitMargin.toFixed(2)}%
              <span className={`text-xs px-2 py-0.5 rounded-full ${profitClass} bg-opacity-20`}>
                {profitStatus}
              </span>
            </p>
          </div>
          <div className="relative h-2 w-full max-w-[120px] rounded-full bg-gray-100 overflow-hidden">
            <div 
              className={`absolute left-0 top-0 h-full ${isProfitable ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${Math.min(Math.abs(profitMargin), 100)}%` }}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">État de Rentabilité</p>
            <div className={`flex items-center gap-1 ${profitClass}`}>
              <ArrowIcon className="h-4 w-4" />
              <span className="text-sm font-medium">{profitStatus}</span>
            </div>
          </div>
          
          <div className="bg-secondary/20 p-3 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Recommandation</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {profitMargin < 15 ? 
                "Envisagez d'optimiser vos coûts d'achat pour améliorer la marge bénéficiaire." : 
                "Votre marge bénéficiaire est saine. Continuez votre stratégie actuelle."
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfitabilityCard;
