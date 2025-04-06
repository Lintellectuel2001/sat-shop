
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
