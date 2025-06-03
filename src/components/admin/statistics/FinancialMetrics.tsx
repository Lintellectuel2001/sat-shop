
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, CreditCard } from "lucide-react";

interface FinancialMetricsProps {
  validatedOrdersSum: number;
  validatedOrdersProfit: number;
  totalOrders: number;
  isLoading?: boolean;
}

const FinancialMetrics = ({ 
  validatedOrdersSum, 
  validatedOrdersProfit, 
  totalOrders, 
  isLoading = false 
}: FinancialMetricsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const averageOrderValue = totalOrders > 0 ? validatedOrdersSum / totalOrders : 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-primary mb-4">Métriques Financières</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-none shadow-elegant bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Chiffre d'Affaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-24 bg-secondary/50 animate-pulse rounded"></div>
              ) : (
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(validatedOrdersSum)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Commandes validées
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-elegant bg-gradient-to-br from-emerald-50 to-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Bénéfices
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-24 bg-secondary/50 animate-pulse rounded"></div>
              ) : (
                <div>
                  <p className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(validatedOrdersProfit)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Marge réalisée
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-elegant bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Panier Moyen
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-24 bg-secondary/50 animate-pulse rounded"></div>
              ) : (
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(averageOrderValue)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Valeur moyenne
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FinancialMetrics;
