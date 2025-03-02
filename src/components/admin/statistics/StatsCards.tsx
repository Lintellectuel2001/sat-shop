
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
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="overflow-hidden border-none shadow-elegant bg-gradient-to-br from-white to-secondary/30">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Produits</p>
            <h3 className="text-3xl font-bold text-primary">{totalProducts}</h3>
          </div>
          <div className="p-4 rounded-full bg-subtle text-accent">
            <Package2 className="h-8 w-8" />
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-elegant bg-gradient-to-br from-white to-secondary/30">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Commandes</p>
            <h3 className="text-3xl font-bold text-primary">{totalOrders}</h3>
          </div>
          <div className="p-4 rounded-full bg-subtle text-accent">
            <ShoppingCart className="h-8 w-8" />
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-elegant bg-gradient-to-br from-white to-secondary/30">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Catégorie Populaire</p>
            <h3 className="text-3xl font-bold text-primary">{popularCategory}</h3>
            <p className="text-sm text-accent font-medium mt-1">{categoryPercentage}% des produits</p>
          </div>
          <div className="p-4 rounded-full bg-subtle text-accent">
            <Tag className="h-8 w-8" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
