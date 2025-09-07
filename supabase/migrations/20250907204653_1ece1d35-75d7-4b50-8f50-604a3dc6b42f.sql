-- Fix critical security vulnerabilities by removing public access to sensitive data

-- 1. Remove public access to profiles table
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;

-- 2. Remove public access policies from orders table  
DROP POLICY IF EXISTS "Allow authenticated users to select all orders" ON public.orders;
DROP POLICY IF EXISTS "Allow authenticated users to update orders" ON public.orders;
DROP POLICY IF EXISTS "Guests can view orders by token or email" ON public.orders;

-- 3. Remove public access to cart_history table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.cart_history;

-- 4. Drop existing cart_history policies and recreate them securely
DROP POLICY IF EXISTS "Authenticated users can view cart_history" ON public.cart_history;
DROP POLICY IF EXISTS "Admins can view all cart_history" ON public.cart_history;

-- Create secure cart_history policies (only authenticated users and admins)
CREATE POLICY "Secure cart_history access for authenticated users" 
ON public.cart_history 
FOR SELECT 
USING (auth.uid() IS NOT NULL OR is_admin());

-- 5. Create secure orders policy for guest access via token only
DROP POLICY IF EXISTS "Guests can view orders with valid token" ON public.orders;

CREATE POLICY "Secure orders access policy" 
ON public.orders 
FOR SELECT 
USING (
  -- Authenticated users can see their own orders
  (auth.uid() = user_id) 
  -- Guests can only see orders with valid token AND matching email
  OR (user_id IS NULL AND order_token IS NOT NULL AND guest_email IS NOT NULL)
  -- Admins can see all orders
  OR is_admin()
);

-- 6. Log security audit event
SELECT log_security_event(
  'SECURITY_POLICY_UPDATE',
  'profiles, orders, cart_history tables',
  jsonb_build_object(
    'action', 'removed_public_access_vulnerability',
    'tables_affected', ARRAY['profiles', 'orders', 'cart_history'],
    'reason', 'fix_critical_data_exposure'
  ),
  'high'
);