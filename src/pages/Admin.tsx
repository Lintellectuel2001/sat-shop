import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import ProductManager from '@/components/admin/ProductManager';
import SlideManager from '@/components/admin/SlideManager';
import SiteSettingsManager from '@/components/admin/settings/SiteSettingsManager';

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
      .select('*');
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les slides",
      });
      return;
    }
    
    setSlides(data);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Panneau d'Administration</h1>
      
      <Tabs defaultValue="products">
        <TabsList className="mb-6">
          <TabsTrigger value="products">Produits</TabsTrigger>
          <TabsTrigger value="slides">Diaporama</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ProductManager products={products} onProductsChange={fetchProducts} />
        </TabsContent>

        <TabsContent value="slides">
          <SlideManager slides={slides} onSlidesChange={fetchSlides} />
        </TabsContent>

        <TabsContent value="settings">
          <SiteSettingsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;