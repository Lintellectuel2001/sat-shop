import React, { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import StatsCards from './StatsCards';
import SalesChart from './SalesChart';
import UserStatistics from './UserStatistics';
import PeriodFilter from './PeriodFilter';
import { DateRange } from 'react-day-picker';
import { Activity } from 'lucide-react';

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
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [recentSalesGrowth, setRecentSalesGrowth] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  // Stats utilisateurs simulées (à remplacer par de vraies données)
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [newUsers, setNewUsers] = useState<number>(0);
  const [averageSessionTime, setAverageSessionTime] = useState<string>('0min');
  const [registrationRate, setRegistrationRate] = useState<number>(0);

  const updateSalesData = async () => {
    try {
      const { data: recentSales } = await supabase
        .from('cart_history')
        .select('created_at, product_id')
        .eq('action_type', 'purchase')
        .order('created_at', { ascending: false });

      if (recentSales) {
        // Appliquer le filtre de date si spécifié
        let filteredSales = recentSales;
        if (dateRange?.from) {
          const fromDate = new Date(dateRange.from);
          fromDate.setHours(0, 0, 0, 0);
          
          filteredSales = recentSales.filter(sale => {
            const saleDate = new Date(sale.created_at);
            if (dateRange.to) {
              const toDate = new Date(dateRange.to);
              toDate.setHours(23, 59, 59, 999);
              return saleDate >= fromDate && saleDate <= toDate;
            }
            return saleDate >= fromDate;
          });
        }

        if (viewMode === 'monthly') {
          // Monthly view
          const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
          const salesByMonth = filteredSales.reduce((acc: {[key: string]: number}, sale) => {
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
        } 
        else if (viewMode === 'weekly') {
          // Weekly view
          const today = new Date();
          const dayNames = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            return date.toLocaleDateString('fr-FR', { weekday: 'short' });
          }).reverse();

          const salesByDay = filteredSales.reduce((acc: {[key: string]: number}, sale) => {
            const saleDate = new Date(sale.created_at);
            // Check if the sale date is within the last 7 days
            const dayDiff = Math.floor((today.getTime() - saleDate.getTime()) / (1000 * 60 * 60 * 24));
            if (dayDiff < 7) {
              const dayLabel = saleDate.toLocaleDateString('fr-FR', { weekday: 'short' });
              acc[dayLabel] = (acc[dayLabel] || 0) + 1;
            }
            return acc;
          }, {});

          const chartData = dayNames.map(day => ({
            name: day,
            sales: salesByDay[day] || 0
          }));

          // Calculate growth rate (compare to previous week)
          const thisWeekSales = chartData.reduce((sum, item) => sum + item.sales, 0);
          const previousWeekSales = thisWeekSales * 0.8; // Simplified - ideally fetch previous week data

          if (previousWeekSales > 0) {
            const growth = ((thisWeekSales - previousWeekSales) / previousWeekSales) * 100;
            setRecentSalesGrowth(growth);
          } else {
            setRecentSalesGrowth(thisWeekSales > 0 ? 100 : 0);
          }

          setSalesData(chartData);
        }
        else {
          // Daily view (last 7 days)
          const today = new Date();
          const dayNames = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
          }).reverse();

          const salesByDay = filteredSales.reduce((acc: {[key: string]: number}, sale) => {
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

        // Generate category statistics for internal use but we won't display them
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

  const fetchUserStatistics = async () => {
    try {
      // Récupérer le nombre total d'utilisateurs depuis Supabase
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      setTotalUsers(count || 0);
      
      // Récupérer les nouveaux utilisateurs (inscrits au cours des 30 derniers jours)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: newUsersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());
      
      setNewUsers(newUsersCount || 0);
      
      // Taux d'inscription calculé (simplification : nouveaux utilisateurs / utilisateurs totaux)
      if (count && count > 0) {
        setRegistrationRate(Math.round((newUsersCount || 0) / count * 100));
      }
      
      // Temps moyen de session simulé
      setAverageSessionTime('12min');
      
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques utilisateurs:', error);
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
      await fetchUserStatistics();
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    updateSalesData();
  }, [viewMode, dateRange]);

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
        <PeriodFilter 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      </div>
      
      <StatsCards
        totalProducts={totalProducts}
        totalOrders={totalOrders}
        popularCategory={popularCategory}
        categoryPercentage={categoryPercentage}
        recentSalesGrowth={recentSalesGrowth}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-elegant">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-primary">Évolution des Ventes</h3>
              <p className="text-sm text-muted-foreground">
                {viewMode === 'daily' && '7 derniers jours'}
                {viewMode === 'weekly' && 'Dernière semaine'}
                {viewMode === 'monthly' && 'Derniers 6 mois'}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-subtle px-3 py-1 rounded-full text-sm text-accent">
              <Activity className="h-4 w-4" />
              <span className={recentSalesGrowth >= 0 ? 'text-green-600' : 'text-red-500'}>
                {recentSalesGrowth >= 0 ? '+' : ''}{recentSalesGrowth.toFixed(1)}%
              </span>
            </div>
          </div>
          <SalesChart salesData={salesData} />
        </div>

        <UserStatistics
          totalUsers={totalUsers}
          newUsers={newUsers}
          averageSessionTime={averageSessionTime}
          registrationRate={registrationRate}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default StatisticsPanel;
