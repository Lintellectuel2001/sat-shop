
import React, { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import StatsCards from './StatsCards';
import SalesChart from './SalesChart';
import { Button } from "@/components/ui/button";
import { Calendar, CalendarDays, CalendarClock, TrendingUp, Activity, BarChart } from 'lucide-react';

interface SalesData {
  name: string;
  sales: number;
}

interface CategoryData {
  name: string;
  value: number;
}

const StatisticsPanel = () => {
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [popularCategory, setPopularCategory] = useState<string>('');
  const [categoryPercentage, setCategoryPercentage] = useState<number>(0);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [categoriesData, setCategoriesData] = useState<CategoryData[]>([]);
  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('monthly');
  const [recentSalesGrowth, setRecentSalesGrowth] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const updateSalesData = async () => {
    try {
      const { data: recentSales } = await supabase
        .from('cart_history')
        .select('created_at, product_id')
        .eq('action_type', 'purchase')
        .order('created_at', { ascending: false });

      if (recentSales) {
        if (viewMode === 'monthly') {
          // Monthly view
          const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
          const salesByMonth = recentSales.reduce((acc: {[key: string]: number}, sale) => {
            const month = new Date(sale.created_at).getMonth();
            if (month < monthNames.length) {
              acc[monthNames[month]] = (acc[monthNames[month]] || 0) + 1;
            }
            return acc;
          }, {});

          const chartData = monthNames.map(month => ({
            name: month,
            sales: salesByMonth[month] || 0
          }));

          // Calculate growth rate (compare last two months)
          const lastMonthSales = chartData[chartData.length - 1].sales;
          const previousMonthSales = chartData[chartData.length - 2].sales;
          
          if (previousMonthSales > 0) {
            const growth = ((lastMonthSales - previousMonthSales) / previousMonthSales) * 100;
            setRecentSalesGrowth(growth);
          } else {
            setRecentSalesGrowth(lastMonthSales > 0 ? 100 : 0);
          }

          setSalesData(chartData);
        } else {
          // Daily view (last 7 days)
          const today = new Date();
          const dayNames = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
          }).reverse();

          const salesByDay = recentSales.reduce((acc: {[key: string]: number}, sale) => {
            const saleDate = new Date(sale.created_at);
            // Check if the sale date is within the last 7 days
            const dayDiff = Math.floor((today.getTime() - saleDate.getTime()) / (1000 * 60 * 60 * 24));
            if (dayDiff < 7) {
              const dayLabel = saleDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
              acc[dayLabel] = (acc[dayLabel] || 0) + 1;
            }
            return acc;
          }, {});

          const chartData = dayNames.map(day => ({
            name: day,
            sales: salesByDay[day] || 0
          }));

          // Calculate growth rate (compare last two days)
          const lastDaySales = chartData[chartData.length - 1].sales;
          const previousDaySales = chartData[chartData.length - 2].sales;
          
          if (previousDaySales > 0) {
            const growth = ((lastDaySales - previousDaySales) / previousDaySales) * 100;
            setRecentSalesGrowth(growth);
          } else {
            setRecentSalesGrowth(lastDaySales > 0 ? 100 : 0);
          }

          setSalesData(chartData);
        }

        // Generate category statistics
        const { data: products } = await supabase
          .from('products')
          .select('category');

        if (products && products.length > 0) {
          const categoryCounts: {[key: string]: number} = {};
          
          products.forEach(product => {
            if (product.category) {
              categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
            }
          });

          const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({
            name: name.toUpperCase(),
            value
          })).sort((a, b) => b.value - a.value);
          
          setCategoriesData(categoryData);
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données de vente:', error);
      setIsLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'monthly' ? 'daily' : 'monthly');
  };

  useEffect(() => {
    updateSalesData();
  }, [viewMode]);

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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Statistiques
          </h2>
          <p className="text-muted-foreground">
            Vue d'ensemble des performances et tendances de la boutique
          </p>
        </div>
        <div className="flex items-center gap-4 self-end md:self-auto">
          <div className="flex items-center bg-secondary/50 p-1 rounded-lg">
            <Button 
              variant={viewMode === 'daily' ? 'default' : 'ghost'} 
              size="sm"
              className={`flex items-center gap-2 ${viewMode === 'daily' ? 'bg-white text-accent' : ''}`}
              onClick={() => setViewMode('daily')}
            >
              <CalendarDays className="h-4 w-4" />
              Jour
            </Button>
            <Button 
              variant={viewMode === 'monthly' ? 'default' : 'ghost'} 
              size="sm"
              className={`flex items-center gap-2 ${viewMode === 'monthly' ? 'bg-white text-accent' : ''}`}
              onClick={() => setViewMode('monthly')}
            >
              <CalendarClock className="h-4 w-4" />
              Mois
            </Button>
          </div>
          <div className="flex items-center gap-2 bg-soft px-4 py-2 rounded-full text-sm font-medium text-accent">
            <Activity className="h-4 w-4" />
            Mise à jour en temps réel
          </div>
        </div>
      </div>
      
      <StatsCards
        totalProducts={totalProducts}
        totalOrders={totalOrders}
        popularCategory={popularCategory}
        categoryPercentage={categoryPercentage}
        recentSalesGrowth={recentSalesGrowth}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-elegant">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-primary">Évolution des Ventes</h3>
              <p className="text-sm text-muted-foreground">
                {viewMode === 'monthly' ? 'Derniers 6 mois' : '7 derniers jours'}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-subtle px-3 py-1 rounded-full text-sm text-accent">
              <TrendingUp className="h-4 w-4" />
              <span className={recentSalesGrowth >= 0 ? 'text-green-600' : 'text-red-500'}>
                {recentSalesGrowth >= 0 ? '+' : ''}{recentSalesGrowth.toFixed(1)}%
              </span>
            </div>
          </div>
          <SalesChart salesData={salesData} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-elegant">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary">Distribution par Catégorie</h3>
              <BarChart className="h-5 w-5 text-accent" />
            </div>
            <p className="text-sm text-muted-foreground">Répartition des produits par catégorie</p>
          </div>
          <div className="space-y-4">
            {categoriesData.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{category.name}</span>
                  <span className="text-sm text-muted-foreground">{category.value} produits</span>
                </div>
                <div className="w-full bg-secondary/50 rounded-full h-2.5">
                  <div 
                    className="bg-accent h-2.5 rounded-full" 
                    style={{ width: `${Math.min(100, (category.value / totalProducts) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-elegant">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary">Statistiques Globales</h3>
              <Activity className="h-5 w-5 text-accent" />
            </div>
            <p className="text-sm text-muted-foreground">Vue d'ensemble des performances</p>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-soft p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Taux de conversion</p>
                <p className="text-2xl font-bold text-primary">
                  {totalProducts > 0 ? ((totalOrders / totalProducts) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <div className="bg-soft p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Valeur moyenne</p>
                <p className="text-2xl font-bold text-primary">
                  {totalOrders > 0 ? '42.50 DA' : '0 DA'}
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Performance mensuelle</h4>
              <div className="flex items-center">
                <div className="flex-1 bg-secondary/50 h-4 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent/70 to-accent"
                    style={{ width: `${Math.min(100, (totalOrders / (totalProducts || 1)) * 100)}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm text-muted-foreground">{Math.min(100, (totalOrders / (totalProducts || 1)) * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;
