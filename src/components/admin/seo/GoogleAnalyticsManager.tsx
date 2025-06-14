
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Save, BarChart3, Eye, TrendingUp, Code } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const GoogleAnalyticsManager = () => {
  const [settings, setSettings] = useState({
    ga_tracking_id: '',
    gtag_tracking_id: '',
    is_enabled: false,
    track_ecommerce: false,
    track_scroll: false,
    track_downloads: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { data: analyticsSettings, refetch } = useQuery({
    queryKey: ['analytics-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  React.useEffect(() => {
    if (analyticsSettings) {
      setSettings({
        ga_tracking_id: analyticsSettings.ga_tracking_id || '',
        gtag_tracking_id: analyticsSettings.gtag_tracking_id || '',
        is_enabled: analyticsSettings.is_enabled || false,
        track_ecommerce: analyticsSettings.track_ecommerce || false,
        track_scroll: analyticsSettings.track_scroll || false,
        track_downloads: analyticsSettings.track_downloads || false,
      });
    }
  }, [analyticsSettings]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('analytics_settings')
        .upsert([settings], { onConflict: 'id' });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Paramètres Google Analytics sauvegardés",
      });

      refetch();
    } catch (error: any) {
      console.error('Error saving analytics settings:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateTrackingCode = () => {
    if (!settings.gtag_tracking_id) return '';

    return `<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${settings.gtag_tracking_id}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${settings.gtag_tracking_id}', {
    page_title: document.title,
    page_location: window.location.href
  });
  
  ${settings.track_ecommerce ? `
  // E-commerce tracking
  gtag('event', 'purchase', {
    transaction_id: 'ORDER_ID',
    value: 0.00,
    currency: 'DZD',
    items: []
  });` : ''}
  
  ${settings.track_scroll ? `
  // Scroll tracking
  let scrolled = false;
  window.addEventListener('scroll', function() {
    if (!scrolled && window.scrollY > document.body.scrollHeight * 0.5) {
      gtag('event', 'scroll', {
        event_category: 'engagement',
        event_label: '50% scroll'
      });
      scrolled = true;
    }
  });` : ''}
</script>`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Configuration Google Analytics</h3>
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Configuration de base
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">ID de suivi Google Analytics (GA4)</label>
              <Input
                placeholder="G-XXXXXXXXXX"
                value={settings.gtag_tracking_id}
                onChange={(e) => setSettings({ ...settings, gtag_tracking_id: e.target.value })}
              />
              <p className="text-xs text-gray-600">
                Format : G-XXXXXXXXXX (pour Google Analytics 4)
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">ID Universal Analytics (optionnel)</label>
              <Input
                placeholder="UA-XXXXXXXX-X"
                value={settings.ga_tracking_id}
                onChange={(e) => setSettings({ ...settings, ga_tracking_id: e.target.value })}
              />
              <p className="text-xs text-gray-600">
                Format : UA-XXXXXXXX-X (ancienne version)
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Activer le suivi</label>
                <p className="text-xs text-gray-600">Activer/désactiver Google Analytics</p>
              </div>
              <Switch
                checked={settings.is_enabled}
                onCheckedChange={(checked) => setSettings({ ...settings, is_enabled: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Options de suivi avancées
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Suivi E-commerce</label>
                <p className="text-xs text-gray-600">Suivre les ventes et conversions</p>
              </div>
              <Switch
                checked={settings.track_ecommerce}
                onCheckedChange={(checked) => setSettings({ ...settings, track_ecommerce: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Suivi du scroll</label>
                <p className="text-xs text-gray-600">Mesurer l'engagement utilisateur</p>
              </div>
              <Switch
                checked={settings.track_scroll}
                onCheckedChange={(checked) => setSettings({ ...settings, track_scroll: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Suivi des téléchargements</label>
                <p className="text-xs text-gray-600">Suivre les clics sur fichiers</p>
              </div>
              <Switch
                checked={settings.track_downloads}
                onCheckedChange={(checked) => setSettings({ ...settings, track_downloads: checked })}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            État du suivi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${settings.is_enabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="font-medium">Statut général</span>
              </div>
              <p className="text-sm text-gray-600">
                {settings.is_enabled ? 'Actif' : 'Inactif'}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${settings.gtag_tracking_id ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="font-medium">Configuration</span>
              </div>
              <p className="text-sm text-gray-600">
                {settings.gtag_tracking_id ? 'Configuré' : 'ID manquant'}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${settings.track_ecommerce ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="font-medium">E-commerce</span>
              </div>
              <p className="text-sm text-gray-600">
                {settings.track_ecommerce ? 'Activé' : 'Désactivé'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {settings.gtag_tracking_id && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Code de suivi généré
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={generateTrackingCode()}
              readOnly
              className="h-64 font-mono text-xs"
              placeholder="Le code de suivi apparaîtra ici..."
            />
            <p className="text-sm text-gray-600 mt-2">
              Ce code sera automatiquement intégré à votre site web.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Instructions de configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">1. Créer un compte Google Analytics</p>
            <p className="text-sm text-gray-600">
              Rendez-vous sur <code>analytics.google.com</code> et créez une propriété GA4.
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">2. Récupérer l'ID de suivi</p>
            <p className="text-sm text-gray-600">
              Dans Google Analytics, allez dans Administration → Flux de données → Votre site web.
              Copiez l'ID de mesure (format G-XXXXXXXXXX).
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">3. Configurer les événements</p>
            <p className="text-sm text-gray-600">
              Activez le suivi e-commerce pour mesurer les ventes et conversions de votre boutique IPTV.
            </p>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 Les données apparaîtront dans Google Analytics sous 24-48h après activation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleAnalyticsManager;
