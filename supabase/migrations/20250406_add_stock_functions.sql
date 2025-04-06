
-- Add stock management functions
-- Function to add stock history record
CREATE OR REPLACE FUNCTION public.add_stock_history(
  p_product_id UUID,
  p_previous_quantity INTEGER,
  p_new_quantity INTEGER,
  p_change_type TEXT,
  p_notes TEXT DEFAULT NULL,
  p_created_by UUID DEFAULT NULL
) RETURNS void AS $$
BEGIN
  INSERT INTO public.stock_history (
    product_id,
    previous_quantity,
    new_quantity,
    change_type,
    notes,
    created_by
  ) VALUES (
    p_product_id,
    p_previous_quantity,
    p_new_quantity,
    p_change_type,
    p_notes,
    p_created_by
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get stock history with product names
CREATE OR REPLACE FUNCTION public.get_stock_history()
RETURNS TABLE (
  id UUID,
  product_id UUID,
  product_name TEXT,
  previous_quantity INTEGER,
  new_quantity INTEGER,
  change_type TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ,
  created_by UUID
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sh.id,
    sh.product_id,
    p.name AS product_name,
    sh.previous_quantity,
    sh.new_quantity,
    sh.change_type,
    sh.notes,
    sh.created_at,
    sh.created_by
  FROM 
    public.stock_history sh
  LEFT JOIN 
    public.products p ON sh.product_id = p.id
  ORDER BY 
    sh.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Ensure all required columns exist on products table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'stock_quantity') THEN
    ALTER TABLE public.products ADD COLUMN stock_quantity INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'stock_alert_threshold') THEN
    ALTER TABLE public.products ADD COLUMN stock_alert_threshold INTEGER DEFAULT 5;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'purchase_price') THEN
    ALTER TABLE public.products ADD COLUMN purchase_price NUMERIC DEFAULT 0;
  END IF;
END
$$;

-- Create stock_history table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.stock_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  previous_quantity INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL,
  change_type TEXT NOT NULL,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add the updated_at trigger to stock_history
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at_stock_history') THEN
    CREATE TRIGGER handle_updated_at_stock_history
    BEFORE UPDATE ON public.stock_history
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
  END IF;
END
$$;

-- Enable Row Level Security on the new table
ALTER TABLE public.stock_history ENABLE ROW LEVEL SECURITY;

-- Add Realtime support for the stock_history table
ALTER PUBLICATION supabase_realtime ADD TABLE stock_history;
