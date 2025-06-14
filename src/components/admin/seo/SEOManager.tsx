
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, FileText, BarChart3, Target } from 'lucide-react';
import MetaDescriptionManager from './MetaDescriptionManager';
import SitemapGenerator from './SitemapGenerator';
import GoogleAnalyticsManager from './GoogleAnalyticsManager';
import KeywordTracker from './KeywordTracker';

const SEOManager = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-accent/10 p-3 rounded-lg">
          <Search className="h-6 w-6 text-accent" />
        </div>
        <h2 className="text-2xl font-semibold">SEO & Analytics</h2>
      </div>
      
      <Tabs defaultValue="meta" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="meta" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Méta Descriptions
          </TabsTrigger>
          <TabsTrigger value="sitemap" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Sitemap
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Google Analytics
          </TabsTrigger>
          <TabsTrigger value="keywords" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Mots-clés
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="meta">
            <MetaDescriptionManager />
          </TabsContent>

          <TabsContent value="sitemap">
            <SitemapGenerator />
          </TabsContent>

          <TabsContent value="analytics">
            <GoogleAnalyticsManager />
          </TabsContent>

          <TabsContent value="keywords">
            <KeywordTracker />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default SEOManager;
