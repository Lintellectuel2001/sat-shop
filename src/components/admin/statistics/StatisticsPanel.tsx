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

  const updateSalesData = async () => {
    try {
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

        console.log('Données du graphique mises à jour:', chartData);
        setSalesData(chartData);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données de vente:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      console.log('Récupération des statistiques...');
      
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      
      console.log('Nombre total de produits:', productsCount);
      setTotalProducts(productsCount || 0);

      const { data: ordersData, error: ordersError } = await supabase
        .from('cart_history')
        .select('*')
        .eq('action_type', 'purchase');

      if (ordersError) {
        console.error('Erreur lors de la récupération des commandes:', ordersError);
      } else {
        const totalOrderCount = ordersData?.length || 0;
        console.log('Nombre total de commandes trouvées:', totalOrderCount);
        setTotalOrders(totalOrderCount);
      }

      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('category');

      if (productsError) {
        console.error('Erreur lors de la récupération des catégories:', productsError);
        return;
      }

      if (products && products.length > 0) {
        const categoryCounts = products.reduce((acc: {[key: string]: number}, product) => {
          if (product.category) {
            acc[product.category] = (acc[product.category] || 0) + 1;
          }
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
      console.error('Erreur lors de la récupération des statistiques:', error);
    }
  };

  useEffect(() => {
    console.log('Initialisation du panneau de statistiques...');
    fetchStatistics();
    
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
        async (payload) => {
          console.log('Nouvelle commande détectée:', payload);
          setTotalOrders(prev => prev + 1);
          await updateSalesData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Statistiques</h2>
        <div className="bg-subtle rounded-full px-4 py-2 text-sm font-medium text-accent">
          Mise à jour en temps réel
        </div>
      </div>
      
      <StatsCards
        totalProducts={totalProducts}
        totalOrders={totalOrders}
        popularCategory={popularCategory}
        categoryPercentage={categoryPercentage}
      />

      <div className="bg-white p-6 rounded-xl shadow-elegant">
        <SalesChart salesData={salesData} />
      </div>
    </div>
  );
};

export default StatisticsPanel;
