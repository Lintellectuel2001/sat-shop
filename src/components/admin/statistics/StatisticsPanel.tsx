import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Tags } from "lucide-react";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from "@/integrations/supabase/client";

interface SalesData {
  name: string;
  sales: number;
}

const StatisticsPanel = () => {
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [popularCategory, setPopularCategory] = useState<string>('');
  const [categoryPercentage, setCategoryPercentage] = useState<number>(0);
  const [salesData, setSalesData] = useState<SalesData[]>([]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      // Fetch total products
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact' });
      setTotalProducts(productsCount || 0);

      // Fetch total orders from cart_history where action_type is 'purchase'
      const { count: ordersCount } = await supabase
        .from('cart_history')
        .select('*', { count: 'exact' })
        .eq('action_type', 'purchase');
      setTotalOrders(ordersCount || 0);

      // Fetch products to calculate popular category
      const { data: products } = await supabase
        .from('products')
        .select('category');

      if (products) {
        const categoryCounts = products.reduce((acc: {[key: string]: number}, product) => {
          acc[product.category] = (acc[product.category] || 0) + 1;
          return acc;
        }, {});

        const mostPopular = Object.entries(categoryCounts).reduce((a, b) => 
          categoryCounts[a[0]] > categoryCounts[b[0]] ? a : b
        );

        setPopularCategory(mostPopular[0].toUpperCase());
        const percentage = (Number(mostPopular[1]) / products.length) * 100;
        setCategoryPercentage(Math.round(percentage));
      }

      // Fetch recent sales data (last 6 months)
      const { data: recentSales } = await supabase
        .from('cart_history')
        .select('created_at')
        .eq('action_type', 'purchase')
        .order('created_at', { ascending: false })
        .limit(6);

      if (recentSales) {
        const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
        const salesByMonth = recentSales.reduce((acc: {[key: string]: number}, sale) => {
          const month = new Date(sale.created_at).getMonth();
          acc[monthNames[month]] = (acc[monthNames[month]] || 0) + 1;
          return acc;
        }, {});

        const chartData = monthNames.map(month => ({
          name: month,
          sales: salesByMonth[month] || 0
        }));

        setSalesData(chartData);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Statistiques</h2>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produits</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Produits disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Commandes totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Catégorie Populaire</CardTitle>
            <Tags className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{popularCategory}</div>
            <p className="text-xs text-muted-foreground">
              {categoryPercentage}% des produits
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Ventes Récentes</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip />
                <Bar dataKey="sales" fill="#adfa1d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsPanel;