
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
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight request
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

    console.log("Creating payment with amount:", amount);

    const client = new ChargilyClient({
      api_key: apiKey,
      mode: 'live'
    });

    // URL de retour fixe vers l'application
    const backUrl = "https://100dd593-28f8-4b90-bf1f-697c285ac699.lovableproject.com";
    console.log("Using back URL:", backUrl);

    const checkoutData = {
      invoice: {
        amount: amount,
        currency: "DZD",
        name: name,
        email: "client@example.com",
        phone: "+213555555555",
        description: productName,
      },
      mode: "CIB",
      back_url: backUrl,
      webhook_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/chargily-webhook`,
      feeOnClient: false,
      lang: "fr"
    };

    console.log("Sending checkout request with data:", JSON.stringify(checkoutData, null, 2));

    const response = await client.createCheckout(checkoutData);
    console.log("Payment response:", JSON.stringify(response, null, 2));

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
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
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
