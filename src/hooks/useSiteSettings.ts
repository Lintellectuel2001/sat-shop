
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SiteSettings {
  logo_url: string;
  logo_text: string;
}

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching site settings:', error);
        return {
          logo_url: "/lovable-uploads/d7990538-4e18-4b76-bb29-4e16e74bf512.png",
          logo_text: "Sat-shop"
        };
      }
      return data as SiteSettings;
    },
  });
};
