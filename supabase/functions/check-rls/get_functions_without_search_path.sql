
-- Function to identify functions without search_path set
CREATE OR REPLACE FUNCTION public.get_functions_without_search_path()
RETURNS TABLE (
  schema_name TEXT,
  function_name TEXT,
  language TEXT
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS
$$
BEGIN
  RETURN QUERY
  SELECT
    n.nspname AS schema_name,
    p.proname AS function_name,
    l.lanname AS language
  FROM
    pg_catalog.pg_proc p
  JOIN
    pg_catalog.pg_namespace n ON p.pronamespace = n.oid
  JOIN
    pg_catalog.pg_language l ON p.prolang = l.oid
  LEFT JOIN
    pg_catalog.pg_parameter_acl pa ON p.oid = pa.parameteraclobject
  WHERE
    -- Filter to functions in public schema or custom schemas (not system schemas)
    n.nspname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
    AND n.nspname NOT LIKE 'pg_%'
    -- Only include functions that don't have search_path set
    AND NOT EXISTS (
      SELECT 1
      FROM pg_catalog.pg_proc_info i
      WHERE i.oid = p.oid
        AND EXISTS (
          SELECT 1
          FROM unnest(i.proconfig) AS config
          WHERE config LIKE 'search_path=%'
        )
    )
    -- Only include non-system functions (exclude aggregates, window functions, procedures, etc.)
    AND p.prokind = 'f'
    -- Only include functions in PL/pgSQL language as they're most at risk
    AND l.lanname = 'plpgsql'
  ORDER BY
    n.nspname,
    p.proname;
END;
$$;
