
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { handleImageUpload } from "@/utils/fileUpload";

interface SiteSettings {
  id: string;
  logo_url: string;
  logo_text: string;
}

const SiteSettingsManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { data: settings, refetch } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error) throw error;
      return data as SiteSettings;
    },
  });

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const logoUrl = await handleImageUpload(file);
      
      const { error } = await supabase
        .from('site_settings')
        .update({ logo_url: logoUrl })
        .eq('id', settings?.id);

      if (error) throw error;

      toast({
        title: "Logo mis à jour",
        description: "Le logo a été mis à jour avec succès",
      });

      refetch();
    } catch (error: any) {
      console.error('Error updating logo:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le logo",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextUpdate = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ logo_text: newText })
        .eq('id', settings?.id);

      if (error) throw error;

      toast({
        title: "Texte mis à jour",
        description: "Le texte du logo a été mis à jour avec succès",
      });

      refetch();
    } catch (error: any) {
      console.error('Error updating logo text:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le texte du logo",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Gestion Logo</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Logo actuel</h3>
          <div className="flex items-center gap-4">
            <img 
              src={settings?.logo_url} 
              alt="Logo actuel" 
              className="h-12 w-auto"
            />
            <Button 
              variant="outline" 
              disabled={isLoading}
              className="relative"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="mr-2 h-4 w-4" />
              Changer le logo
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Texte du logo</h3>
          <Input
            defaultValue={settings?.logo_text}
            onChange={handleTextUpdate}
            placeholder="Entrez le texte du logo"
            className="max-w-md"
          />
        </div>
      </div>
    </div>
  );
};

export default SiteSettingsManager;
