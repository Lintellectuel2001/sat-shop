
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { verifySignature } from "npm:@chargily/chargily-pay@2.1.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('signature');
    if (!signature) {
      console.error('Signature header is missing');
      return new Response(
        JSON.stringify({ error: 'Signature header is missing' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('CHARGILY_API_KEY');
    if (!apiKey) {
      console.error('CHARGILY_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'CHARGILY_API_KEY not configured' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the raw body as text
    const rawBody = await req.text();
    console.log('Received webhook payload:', rawBody);

    // Verify signature
    try {
      const isValid = verifySignature(rawBody, signature, apiKey);
      if (!isValid) {
        console.error('Invalid signature');
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }), 
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (error) {
      console.error('Error verifying signature:', error);
      return new Response(
        JSON.stringify({ error: 'Error verifying signature' }), 
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the body as JSON
    const event = JSON.parse(rawBody);
    console.log('Parsed webhook event:', event);

    // Update order status in database
    if (event.invoice) {
      const { error: dbError } = await supabase
        .from('order_tracking')
        .insert({
          status: event.invoice.status,
          notes: `Payment ${event.invoice.status}. Amount: ${event.invoice.amount} ${event.invoice.currency}`,
        });

      if (dbError) {
        console.error('Error updating database:', dbError);
        throw dbError;
      }
    }

    return new Response(
      JSON.stringify({ received: true }), 
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
