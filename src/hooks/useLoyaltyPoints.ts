
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LoyaltyPoints {
  points: number;
  lifetime_points: number;
}

interface LoyaltyTransaction {
  points: number;
  transaction_type: string;
  description: string;
  created_at: string;
}

export const useLoyaltyPoints = (userId?: string) => {
  const [points, setPoints] = useState<LoyaltyPoints | null>(null);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchLoyaltyPoints = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      // Utiliser maybeSingle() au lieu de single()
      let { data, error } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      // Si aucun enregistrement n'existe, on en crée un
      if (!data) {
        const { data: newData, error: insertError } = await supabase
          .from('loyalty_points')
          .insert([
            {
              user_id: userId,
              points: 0,
              lifetime_points: 0
            }
          ])
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        data = newData;
      }

      setPoints(data);
    } catch (error) {
      console.error('Error fetching loyalty points:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer vos points de fidélité",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactions = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('loyalty_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchLoyaltyPoints();
      fetchTransactions();
    }
  }, [userId]);

  return {
    points,
    transactions,
    isLoading,
    refreshPoints: fetchLoyaltyPoints,
    refreshTransactions: fetchTransactions,
  };
};
