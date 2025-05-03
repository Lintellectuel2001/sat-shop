
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SiteSettings {
  logo_url: string;
  logo_text: string;
}

export const useSiteSettings = () => {
  const [data, setData] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const { data: settingsData, error: settingsError } = await supabase
          .from('site_settings')
          .select('*')
          .single();

        if (settingsError) {
          throw settingsError;
        }

        setData(settingsData as SiteSettings);
      } catch (err) {
        console.error('Error fetching site settings:', err);
        setError(err as Error);
        // Provide default values
        setData({
          logo_url: "/lovable-uploads/d7990538-4e18-4b76-bb29-4e16e74bf512.png",
          logo_text: "Sat-shop"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSiteSettings();
  }, []);

  return { data, isLoading, error };
};
