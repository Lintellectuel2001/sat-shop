import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductManager from '@/components/admin/ProductManager';
import SlideManager from '@/components/admin/SlideManager';

const Admin = () => {
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
          <SlideManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;