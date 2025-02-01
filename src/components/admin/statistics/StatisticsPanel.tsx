import React, { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import StatsCards from './StatsCards';
import SalesChart from './SalesChart';

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
    
    // Configurer l'écoute en temps réel des nouvelles commandes
    const channel = supabase
      .channel('cart-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'cart_history',
          filter: 'action_type=eq.purchase'
        },
        () => {
          // Mettre à jour le compteur de commandes
          setTotalOrders(prev => prev + 1);
          updateSalesData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateSalesData = async () => {
    const { data: recentSales } = await supabase
      .from('cart_history')
      .select('created_at')
      .eq('action_type', 'purchase')
      .order('created_at', { ascending: false });

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
  };

  const fetchStatistics = async () => {
    try {
      // Get total number of products
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      setTotalProducts(productsCount || 0);

      // Count total orders from cart_history
      const { data: ordersData, error: ordersError } = await supabase
        .from('cart_history')
        .select('*')
        .eq('action_type', 'purchase');

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
      } else {
        setTotalOrders(ordersData?.length || 0);
      }

      // Analyze product categories
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

      await updateSalesData();
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Statistiques</h2>
      
      <StatsCards
        totalProducts={totalProducts}
        totalOrders={totalOrders}
        popularCategory={popularCategory}
        categoryPercentage={categoryPercentage}
      />

      <SalesChart salesData={salesData} />
    </div>
  );
};

export default StatisticsPanel;