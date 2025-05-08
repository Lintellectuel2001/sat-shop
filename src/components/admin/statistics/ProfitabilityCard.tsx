
import React from 'react';
import { TrendingUp } from 'lucide-react';

interface ProfitabilityCardProps {
  totalProfit: number;
  profitMargin: number;
}

const ProfitabilityCard = ({ totalProfit, profitMargin }: ProfitabilityCardProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-elegant">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-primary">Rentabilité</h3>
        <p className="text-sm text-muted-foreground">Aperçu des bénéfices</p>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b pb-2">
          <div>
            <p className="text-sm text-muted-foreground">Bénéfice Total</p>
            <p className="text-lg font-semibold">{totalProfit.toLocaleString()} DA</p>
          </div>
          <div className="bg-green-50 p-2 rounded-full">
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
        </div>
        
        <div className="flex items-center justify-between border-b pb-2">
          <div>
            <p className="text-sm text-muted-foreground">Marge Bénéficiaire</p>
            <p className="text-lg font-semibold">{profitMargin.toFixed(2)}%</p>
          </div>
          <div className="relative h-2 w-full max-w-[100px] rounded-full bg-gray-100 overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-primary" 
              style={{ width: `${Math.min(profitMargin, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitabilityCard;
