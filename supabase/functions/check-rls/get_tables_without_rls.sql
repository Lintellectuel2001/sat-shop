
-- Function to get tables without RLS from schemas exposed to PostgREST
CREATE OR REPLACE FUNCTION public.get_tables_without_rls()
RETURNS TABLE (
  schema_name TEXT,
  table_name TEXT,
  has_rls BOOLEAN,
  exposed_to_postgrest BOOLEAN
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS
$$
BEGIN
  RETURN QUERY
  WITH schemas_in_postgrest AS (
    SELECT 
      schema_name
    FROM
      pg_catalog.pg_namespace n
    WHERE
      -- Filter to schemas that are likely exposed to PostgREST
      schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast', 'pg_temp_1', 
                         'pg_toast_temp_1', 'supabase_functions', 'realtime')
      AND schema_name NOT LIKE 'pg_%'
  )
  SELECT
    t.schemaname AS schema_name,
    t.tablename AS table_name,
    COALESCE(c.relrowsecurity, false) AS has_rls,
    s.schema_name IS NOT NULL AS exposed_to_postgrest
  FROM
    pg_catalog.pg_tables t
  JOIN
    pg_catalog.pg_class c ON c.relname = t.tablename AND c.relnamespace = (SELECT oid FROM pg_catalog.pg_namespace WHERE nspname = t.schemaname)
  LEFT JOIN
    schemas_in_postgrest s ON t.schemaname = s.schema_name
  WHERE
    -- Filter to user tables (not system tables)
    t.schemaname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
    AND t.schemaname NOT LIKE 'pg_%'
    -- Only include tables from schemas exposed to PostgREST
    AND s.schema_name IS NOT NULL
    -- Only return tables without RLS enabled
    AND NOT COALESCE(c.relrowsecurity, false)
  ORDER BY
    t.schemaname,
    t.tablename;
END;
$$;
