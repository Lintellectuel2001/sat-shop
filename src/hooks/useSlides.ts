import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Slide {
  id: string;
  title: string;
  description?: string;
  image: string;
  color: string;
}

export const useSlides = () => {
  const queryClient = useQueryClient();

  const { data: slides = [], isLoading, error } = useQuery({
    queryKey: ['slides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('slides')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Slide[];
    },
  });

  const invalidateSlides = () => {
    queryClient.invalidateQueries({ queryKey: ['slides'] });
  };

  return {
    slides,
    isLoading,
    error,
    invalidateSlides,
  };
};