-- Fix critical security issue: Add proper search_path to database functions

-- Update is_admin function with proper search path
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = user_id
  );
$function$;

-- Update get_current_user_role function with proper search path
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
  SELECT CASE 
    WHEN EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()) THEN 'admin'
    ELSE 'user'
  END;
$function$;

-- Update is_order_owner function with proper search path
CREATE OR REPLACE FUNCTION public.is_order_owner(order_id uuid, token text DEFAULT NULL::text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_id
    AND (
      (auth.uid() IS NOT NULL AND o.user_id = auth.uid()) OR
      (token IS NOT NULL AND o.order_token = token)
    )
  );
$function$;

-- Update log_security_event function with proper search path
CREATE OR REPLACE FUNCTION public.log_security_event(p_action text, p_resource text, p_details jsonb DEFAULT NULL::jsonb, p_severity text DEFAULT 'medium'::text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id, action, resource, details, severity
  ) VALUES (
    auth.uid(), p_action, p_resource, p_details, p_severity
  );
END;
$function$;

-- Update handle_updated_at function with proper search path
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

-- Update update_orders_updated_at function with proper search path
CREATE OR REPLACE FUNCTION public.update_orders_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

-- Update set_order_token function with proper search path
CREATE OR REPLACE FUNCTION public.set_order_token()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
BEGIN
  IF NEW.order_token IS NULL THEN
    NEW.order_token = generate_order_token();
  END IF;
  RETURN NEW;
END;
$function$;

-- Update generate_order_token function with proper search path
CREATE OR REPLACE FUNCTION public.generate_order_token()
RETURNS text
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
BEGIN
  RETURN upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));
END;
$function$;