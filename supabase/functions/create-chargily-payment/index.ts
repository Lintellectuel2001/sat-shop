
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ChargilyClient } from "npm:@chargily/chargily-pay@2.1.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  amount: string;
  name: string;
  productName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    const { amount, name, productName }: PaymentRequest = await req.json();

    const apiKey = Deno.env.get("CHARGILY_API_KEY");
    if (!apiKey) {
      throw new Error("CHARGILY_API_KEY not configured");
    }

    const client = new ChargilyClient({
      api_key: apiKey,
      mode: 'test' // Utilisez 'live' pour la production
    });

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
      throw new Error("Invalid amount");
    }

    const checkoutData = {
      invoice: {
        amount: numericAmount,
        currency: "DZD",
        name: name || "Customer",
        email: "client@example.com", // À remplacer par l'email du client
        phone: "+213555555555", // À remplacer par le téléphone du client
        description: productName,
      },
      mode: "CIB",
      back_url: window.location.origin,
      webhook_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/chargily-webhook`,
      feeOnClient: false,
      lang: "fr"
    };

    console.log("Creating payment with data:", checkoutData);

    const response = await client.createCheckout(checkoutData);
    console.log("Payment created:", response);

    return new Response(
      JSON.stringify(response),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error("Error in payment processing:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Unknown error occurred",
        details: "Payment creation failed",
        stack: error.stack
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
