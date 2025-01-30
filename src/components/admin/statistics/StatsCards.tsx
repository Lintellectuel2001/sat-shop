import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Package2, ShoppingCart, Tag } from "lucide-react";

interface StatsCardsProps {
  totalProducts: number;
  totalOrders: number;
  popularCategory: string;
  categoryPercentage: number;
}

const StatsCards = ({ totalProducts, totalOrders, popularCategory, categoryPercentage }: StatsCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Produits</p>
            <h3 className="text-2xl font-bold">{totalProducts}</h3>
          </div>
          <Package2 className="h-8 w-8 text-muted-foreground" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Commandes</p>
            <h3 className="text-2xl font-bold">{totalOrders}</h3>
          </div>
          <ShoppingCart className="h-8 w-8 text-muted-foreground" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Catégorie Populaire</p>
            <h3 className="text-2xl font-bold">{popularCategory}</h3>
            <p className="text-sm text-muted-foreground">{categoryPercentage}% des produits</p>
          </div>
          <Tag className="h-8 w-8 text-muted-foreground" />
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;