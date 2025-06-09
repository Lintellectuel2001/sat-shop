
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import StatisticsPanel from '@/components/admin/statistics/StatisticsPanel';
import UserManager from '@/components/admin/users/UserManager';
import ProductManager from '@/components/admin/ProductManager';
import OrderManager from '@/components/admin/orders/OrderManager';
import SlideManager from '@/components/admin/SlideManager';
import PromoCodeManager from '@/components/admin/promo/PromoCodeManager';
import MarketingNotificationManager from '@/components/admin/marketing/MarketingNotificationManager';
import SiteSettingsManager from '@/components/admin/settings/SiteSettingsManager';
import BackupManager from '@/components/admin/backup/BackupManager';
import RLSChecker from '@/components/admin/security/RLSChecker';

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

interface AdminTabsContentProps {
  products: Product[];
  slides: Slide[];
  onProductsChange: () => void;
  onSlidesChange: () => void;
}

const AdminTabsContent: React.FC<AdminTabsContentProps> = ({
  products,
  slides,
  onProductsChange,
  onSlidesChange
}) => {
  return (
    <div className="mt-4">
      <TabsContent value="statistics">
        <StatisticsPanel />
      </TabsContent>
      
      <TabsContent value="users">
        <UserManager />
      </TabsContent>

      <TabsContent value="products">
        <ProductManager products={products} onProductsChange={onProductsChange} />
      </TabsContent>

      <TabsContent value="orders">
        <OrderManager />
      </TabsContent>

      <TabsContent value="slides">
        <SlideManager slides={slides} onSlidesChange={onSlidesChange} />
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
      
      <TabsContent value="backup">
        <BackupManager />
      </TabsContent>
      
      <TabsContent value="security">
        <RLSChecker />
      </TabsContent>
    </div>
  );
};

export default AdminTabsContent;
