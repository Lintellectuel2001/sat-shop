
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PromoCode {
  id: string;
  code: string;
  discount_percentage?: number;
  discount_amount?: number;
  minimum_purchase?: number;
}

export const usePromoCode = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [promoCode, setPromoCode] = useState<PromoCode | null>(null);
  const { toast } = useToast();

  const validatePromoCode = async (code: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error) {
        toast({
          title: "Erreur",
          description: "Code promo invalide",
          variant: "destructive",
        });
        return null;
      }

      if (data) {
        const now = new Date();
        const startDate = data.start_date ? new Date(data.start_date) : null;
        const endDate = data.end_date ? new Date(data.end_date) : null;

        if ((startDate && now < startDate) || (endDate && now > endDate)) {
          toast({
            title: "Code expiré",
            description: "Ce code promo n'est plus valide",
            variant: "destructive",
          });
          return null;
        }

        if (data.max_uses && data.current_uses >= data.max_uses) {
          toast({
            title: "Code épuisé",
            description: "Ce code promo a atteint son nombre maximum d'utilisations",
            variant: "destructive",
          });
          return null;
        }

        setPromoCode(data);
        toast({
          title: "Succès",
          description: "Code promo appliqué avec succès",
        });
        return data;
      }
    } catch (error) {
      console.error('Error validating promo code:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la validation du code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    promoCode,
    validatePromoCode,
  };
};
