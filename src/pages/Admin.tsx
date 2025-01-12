import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import ProductManager from '@/components/admin/ProductManager';
import SlideManager from '@/components/admin/SlideManager';

interface Slide {
  id: string;
  title: string;
  description?: string;
  image: string;
  color: string;
}

const Admin = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchSlides();
  }, []);

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
        </TabsList>

        <TabsContent value="products">
          <ProductManager />
        </TabsContent>

        <TabsContent value="slides">
          <SlideManager slides={slides} onSlidesChange={fetchSlides} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;