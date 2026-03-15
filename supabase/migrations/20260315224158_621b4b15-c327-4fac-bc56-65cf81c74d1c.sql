
-- ORDER_TRACKING table
CREATE TABLE public.order_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.order_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their order tracking" ON public.order_tracking FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_tracking.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Admins can manage order_tracking" ON public.order_tracking FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- Add missing columns to seo_keywords
ALTER TABLE public.seo_keywords ADD COLUMN difficulty TEXT DEFAULT 'medium';
ALTER TABLE public.seo_keywords ADD COLUMN last_checked TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Enable realtime for order_tracking
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_tracking;
