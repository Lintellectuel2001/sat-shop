
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ChargilyClient } from "npm:@chargily/chargily-pay@2.1.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  amount: number;
  name: string;
  productName: string;
  cartId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    const { amount, name, productName, cartId }: PaymentRequest = await req.json();
    console.log("Received payment request:", { amount, name, productName, cartId });

    const apiKey = Deno.env.get("CHARGILY_API_KEY");
    if (!apiKey) {
      console.error("CHARGILY_API_KEY not found");
      throw new Error("CHARGILY_API_KEY not configured");
    }

    console.log("Creating Chargily client with API key length:", apiKey.length);
    const client = new ChargilyClient({
      api_key: apiKey,
      mode: 'live'
    });

    // URL de retour absolue vers l'application
    const backUrl = "https://100dd593-28f8-4b90-bf1f-697c285ac699.lovableproject.com";
    const webhookUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/chargily-webhook`;
    
    // Le montant est déjà en dinars, pas besoin de conversion
    console.log("Using configuration:", {
      backUrl,
      webhookUrl,
      amount,
      apiKeyPresent: !!apiKey
    });

    const checkoutData = {
      invoice: {
        amount: amount,
        currency: "DZD",
        name: name,
        email: "client@example.com",
        phone: "+213555555555",
        description: `${productName} (${cartId})`,
      },
      mode: "CIB",
      back_url: backUrl,
      webhook_url: webhookUrl,
      feeOnClient: false,
      lang: "fr"
    };

    console.log("Creating checkout with data:", JSON.stringify(checkoutData, null, 2));

    try {
      const response = await client.createCheckout(checkoutData);
      console.log("Chargily response:", JSON.stringify(response, null, 2));

      if (!response || !response.checkout_url) {
        throw new Error("Invalid response from Chargily");
      }

      return new Response(
        JSON.stringify({
          checkout_url: response.checkout_url,
          payment_id: response.id || `chargily_${Date.now()}`
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    } catch (chargilyError) {
      console.error("Chargily API error:", {
        message: chargilyError.message,
        stack: chargilyError.stack,
        name: chargilyError.name
      });
      
      return new Response(
        JSON.stringify({
          error: "Erreur lors de la création du paiement",
          details: chargilyError.message,
          stack: chargilyError.stack
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

  } catch (error) {
    console.error("General error:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return new Response(
      JSON.stringify({
        error: "Une erreur est survenue",
        details: error.message,
        stack: error.stack
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);
