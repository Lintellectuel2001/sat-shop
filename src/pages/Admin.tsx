
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Home, LayoutDashboard } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ProductManager from '@/components/admin/ProductManager';
import SlideManager from '@/components/admin/SlideManager';
import SiteSettingsManager from '@/components/admin/settings/SiteSettingsManager';
import StatisticsPanel from '@/components/admin/statistics/StatisticsPanel';
import PromoCodeManager from '@/components/admin/promo/PromoCodeManager';
import MarketingNotificationManager from '@/components/admin/marketing/MarketingNotificationManager';

interface Product {
  id: string;
  name: string;
  price: string;
  description?: string;
  image: string;
  category: string;
  features?: string[];
  payment_link: string;
}

interface Slide {
  id: string;
  title: string;
  description?: string;
  image: string;
  color: string;
  text_color?: string;
  order: number;
}

const Admin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
    fetchSlides();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les produits",
        });
        return;
      }
      
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement des produits",
      });
    }
  };

  const fetchSlides = async () => {
    const { data, error } = await supabase
      .from('slides')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les slides",
      });
      return;
    }
    
    setSlides(data || []);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-secondary/10">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center">
            <div className="bg-accent/10 p-3 rounded-lg mr-4">
              <LayoutDashboard className="h-6 w-6 text-accent" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Administration
            </h1>
          </div>
          <Button variant="outline" asChild className="shadow-sm border-accent/20 hover:bg-accent/5">
            <Link to="/" className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Link>
          </Button>
        </div>
        
        <div className="bg-white rounded-xl shadow-elegant p-6 mb-8">
          <Tabs defaultValue="statistics" className="w-full">
            <TabsList className="mb-6 w-full justify-start overflow-x-auto flex-nowrap whitespace-nowrap bg-secondary/50 p-1 rounded-lg">
              <TabsTrigger value="statistics" className="data-[state=active]:bg-white data-[state=active]:text-accent">Statistiques</TabsTrigger>
              <TabsTrigger value="products" className="data-[state=active]:bg-white data-[state=active]:text-accent">Produits</TabsTrigger>
              <TabsTrigger value="slides" className="data-[state=active]:bg-white data-[state=active]:text-accent">Diaporama</TabsTrigger>
              <TabsTrigger value="promo" className="data-[state=active]:bg-white data-[state=active]:text-accent">Codes Promo</TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-white data-[state=active]:text-accent">Notifications</TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:text-accent">Gestion Logo</TabsTrigger>
            </TabsList>

            <div className="mt-4">
              <TabsContent value="statistics">
                <StatisticsPanel />
              </TabsContent>

              <TabsContent value="products">
                <ProductManager products={products} onProductsChange={fetchProducts} />
              </TabsContent>

              <TabsContent value="slides">
                <SlideManager slides={slides} onSlidesChange={fetchSlides} />
              </TabsContent>

              <TabsContent value="promo">
                <PromoCodeManager />
              </TabsContent>
              
              <TabsContent value="notifications">
                <MarketingNotificationManager />
              </TabsContent>

              <TabsContent value="settings">
                <SiteSettingsManager />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
