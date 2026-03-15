
-- Add missing column to marketing_notifications
ALTER TABLE public.marketing_notifications ADD COLUMN is_sent BOOLEAN DEFAULT false;

-- Add missing column to orders
ALTER TABLE public.orders ADD COLUMN order_token TEXT;

-- Create missing tables

-- SAVED_CARTS
CREATE TABLE public.saved_carts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.saved_carts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own saved carts" ON public.saved_carts FOR ALL TO authenticated USING (auth.uid() = user_id);

-- WISHLISTS
CREATE TABLE public.wishlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own wishlist" ON public.wishlists FOR ALL TO authenticated USING (auth.uid() = user_id);

-- PRODUCT_TAGS
CREATE TABLE public.product_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.product_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Product tags viewable by everyone" ON public.product_tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage product_tags" ON public.product_tags FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- STOCK_HISTORY
CREATE TABLE public.stock_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity_change INTEGER NOT NULL DEFAULT 0,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.stock_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage stock_history" ON public.stock_history FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- ANALYTICS_SETTINGS
CREATE TABLE public.analytics_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ga_tracking_id TEXT,
  gtag_tracking_id TEXT,
  is_enabled BOOLEAN DEFAULT false,
  track_ecommerce BOOLEAN DEFAULT false,
  track_scroll BOOLEAN DEFAULT false,
  track_downloads BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.analytics_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Analytics settings viewable by admins" ON public.analytics_settings FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);
CREATE POLICY "Admins can manage analytics_settings" ON public.analytics_settings FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- SEO_KEYWORDS
CREATE TABLE public.seo_keywords (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword TEXT NOT NULL,
  current_position INTEGER,
  previous_position INTEGER,
  search_volume INTEGER,
  target_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.seo_keywords ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage seo_keywords" ON public.seo_keywords FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- META_DESCRIPTIONS
CREATE TABLE public.meta_descriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  keywords TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.meta_descriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Meta descriptions viewable by everyone" ON public.meta_descriptions FOR SELECT USING (true);
CREATE POLICY "Admins can manage meta_descriptions" ON public.meta_descriptions FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);
