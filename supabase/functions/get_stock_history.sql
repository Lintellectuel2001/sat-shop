
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
