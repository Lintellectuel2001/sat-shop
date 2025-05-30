
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create a Supabase client with the authorization header
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: { headers: { Authorization: authHeader } }
      }
    );

    // Query to get all tables without RLS enabled from schemas exposed to PostgREST
    const { data: tablesWithoutRLS, error: tablesError } = await supabaseClient.rpc('get_tables_without_rls');
    
    if (tablesError) {
      console.error('Error fetching tables without RLS:', tablesError);
      return new Response(JSON.stringify({ error: tablesError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Query to get all functions without search_path set
    const { data: functionsWithoutSearchPath, error: functionsError } = await supabaseClient.rpc('get_functions_without_search_path');
    
    if (functionsError) {
      console.error('Error fetching functions without search_path:', functionsError);
      return new Response(JSON.stringify({ error: functionsError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({
      tables_without_rls: tablesWithoutRLS,
      functions_without_search_path: functionsWithoutSearchPath
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
