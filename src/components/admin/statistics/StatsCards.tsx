
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Package2, ShoppingCart, Tag, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardsProps {
  totalProducts: number;
  totalOrders: number;
  popularCategory: string;
  categoryPercentage: number;
  recentSalesGrowth?: number;
  isLoading?: boolean;
}

const StatsCards = ({ 
  totalProducts, 
  totalOrders, 
  popularCategory, 
  categoryPercentage,
  recentSalesGrowth = 0,
  isLoading = false
}: StatsCardsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="overflow-hidden border-none shadow-elegant bg-gradient-to-br from-white to-secondary/30 hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-0">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-full bg-subtle text-accent">
                <Package2 className="h-5 w-5" />
              </div>
              <div className="bg-accent/10 px-2 py-1 rounded text-xs font-medium text-accent">
                Products
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Produits</p>
              {isLoading ? (
                <div className="h-8 w-16 bg-secondary/50 animate-pulse rounded"></div>
              ) : (
                <h3 className="text-3xl font-bold text-primary">{totalProducts}</h3>
              )}
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-accent/20 to-accent/80"></div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-elegant bg-gradient-to-br from-white to-secondary/30 hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-0">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-full bg-subtle text-accent">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <div className="bg-accent/10 px-2 py-1 rounded text-xs font-medium text-accent">
                Orders
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Commandes</p>
              {isLoading ? (
                <div className="h-8 w-16 bg-secondary/50 animate-pulse rounded"></div>
              ) : (
                <h3 className="text-3xl font-bold text-primary">{totalOrders}</h3>
              )}
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-accent/20 to-accent/80"></div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-elegant bg-gradient-to-br from-white to-secondary/30 hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-0">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-full bg-subtle text-accent">
                <Tag className="h-5 w-5" />
              </div>
              <div className="bg-accent/10 px-2 py-1 rounded text-xs font-medium text-accent">
                Category
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Catégorie Populaire</p>
              {isLoading ? (
                <div className="h-8 w-24 bg-secondary/50 animate-pulse rounded"></div>
              ) : (
                <>
                  <h3 className="text-3xl font-bold text-primary">{popularCategory || 'N/A'}</h3>
                  <p className="text-sm text-accent font-medium mt-1">{categoryPercentage}% des produits</p>
                </>
              )}
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-accent/20 to-accent/80"></div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-elegant bg-gradient-to-br from-white to-secondary/30 hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-0">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-full bg-subtle text-accent">
                {recentSalesGrowth >= 0 ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
              </div>
              <div className="bg-accent/10 px-2 py-1 rounded text-xs font-medium text-accent">
                Growth
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Croissance des Ventes</p>
              {isLoading ? (
                <div className="h-8 w-16 bg-secondary/50 animate-pulse rounded"></div>
              ) : (
                <h3 className={`text-3xl font-bold ${recentSalesGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {recentSalesGrowth >= 0 ? '+' : ''}{recentSalesGrowth.toFixed(1)}%
                </h3>
              )}
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-accent/20 to-accent/80"></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
