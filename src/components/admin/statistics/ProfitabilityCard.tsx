
import React from 'react';
import { TrendingUp, DollarSign, ChartPie, ArrowUp, ArrowDown, BarChart3, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
  
  // Calculer le niveau de marge
  const getProfitMarginLevel = () => {
    if (profitMargin >= 30) return 'Excellente';
    if (profitMargin >= 20) return 'Bonne';
    if (profitMargin >= 10) return 'Correcte';
    if (profitMargin > 0) return 'Faible';
    return 'Négative';
  };
  
  const profitMarginLevel = getProfitMarginLevel();
  
  // Format profit as money with DA currency
  const formattedProfit = new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: 'DZD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(totalProfit);
  
  // Get progress bar color based on profit margin
  const getProgressBarColor = () => {
    if (profitMargin >= 30) return 'bg-green-500';
    if (profitMargin >= 20) return 'bg-green-400';
    if (profitMargin >= 10) return 'bg-green-300';
    if (profitMargin > 0) return 'bg-yellow-400';
    return 'bg-red-500';
  };
  
  // Get recommendation based on profit margin
  const getRecommendation = () => {
    if (profitMargin < 0) {
      return "Les coûts dépassent les revenus. Réévaluez immédiatement votre politique de prix et vos coûts d'achat.";
    } else if (profitMargin < 10) {
      return "Marge très serrée. Optimisez vos coûts d'achat et envisagez de revoir vos prix à la hausse.";
    } else if (profitMargin < 20) {
      return "Marge correcte. Continuez à surveiller vos coûts et envisagez d'optimiser votre chaîne d'approvisionnement.";
    } else if (profitMargin < 30) {
      return "Bonne marge. Votre stratégie actuelle est efficace, mais restez vigilant sur l'évolution des coûts.";
    } else {
      return "Excellente marge! Votre modèle commercial est très rentable. Envisagez d'investir dans l'expansion.";
    }
  };

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
            <p className="text-xs text-muted-foreground mt-1">
              Niveau: <span className={profitClass}>{profitMarginLevel}</span>
            </p>
          </div>
          <div className="w-full max-w-[120px]">
            <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
              <div 
                className={`h-full ${getProgressBarColor()}`}
                style={{ width: `${Math.min(Math.abs(profitMargin), 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-sm font-medium">État de Rentabilité</p>
              <div className={`flex items-center gap-1 ${profitClass}`}>
                <ArrowIcon className="h-4 w-4" />
                <span className="text-sm font-medium">{profitStatus}</span>
              </div>
            </div>
            
            <div className={`p-2 rounded-full ${isProfitable ? 'bg-green-50' : 'bg-red-50'}`}>
              <BarChart3 className={`h-4 w-4 ${isProfitable ? 'text-green-500' : 'text-red-500'}`} />
            </div>
          </div>

          <Separator />
          
          <div className="bg-secondary/20 p-3 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-white p-1.5 rounded-full">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">Analyse & Recommandation</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {getRecommendation()}
            </p>
          </div>
          
          {profitMargin < 10 && (
            <div className="bg-yellow-50 p-3 rounded-md flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-700">Alerte de rentabilité</p>
                <p className="text-xs text-yellow-600 mt-1">
                  Votre marge actuelle est inférieure à 10%. Envisagez de revoir votre stratégie de prix ou vos coûts d'approvisionnement.
                </p>
              </div>
            </div>
          )}
          
          <div className="bg-primary/5 p-3 rounded-md flex items-start gap-2">
            <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-primary">Suivi en temps réel</p>
              <p className="text-xs text-muted-foreground mt-1">
                Ces statistiques sont mises à jour automatiquement à chaque validation de commande.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfitabilityCard;
