
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log("Received webhook payload:", payload);

    // Vérifier la signature du webhook (à implémenter selon la documentation Chargily)
    // TODO: Ajouter la vérification de la signature

    // Traiter les différents statuts de paiement
    const { invoice } = payload;
    if (!invoice) {
      throw new Error('Invoice data missing from webhook payload');
    }

    // Mettre à jour le statut de la commande dans la base de données
    const { error: dbError } = await supabase
      .from('order_tracking')
      .insert({
        order_id: invoice.id,
        status: invoice.status,
        notes: `Payment ${invoice.status}. Amount: ${invoice.amount} ${invoice.currency}`,
      });

    if (dbError) {
      throw dbError;
    }

    // Si le paiement est réussi, vous pouvez ajouter ici la logique pour
    // - Envoyer un email de confirmation
    // - Mettre à jour l'inventaire
    // - Créer un accès au produit, etc.

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        },
        status: 400
      }
    );
  }
});
