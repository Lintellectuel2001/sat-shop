
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    const chargilyKey = Deno.env.get("CHARGILY_API_KEY");
    if (!chargilyKey) {
      throw new Error("CHARGILY_API_KEY not configured");
    }

    // Vérifier le header de signature Chargily
    const signature = req.headers.get('Signature');
    if (!signature) {
      throw new Error('Missing Chargily signature');
    }

    // Récupérer les données du webhook
    const webhookData = await req.json();
    console.log("Received webhook data:", JSON.stringify(webhookData, null, 2));

    // Créer un client Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Mettre à jour le statut de la commande dans la base de données
    if (webhookData.invoice && webhookData.invoice.id) {
      const { error } = await supabase
        .from('cart_history')
        .update({ 
          payment_status: webhookData.status,
          payment_id: webhookData.invoice.id
        })
        .eq('payment_id', webhookData.invoice.id);

      if (error) {
        console.error("Error updating payment status:", error);
        throw error;
      }
    }

    console.log("Successfully processed webhook");

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error) {
    console.error("Webhook error:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    return new Response(
      JSON.stringify({
        error: error.message || "Unknown error occurred",
        details: "Webhook processing failed"
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);
