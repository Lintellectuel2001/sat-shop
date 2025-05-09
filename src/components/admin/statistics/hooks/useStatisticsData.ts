
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { DateRange } from 'react-day-picker';

// Type definitions
export interface SalesData {
  name: string;
  sales: number;
}

export interface CategoryData {
  name: string;
  value: number;
}

export interface RecentSale {
  id: string;
  product_name: string;
  product_id: string;
  created_at: string;
  purchase_price: number;
  selling_price: number;
  profit: number;
}

interface StatisticsData {
  totalProducts: number;
  totalOrders: number;
  popularCategory: string;
  categoryPercentage: number;
  salesData: SalesData[];
  categoriesData: CategoryData[];
  recentSalesGrowth: number;
  isLoading: boolean;
  totalUsers: number;
  newUsers: number;
  averageSessionTime: string;
  registrationRate: number;
  totalProfit: number;
  profitMargin: number;
  recentSales: RecentSale[];
}

export const useStatisticsData = (
  viewMode: 'daily' | 'weekly' | 'monthly',
  dateRange?: DateRange
) => {
  const [statistics, setStatistics] = useState<StatisticsData>({
    totalProducts: 0,
    totalOrders: 0,
    popularCategory: '',
    categoryPercentage: 0,
    salesData: [],
    categoriesData: [],
    recentSalesGrowth: 0,
    isLoading: true,
    totalUsers: 0,
    newUsers: 0,
    averageSessionTime: '0min',
    registrationRate: 0,
    totalProfit: 0,
    profitMargin: 0,
    recentSales: []
  });

  const fetchRecentSales = async () => {
    try {
      // Récupération des dernières ventes avec les bénéfices
      const { data: cartHistoryData, error } = await supabase
        .from('cart_history')
        .select('id, product_id, created_at, profit')
        .eq('action_type', 'purchase')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error("Erreur lors de la récupération des ventes récentes:", error);
        return [];
      }

      // Ensure cartHistoryData is an array before proceeding
      if (!cartHistoryData || !Array.isArray(cartHistoryData)) {
        console.error("Données d'historique de vente invalides:", cartHistoryData);
        return [];
      }

      // Récupérer les détails des produits pour ces ventes
      const recentSalesWithDetails = await Promise.all(
        cartHistoryData.map(async (sale) => {
          if (!sale?.product_id) {
            return {
              id: sale?.id || 'unknown-id',
              product_name: 'Produit inconnu',
              product_id: '',
              created_at: sale?.created_at || new Date().toISOString(),
              purchase_price: 0,
              selling_price: 0,
              profit: sale?.profit || 0
            };
          }

          // Récupérer les détails du produit
          const { data: productData } = await supabase
            .from('products')
            .select('name, price, purchase_price')
            .eq('id', sale.product_id)
            .single();

          if (productData) {
            const sellingPrice = parseFloat(productData.price.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
            const purchasePrice = productData.purchase_price || 0;

            return {
              id: sale.id,
              product_name: productData.name,
              product_id: sale.product_id,
              created_at: sale.created_at,
              purchase_price: purchasePrice,
              selling_price: sellingPrice,
              profit: typeof sale.profit !== 'undefined' ? sale.profit : (sellingPrice - purchasePrice)
            };
          }

          return {
            id: sale.id || 'not-found-id',
            product_name: 'Produit non trouvé',
            product_id: sale.product_id,
            created_at: sale.created_at,
            purchase_price: 0,
            selling_price: 0,
            profit: sale.profit || 0
          };
        })
      );

      return recentSalesWithDetails;
    } catch (error) {
      console.error("Erreur lors de la récupération des ventes récentes:", error);
      return [];
    }
  };

  const updateSalesData = async () => {
    try {
      // Récupération des ventes et calculs de bénéfices
      const { data: recentSales, error: recentSalesError } = await supabase
        .from('cart_history')
        .select('created_at, product_id, profit')
        .eq('action_type', 'purchase')
        .order('created_at', { ascending: false });

      if (recentSalesError) {
        console.error("Erreur lors de la récupération des ventes récentes:", recentSalesError);
        return;
      }

      // Récupérer tous les produits pour avoir les prix d'achat
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, price, purchase_price');

      if (productsError) {
        console.error("Erreur lors de la récupération des produits:", productsError);
        return;
      }

      let totalRevenue = 0;
      let totalCost = 0;
      
      if (recentSales && products) {
        // Créer un mapping des produits pour accès rapide
        const productMap = new Map();
        products.forEach(product => {
          productMap.set(product.id, {
            price: parseFloat(product.price.replace(/[^\d]/g, '')), 
            purchasePrice: product.purchase_price || 0
          });
        });

        // Appliquer le filtre de date si spécifié
        let filteredSales = recentSales;
        if (dateRange?.from) {
          const fromDate = new Date(dateRange.from);
          fromDate.setHours(0, 0, 0, 0);
          
          filteredSales = recentSales.filter(sale => {
            if (!sale?.created_at) return false;
            const saleDate = new Date(sale.created_at);
            if (dateRange.to) {
              const toDate = new Date(dateRange.to);
              toDate.setHours(23, 59, 59, 999);
              return saleDate >= fromDate && saleDate <= toDate;
            }
            return saleDate >= fromDate;
          });
        }

        // Calculer les revenus et coûts totaux
        filteredSales.forEach(sale => {
          if (sale?.product_id && productMap.has(sale.product_id)) {
            const productData = productMap.get(sale.product_id);
            totalRevenue += productData.price;
            totalCost += productData.purchasePrice;
            
            // Si le bénéfice est directement stocké, l'utiliser
            if (sale.profit !== undefined && sale.profit !== null) {
              // Pas besoin de calculer le bénéfice ici car il est déjà stocké
              console.log(`Bénéfice trouvé pour la vente: ${sale.profit} DA`);
            }
          }
        });

        // Calculer le bénéfice total et la marge
        const calculatedTotalProfit = totalRevenue - totalCost;
        
        let profitMarginCalc = 0;
        if (totalRevenue > 0) {
          profitMarginCalc = (calculatedTotalProfit / totalRevenue) * 100;
        }

        // Récupérer les ventes récentes avec détails
        const recentSalesData = await fetchRecentSales();

        let salesDataResult: SalesData[] = [];

        if (viewMode === 'monthly') {
          // Monthly view
          const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
          const salesByMonth = filteredSales.reduce((acc: {[key: string]: number}, sale) => {
            if (!sale?.created_at) return acc;
            const month = new Date(sale.created_at).getMonth();
            if (month < monthNames.length) {
              acc[monthNames[month]] = (acc[monthNames[month]] || 0) + 1;
            }
            return acc;
          }, {});

          salesDataResult = monthNames.map(month => ({
            name: month,
            sales: salesByMonth[month] || 0
          }));
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
            if (!sale?.created_at) return acc;
            const saleDate = new Date(sale.created_at);
            // Check if the sale date is within the last 7 days
            const dayDiff = Math.floor((today.getTime() - saleDate.getTime()) / (1000 * 60 * 60 * 24));
            if (dayDiff < 7) {
              const dayLabel = saleDate.toLocaleDateString('fr-FR', { weekday: 'short' });
              acc[dayLabel] = (acc[dayLabel] || 0) + 1;
            }
            return acc;
          }, {});

          salesDataResult = dayNames.map(day => ({
            name: day,
            sales: salesByDay[day] || 0
          }));
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
            if (!sale?.created_at) return acc;
            const saleDate = new Date(sale.created_at);
            // Check if the sale date is within the last 7 days
            const dayDiff = Math.floor((today.getTime() - saleDate.getTime()) / (1000 * 60 * 60 * 24));
            if (dayDiff < 7) {
              const dayLabel = saleDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
              acc[dayLabel] = (acc[dayLabel] || 0) + 1;
            }
            return acc;
          }, {});

          salesDataResult = dayNames.map(day => ({
            name: day,
            sales: salesByDay[day] || 0
          }));
        }

        // Calculate growth rate based on the view mode
        let recentSalesGrowthRate = 0;
        if (salesDataResult.length >= 2) {
          const lastPeriodSales = salesDataResult[salesDataResult.length - 1].sales;
          const previousPeriodSales = salesDataResult[salesDataResult.length - 2].sales;
          
          if (previousPeriodSales > 0) {
            recentSalesGrowthRate = ((lastPeriodSales - previousPeriodSales) / previousPeriodSales) * 100;
          } else {
            recentSalesGrowthRate = lastPeriodSales > 0 ? 100 : 0;
          }
        }

        // Generate category statistics
        const { data: productsByCategory } = await supabase
          .from('products')
          .select('category');

        let categoriesDataResult: CategoryData[] = [];
        if (productsByCategory && productsByCategory.length > 0) {
          const categoryCounts: {[key: string]: number} = {};
          
          productsByCategory.forEach(product => {
            if (product.category) {
              categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
            }
          });

          categoriesDataResult = Object.entries(categoryCounts).map(([name, value]) => ({
            name: name.toUpperCase(),
            value
          })).sort((a, b) => b.value - a.value);
        }

        setStatistics(prev => ({
          ...prev,
          salesData: salesDataResult,
          categoriesData: categoriesDataResult,
          recentSalesGrowth: prev.recentSalesGrowth,
          totalProfit: calculatedTotalProfit,
          profitMargin: profitMarginCalc,
          recentSales: recentSalesData,
          isLoading: false
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données de vente:', error);
      setStatistics(prev => ({ ...prev, isLoading: false }));
    }
  };

  const fetchUserStatistics = async () => {
    try {
      // Récupérer le nombre total d'utilisateurs depuis Supabase
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      const totalUsersCount = count || 0;
      
      // Récupérer les nouveaux utilisateurs (inscrits au cours des 30 derniers jours)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: newUsersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());
      
      const newUsersValue = newUsersCount || 0;
      
      // Taux d'inscription calculé
      let registrationRateValue = 0;
      if (totalUsersCount > 0) {
        registrationRateValue = Math.round((newUsersValue / totalUsersCount) * 100);
      }
      
      // Temps moyen de session simulé
      const averageSessionTimeValue = '12min';

      setStatistics(prev => ({
        ...prev,
        totalUsers: totalUsersCount,
        newUsers: newUsersValue,
        registrationRate: registrationRateValue,
        averageSessionTime: averageSessionTimeValue
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques utilisateurs:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      setStatistics(prev => ({ ...prev, isLoading: true }));
      console.log('Récupération des statistiques...');
      
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      
      console.log('Nombre total de produits:', productsCount);
      
      const { data: ordersData, error: ordersError } = await supabase
        .from('cart_history')
        .select('*')
        .eq('action_type', 'purchase');

      let totalOrderCount = 0;
      if (ordersError) {
        console.error('Erreur lors de la récupération des commandes:', ordersError);
      } else {
        totalOrderCount = ordersData?.length || 0;
        console.log('Nombre total de commandes trouvées:', totalOrderCount);
      }

      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('category');

      let popularCategoryName = '';
      let categoryPercentageValue = 0;

      if (productsError) {
        console.error('Erreur lors de la récupération des catégories:', productsError);
      } else if (products && products.length > 0) {
        const categoryCounts = products.reduce((acc: {[key: string]: number}, product) => {
          if (product.category) {
            acc[product.category] = (acc[product.category] || 0) + 1;
          }
          return acc;
        }, {});

        if (Object.keys(categoryCounts).length > 0) {
          const mostPopular = Object.entries(categoryCounts).reduce((a, b) => 
            categoryCounts[a[0]] > categoryCounts[b[0]] ? a : b
          );

          popularCategoryName = mostPopular[0].toUpperCase();
          categoryPercentageValue = (Number(mostPopular[1]) / products.length) * 100;
          categoryPercentageValue = Math.round(categoryPercentageValue);
        }
      }

      setStatistics(prev => ({
        ...prev,
        totalProducts: productsCount || 0,
        totalOrders: totalOrderCount,
        popularCategory: popularCategoryName,
        categoryPercentage: categoryPercentageValue
      }));

      await updateSalesData();
      await fetchUserStatistics();
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      setStatistics(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchStatistics();
    
    // Set up realtime subscription for cart_history changes (purchases)
    const cartChannel = supabase
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
          console.log('Nouvelle commande détectée pour les statistiques:', payload);
          await updateSalesData();
        }
      )
      .subscribe();
      
    // Set up realtime subscription for order status changes
    const orderChannel = supabase
      .channel('order-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: 'status=eq.validated'
        },
        async (payload) => {
          console.log('Commande validée détectée pour les statistiques:', payload);
          await updateSalesData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(cartChannel);
      supabase.removeChannel(orderChannel);
    };
  }, []);

  // Update sales data when view mode or date range changes
  useEffect(() => {
    updateSalesData();
  }, [viewMode, dateRange]);

  return { ...statistics, updateSalesData, fetchStatistics };
};
