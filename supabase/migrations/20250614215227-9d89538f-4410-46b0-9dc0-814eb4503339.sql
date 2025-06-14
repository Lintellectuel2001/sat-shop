
-- Créer la table pour les paramètres Google Analytics
CREATE TABLE public.analytics_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ga_tracking_id TEXT,
  gtag_tracking_id TEXT,
  is_enabled BOOLEAN DEFAULT false,
  track_ecommerce BOOLEAN DEFAULT false,
  track_scroll BOOLEAN DEFAULT false,
  track_downloads BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table pour le suivi des mots-clés SEO
CREATE TABLE public.seo_keywords (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword TEXT NOT NULL,
  target_url TEXT NOT NULL,
  current_position INTEGER DEFAULT 0,
  previous_position INTEGER DEFAULT 0,
  search_volume INTEGER DEFAULT 0,
  difficulty TEXT DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_checked TIMESTAMP WITH TIME ZONE
);

-- Créer la table pour les méta descriptions
CREATE TABLE public.meta_descriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_url TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  keywords TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ajouter des politiques RLS (Row Level Security) - seuls les admins peuvent gérer ces données
ALTER TABLE public.analytics_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meta_descriptions ENABLE ROW LEVEL SECURITY;

-- Politiques pour analytics_settings (seuls les admins)
CREATE POLICY "Admin can view analytics settings" ON public.analytics_settings
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admin can insert analytics settings" ON public.analytics_settings
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update analytics settings" ON public.analytics_settings
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admin can delete analytics settings" ON public.analytics_settings
  FOR DELETE USING (public.is_admin());

-- Politiques pour seo_keywords (seuls les admins)
CREATE POLICY "Admin can view seo keywords" ON public.seo_keywords
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admin can insert seo keywords" ON public.seo_keywords
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update seo keywords" ON public.seo_keywords
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admin can delete seo keywords" ON public.seo_keywords
  FOR DELETE USING (public.is_admin());

-- Politiques pour meta_descriptions (seuls les admins)
CREATE POLICY "Admin can view meta descriptions" ON public.meta_descriptions
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admin can insert meta descriptions" ON public.meta_descriptions
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update meta descriptions" ON public.meta_descriptions
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admin can delete meta descriptions" ON public.meta_descriptions
  FOR DELETE USING (public.is_admin());
