
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Download, RefreshCw, FileText, Calendar } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";

const SitemapGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [sitemap, setSitemap] = useState('');
  const { toast } = useToast();

  const { data: products } = useQuery({
    queryKey: ['products-for-sitemap'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, created_at, updated_at')
        .eq('is_available', true);

      if (error) throw error;
      return data;
    },
  });

  const generateSitemap = async () => {
    setIsGenerating(true);
    try {
      const baseUrl = window.location.origin;
      const currentDate = new Date().toISOString().split('T')[0];
      
      let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Page d'accueil -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Pages principales -->
  <url>
    <loc>${baseUrl}/marketplace</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/cart</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
`;

      // Ajouter les produits
      if (products) {
        products.forEach(product => {
          const lastMod = product.updated_at || product.created_at;
          const formattedDate = new Date(lastMod).toISOString().split('T')[0];
          
          sitemapXml += `  <url>
    <loc>${baseUrl}/product/${product.id}</loc>
    <lastmod>${formattedDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
        });
      }

      sitemapXml += `</urlset>`;
      
      setSitemap(sitemapXml);
      
      toast({
        title: "Succès",
        description: `Sitemap généré avec ${products?.length || 0} produits`,
      });
      
    } catch (error: any) {
      console.error('Error generating sitemap:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer le sitemap",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadSitemap = () => {
    if (!sitemap) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Aucun sitemap à télécharger. Générez-en un d'abord.",
      });
      return;
    }

    const blob = new Blob([sitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Succès",
      description: "Sitemap téléchargé avec succès",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Générateur de Sitemap</h3>
        <div className="flex gap-2">
          <Button onClick={generateSitemap} disabled={isGenerating}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Génération...' : 'Générer Sitemap'}
          </Button>
          {sitemap && (
            <Button variant="outline" onClick={downloadSitemap}>
              <Download className="mr-2 h-4 w-4" />
              Télécharger
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Informations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Pages incluses :</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Page d'accueil (priorité 1.0)</li>
                <li>• Marketplace (priorité 0.8)</li>
                <li>• Contact (priorité 0.6)</li>
                <li>• Panier (priorité 0.5)</li>
                <li>• {products?.length || 0} produits (priorité 0.7)</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Fréquences de mise à jour :</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Accueil : quotidienne</li>
                <li>• Marketplace : hebdomadaire</li>
                <li>• Produits : hebdomadaire</li>
                <li>• Autres pages : mensuelle</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <Calendar className="inline h-4 w-4 mr-1" />
                Le sitemap est généré automatiquement avec les dates de dernière modification.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions d'installation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">1. Télécharger le sitemap</p>
              <p className="text-sm text-gray-600">
                Cliquez sur "Télécharger" pour récupérer le fichier sitemap.xml
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">2. Uploader sur votre serveur</p>
              <p className="text-sm text-gray-600">
                Placez le fichier à la racine de votre site web : <code>votresite.com/sitemap.xml</code>
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">3. Soumettre à Google</p>
              <p className="text-sm text-gray-600">
                Ajoutez l'URL du sitemap dans Google Search Console
              </p>
            </div>

            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-800">
                💡 Régénérez le sitemap après chaque ajout/modification de produit.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {sitemap && (
        <Card>
          <CardHeader>
            <CardTitle>Aperçu du Sitemap</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={sitemap}
              readOnly
              className="h-64 font-mono text-xs"
              placeholder="Le sitemap apparaîtra ici..."
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SitemapGenerator;
