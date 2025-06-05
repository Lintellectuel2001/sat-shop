
import React from 'react';
import { Tabs } from "@/components/ui/tabs";
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { useAdminData } from '@/hooks/useAdminData';
import AdminLoadingState from '@/components/admin/AdminLoadingState';
import AdminAccessDenied from '@/components/admin/AdminAccessDenied';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminTabsList from '@/components/admin/AdminTabsList';
import AdminTabsContent from '@/components/admin/AdminTabsContent';

const Admin = () => {
  const { isAdmin, isLoading } = useAdminCheck();
  const { products, slides, fetchProducts, fetchSlides } = useAdminData();

  // Afficher un message de chargement pendant la vérification des droits d'admin
  if (isLoading) {
    return <AdminLoadingState />;
  }

  // Si l'utilisateur n'est pas admin, afficher un message d'erreur
  if (!isAdmin) {
    return <AdminAccessDenied />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-secondary/10">
      <div className="container mx-auto px-4 py-8">
        <AdminHeader />
        
        <div className="bg-white rounded-xl shadow-elegant p-6 mb-8">
          <Tabs defaultValue="statistics" className="w-full">
            <AdminTabsList />
            <AdminTabsContent 
              products={products}
              slides={slides}
              onProductsChange={fetchProducts}
              onSlidesChange={fetchSlides}
            />
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
