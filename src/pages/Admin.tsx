
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Home, LayoutDashboard, Users, Database, ShoppingCart, Shield } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ProductManager from '@/components/admin/ProductManager';
import SlideManager from '@/components/admin/SlideManager';
import SiteSettingsManager from '@/components/admin/settings/SiteSettingsManager';
import StatisticsPanel from '@/components/admin/statistics/StatisticsPanel';
import PromoCodeManager from '@/components/admin/promo/PromoCodeManager';
import MarketingNotificationManager from '@/components/admin/marketing/MarketingNotificationManager';
import UserManager from '@/components/admin/users/UserManager';
import BackupManager from '@/components/admin/backup/BackupManager';
import OrderManager from '@/components/admin/orders/OrderManager';
import RLSChecker from '@/components/admin/security/RLSChecker';
import { useAdminCheck } from '@/hooks/useAdminCheck';

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
  const { isAdmin, isLoading } = useAdminCheck();

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

  // Afficher un message de chargement pendant la vérification des droits d'admin avec effets 3D
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center perspective-container bg-gradient-to-br from-primary-50 via-accent-50 to-purple-50 relative overflow-hidden">
        {/* Particules flottantes pendant le chargement */}
        <div className="absolute inset-0 particle-field">
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-accent-400 rounded-full animate-parallax opacity-60"></div>
          <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-purple-400 rounded-full animate-parallax opacity-40" style={{ animationDelay: '3s' }}></div>
          <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-pink-400 rounded-full animate-parallax opacity-50" style={{ animationDelay: '6s' }}></div>
        </div>
        
        <div className="text-center card-modern hover-lift neon-glow">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-accent mx-auto mb-6 pulse-3d"></div>
          <p className="text-accent gradient-text text-lg font-semibold">Vérification des droits d'administration...</p>
          
          {/* Effet holographique */}
          <div className="absolute inset-0 holographic opacity-20 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas admin, afficher un message d'erreur avec effets 3D
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center perspective-container bg-gradient-to-br from-error-50 to-primary-50 relative overflow-hidden">
        {/* Particules d'erreur */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/5 w-2 h-2 bg-error-400 rounded-full animate-parallax opacity-50"></div>
          <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-error-300 rounded-full animate-parallax opacity-30" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="text-center card-modern hover-lift border-error-200 shadow-modern">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-error-500 to-error-600 rounded-full mx-auto flex items-center justify-center pulse-3d">
              <Shield className="h-8 w-8 text-white animate-pulse" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-error-600 mb-4 gradient-text">Accès refusé</h1>
          <p className="mb-6 text-primary-600">Vous n'avez pas les droits d'accès à cette page.</p>
          <Button asChild className="btn-modern ripple-effect">
            <Link to="/">Retour à l'accueil</Link>
          </Button>
          
          {/* Effet holographique d'erreur */}
          <div className="absolute inset-0 holographic opacity-10 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50 to-accent-50 relative overflow-hidden perspective-container">
      {/* Éléments décoratifs d'arrière-plan avec effets 3D avancés */}
      <div className="absolute inset-0 overflow-hidden particle-field">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-br from-accent-200/20 to-purple-200/20 rounded-full blur-3xl animate-float floating-element"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gradient-to-br from-pink-200/20 to-accent-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        
        {/* Éléments géométriques flottants */}
        <div className="absolute top-1/5 left-1/6 w-20 h-20 bg-gradient-to-r from-accent-400/15 to-purple-400/15 rounded-xl animate-tilt rotating-element"></div>
        <div className="absolute bottom-1/4 right-1/5 w-16 h-16 bg-gradient-to-r from-pink-400/15 to-accent-400/15 rounded-full animate-morph pulse-3d"></div>
        
        {/* Particules lumineuses multiples */}
        <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-accent-400 rounded-full animate-parallax opacity-60"></div>
        <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-purple-400 rounded-full animate-parallax opacity-40" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-pink-400 rounded-full animate-parallax opacity-50" style={{ animationDelay: '8s' }}></div>
        <div className="absolute bottom-1/3 right-1/2 w-2 h-2 bg-accent-500 rounded-full animate-parallax opacity-45" style={{ animationDelay: '12s' }}></div>
      </div>

      {/* Couche holographique globale */}
      <div className="absolute inset-0 holographic opacity-20"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center hover-lift">
            <div className="bg-gradient-to-r from-accent-500/20 to-purple-500/20 p-4 rounded-xl mr-6 neon-glow pulse-3d">
              <LayoutDashboard className="h-8 w-8 text-accent animate-pulse" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold gradient-text hover-lift">
                Administration
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-accent-500 to-purple-500 rounded-full animate-glow"></div>
            </div>
          </div>
          <Button variant="outline" asChild className="shadow-modern border-accent/30 hover:bg-accent/10 ripple-effect hover-lift neon-glow">
            <Link to="/" className="flex items-center">
              <Home className="mr-2 h-5 w-5 animate-pulse" />
              Retour à l'accueil
            </Link>
          </Button>
        </div>
        
        <div className="card-modern shadow-modern border-accent/20 relative overflow-hidden">
          {/* Effet de brillance animé */}
          <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-pulse"></div>
          
          <Tabs defaultValue="statistics" className="w-full">
            <TabsList className="mb-8 w-full justify-start overflow-x-auto flex-nowrap whitespace-nowrap bg-gradient-to-r from-primary-100/50 to-accent-100/50 p-2 rounded-xl shadow-soft border border-accent/20">
              <TabsTrigger value="statistics" className="data-[state=active]:bg-white data-[state=active]:text-accent data-[state=active]:shadow-elegant hover-lift ripple-effect neon-glow">
                Statistiques
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-white data-[state=active]:text-accent data-[state=active]:shadow-elegant hover-lift ripple-effect">
                <Users className="h-4 w-4 mr-2 animate-pulse" />
                Utilisateurs
              </TabsTrigger>
              <TabsTrigger value="products" className="data-[state=active]:bg-white data-[state=active]:text-accent data-[state=active]:shadow-elegant hover-lift ripple-effect">
                Produits
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-white data-[state=active]:text-accent data-[state=active]:shadow-elegant hover-lift ripple-effect">
                <ShoppingCart className="h-4 w-4 mr-2 animate-pulse" />
                Commandes
              </TabsTrigger>
              <TabsTrigger value="slides" className="data-[state=active]:bg-white data-[state=active]:text-accent data-[state=active]:shadow-elegant hover-lift ripple-effect">
                Diaporama
              </TabsTrigger>
              <TabsTrigger value="promo" className="data-[state=active]:bg-white data-[state=active]:text-accent data-[state=active]:shadow-elegant hover-lift ripple-effect">
                Codes Promo
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-white data-[state=active]:text-accent data-[state=active]:shadow-elegant hover-lift ripple-effect">
                Notifications
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:text-accent data-[state=active]:shadow-elegant hover-lift ripple-effect">
                Gestion Logo
              </TabsTrigger>
              <TabsTrigger value="backup" className="data-[state=active]:bg-white data-[state=active]:text-accent data-[state=active]:shadow-elegant hover-lift ripple-effect">
                <Database className="h-4 w-4 mr-2 animate-pulse" />
                Sauvegardes
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-white data-[state=active]:text-accent data-[state=active]:shadow-elegant hover-lift ripple-effect pulse-3d">
                <Shield className="h-4 w-4 mr-2 animate-pulse" />
                Sécurité
              </TabsTrigger>
            </TabsList>

            <div className="mt-6 perspective-container">
              <TabsContent value="statistics" className="animate-fade-in hover-lift">
                <StatisticsPanel />
              </TabsContent>
              
              <TabsContent value="users" className="animate-fade-in hover-lift">
                <UserManager />
              </TabsContent>

              <TabsContent value="products" className="animate-fade-in hover-lift">
                <ProductManager products={products} onProductsChange={fetchProducts} />
              </TabsContent>

              <TabsContent value="orders" className="animate-fade-in hover-lift">
                <OrderManager />
              </TabsContent>

              <TabsContent value="slides" className="animate-fade-in hover-lift">
                <SlideManager slides={slides} onSlidesChange={fetchSlides} />
              </TabsContent>

              <TabsContent value="promo" className="animate-fade-in hover-lift">
                <PromoCodeManager />
              </TabsContent>
              
              <TabsContent value="notifications" className="animate-fade-in hover-lift">
                <MarketingNotificationManager />
              </TabsContent>

              <TabsContent value="settings" className="animate-fade-in hover-lift">
                <SiteSettingsManager />
              </TabsContent>
              
              <TabsContent value="backup" className="animate-fade-in hover-lift">
                <BackupManager />
              </TabsContent>
              
              <TabsContent value="security" className="animate-fade-in hover-lift">
                <RLSChecker />
              </TabsContent>
            </div>
          </Tabs>

          {/* Effets décoratifs supplémentaires */}
          <div className="absolute bottom-4 right-4 w-8 h-8 bg-gradient-to-r from-accent-400/30 to-purple-400/30 rounded-full animate-pulse-3d"></div>
          <div className="absolute top-4 left-4 w-6 h-6 bg-gradient-to-r from-pink-400/20 to-accent-400/20 rounded-lg animate-tilt"></div>
        </div>
      </div>

      {/* Effet de vague en bas avec animation */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/60 to-transparent pointer-events-none animate-glow"></div>
    </div>
  );
};

export default Admin;
