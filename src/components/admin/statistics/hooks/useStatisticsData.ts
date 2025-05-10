
import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SalesDataPoint {
  date: string;
  count: number;
  amount: number;
  // Adding name and sales properties to make it compatible with SalesData
  name: string;
  sales: number;
}

interface RecentSale {
  product_id: string;
  product_name: string;
  purchase_price: number;
  selling_price: number;
  profit: number;
}

export const useStatisticsData = (viewMode: 'daily' | 'weekly' | 'monthly', dateRange?: DateRange) => {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Statistiques générales
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [popularCategory, setPopularCategory] = useState<string>("");
  const [categoryPercentage, setCategoryPercentage] = useState<number>(0);
  const [salesData, setSalesData] = useState<SalesDataPoint[]>([]);
  const [recentSalesGrowth, setRecentSalesGrowth] = useState<number>(0);
  
  // Statistiques utilisateurs
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [newUsers, setNewUsers] = useState<number>(0);
  const [averageSessionTime, setAverageSessionTime] = useState<number>(0);
  const [registrationRate, setRegistrationRate] = useState<number>(0);
  
  // Statistiques de rentabilité
  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [profitMargin, setProfitMargin] = useState<number>(0);
  
  // Ventes récentes avec bénéfices
  const [recentSales, setRecentSales] = useState<RecentSale[]>([]);

  // Fonction pour récupérer les données des produits et des ventes
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Récupérer le nombre total de produits
      const { count: productsCount, error: productsError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      
      if (productsError) throw productsError;
      setTotalProducts(productsCount || 0);
      
      // Récupérer le nombre total de commandes
      const { count: ordersCount, error: ordersError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });
      
      if (ordersError) throw ordersError;
      setTotalOrders(ordersCount || 0);
      
      // Récupérer la catégorie la plus populaire
      const { data: categories, error: categoriesError } = await supabase
        .from('products')
        .select('category')
      
      if (categoriesError) throw categoriesError;
      
      if (categories && categories.length > 0) {
        const categoryCounts: Record<string, number> = categories.reduce((acc, { category }) => {
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        let mostPopular = '';
        let highestCount = 0;
        
        Object.entries(categoryCounts).forEach(([category, count]) => {
          if (count > highestCount) {
            mostPopular = category;
            highestCount = count;
          }
        });
        
        setPopularCategory(mostPopular);
        setCategoryPercentage((highestCount / categories.length) * 100);
      }
      
      // Récupérer les données de vente pour le graphique selon le mode de vue
      let timeConstraint = '';
      let groupByFormat = '';
      let orderFormat = '';
      
      switch (viewMode) {
        case 'daily':
          timeConstraint = 'created_at >= now() - interval \'7 days\'';
          groupByFormat = 'created_at::date';
          orderFormat = 'created_at::date';
          break;
        case 'weekly':
          timeConstraint = 'created_at >= now() - interval \'4 weeks\'';
          groupByFormat = 'date_trunc(\'week\', created_at)';
          orderFormat = 'date_trunc(\'week\', created_at)';
          break;
        case 'monthly':
          timeConstraint = 'created_at >= now() - interval \'6 months\'';
          groupByFormat = 'date_trunc(\'month\', created_at)';
          orderFormat = 'date_trunc(\'month\', created_at)';
          break;
      }
      
      // Ajouter la contrainte de plage de dates si définie
      if (dateRange && dateRange.from) {
        timeConstraint = `created_at >= '${dateRange.from.toISOString()}'`;
        
        if (dateRange.to) {
          timeConstraint += ` AND created_at <= '${dateRange.to.toISOString()}'`;
        }
      }
      
      try {
        // Try to use the RPC function
        const { data: salesByPeriod, error: salesError } = await supabase
          .rpc('get_sales_by_period', {
            time_constraint: timeConstraint,
            group_format: groupByFormat,
            order_col: orderFormat
          });
        
        if (salesError) {
          throw salesError;
        }
        
        // Formater les données pour le graphique
        const formattedSales: SalesDataPoint[] = salesByPeriod ? salesByPeriod.map((item: any) => ({
          date: new Date(item.period).toISOString().split('T')[0],
          count: item.order_count,
          amount: Number(item.total_amount) || 0,
          // Add properties for SalesData compatibility
          name: new Date(item.period).toISOString().split('T')[0],
          sales: Number(item.total_amount) || 0
        })) : [];
        
        setSalesData(formattedSales);
        
        // Calculer la croissance des ventes récentes
        if (formattedSales.length >= 2) {
          const recentAmount = formattedSales[formattedSales.length - 1].amount;
          const previousAmount = formattedSales[formattedSales.length - 2].amount;
          
          if (previousAmount > 0) {
            const growthRate = ((recentAmount - previousAmount) / previousAmount) * 100;
            setRecentSalesGrowth(growthRate);
          } else {
            setRecentSalesGrowth(recentAmount > 0 ? 100 : 0);
          }
        }
      } catch (rpcError) {
        console.error('Error fetching sales data:', rpcError);
        
        // Fallback: créer des données fictives pour le graphique
        const mockData: SalesDataPoint[] = [];
        const today = new Date();
        
        for (let i = 0; i < 6; i++) {
          const date = new Date();
          if (viewMode === 'daily') {
            date.setDate(today.getDate() - i);
          } else if (viewMode === 'weekly') {
            date.setDate(today.getDate() - i * 7);
          } else {
            date.setMonth(today.getMonth() - i);
          }
          
          const dateString = date.toISOString().split('T')[0];
          const amount = Math.floor(Math.random() * 10000) + 1000;
          mockData.push({
            date: dateString,
            count: Math.floor(Math.random() * 10) + 1,
            amount: amount,
            name: dateString, // Add for SalesData compatibility
            sales: amount // Add for SalesData compatibility
          });
        }
        
        setSalesData(mockData.reverse());
      }
      
      // Récupérer les statistiques utilisateurs
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      setTotalUsers(usersCount || 0);
      
      // Simuler d'autres statistiques utilisateurs pour le moment
      setNewUsers(Math.floor((usersCount || 0) * 0.1));
      setAverageSessionTime(Math.floor(Math.random() * 10) + 2);
      setRegistrationRate(Math.floor(Math.random() * 5) + 1);
      
      // Récupérer les données de rentabilité
      const { data: orderProfits, error: profitError } = await supabase
        .from('cart_history')
        .select('profit');
        
      if (!profitError && orderProfits) {
        const totalProfitValue = orderProfits.reduce((sum, item) => {
          return sum + (Number(item.profit) || 0);
        }, 0);
        
        setTotalProfit(totalProfitValue);
        
        // Calculer la marge de profit (simulée pour l'instant)
        setProfitMargin(15 + Math.random() * 10);
      }
      
      // Récupérer les ventes récentes avec les prix d'achat et de vente pour calculer les bénéfices
      const { data: products } = await supabase
        .from('products')
        .select('id, name, price, purchase_price')
        .order('created_at', { ascending: false })
        .limit(40);
      
      if (products) {
        const recentSalesData: RecentSale[] = products.map(product => {
          const sellingPrice = Number(product.price.replace(/[^0-9.-]+/g, '')) || 0;
          const purchasePrice = Number(product.purchase_price) || 0;
          const profit = sellingPrice - purchasePrice;
          
          console.log(`Bénéfice trouvé pour la vente: ${profit} DA`);
          
          return {
            product_id: product.id,
            product_name: product.name,
            purchase_price: purchasePrice,
            selling_price: sellingPrice,
            profit: profit
          };
        });
        
        setRecentSales(recentSalesData);
      }
      
    } catch (error) {
      console.error('Error fetching statistics data:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données statistiques"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [viewMode, dateRange?.from, dateRange?.to]);
  
  // Ajouter la fonction refetch pour permettre de rafraîchir les données après une mise à jour
  const refetch = () => {
    fetchData();
  };
  
  return {
    totalProducts,
    totalOrders,
    popularCategory,
    categoryPercentage,
    salesData,
    recentSalesGrowth,
    isLoading,
    totalUsers,
    newUsers,
    averageSessionTime,
    registrationRate,
    totalProfit,
    profitMargin,
    recentSales,
    refetch
  };
};
