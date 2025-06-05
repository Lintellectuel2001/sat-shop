
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, ShoppingCart, Database, Shield } from 'lucide-react';

const AdminTabsList = () => {
  return (
    <TabsList className="mb-6 w-full justify-start overflow-x-auto flex-nowrap whitespace-nowrap bg-secondary/50 p-1 rounded-lg">
      <TabsTrigger value="statistics" className="data-[state=active]:bg-white data-[state=active]:text-accent">
        Statistiques
      </TabsTrigger>
      <TabsTrigger value="users" className="data-[state=active]:bg-white data-[state=active]:text-accent">
        <Users className="h-4 w-4 mr-1" />
        Utilisateurs
      </TabsTrigger>
      <TabsTrigger value="products" className="data-[state=active]:bg-white data-[state=active]:text-accent">
        Produits
      </TabsTrigger>
      <TabsTrigger value="orders" className="data-[state=active]:bg-white data-[state=active]:text-accent">
        <ShoppingCart className="h-4 w-4 mr-1" />
        Commandes
      </TabsTrigger>
      <TabsTrigger value="slides" className="data-[state=active]:bg-white data-[state=active]:text-accent">
        Diaporama
      </TabsTrigger>
      <TabsTrigger value="promo" className="data-[state=active]:bg-white data-[state=active]:text-accent">
        Codes Promo
      </TabsTrigger>
      <TabsTrigger value="notifications" className="data-[state=active]:bg-white data-[state=active]:text-accent">
        Notifications
      </TabsTrigger>
      <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:text-accent">
        Gestion Logo
      </TabsTrigger>
      <TabsTrigger value="backup" className="data-[state=active]:bg-white data-[state=active]:text-accent">
        <Database className="h-4 w-4 mr-1" />
        Sauvegardes
      </TabsTrigger>
      <TabsTrigger value="security" className="data-[state=active]:bg-white data-[state=active]:text-accent">
        <Shield className="h-4 w-4 mr-1" />
        Sécurité
      </TabsTrigger>
    </TabsList>
  );
};

export default AdminTabsList;
