
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
    const requestBody = await req.json();
    console.log("Raw request body:", requestBody);
    
    let { amount, name, productName, cartId }: PaymentRequest;
    try {
      // Si le corps est une chaîne JSON, la parser
      if (typeof requestBody === 'string') {
        const parsed = JSON.parse(requestBody);
        amount = parsed.amount;
        name = parsed.name;
        productName = parsed.productName;
        cartId = parsed.cartId;
      } else {
        // Sinon utiliser directement l'objet
        amount = requestBody.amount;
        name = requestBody.name;
        productName = requestBody.productName;
        cartId = requestBody.cartId;
      }
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      throw new Error(`Invalid request format: ${parseError.message}`);
    }

    console.log("Parsed payment request:", { amount, name, productName, cartId });

    const apiKey = Deno.env.get("CHARGILY_API_KEY");
    if (!apiKey) {
      console.error("CHARGILY_API_KEY not found");
      throw new Error("CHARGILY_API_KEY not configured");
    }

    console.log("Creating Chargily client...");
    const client = new ChargilyClient({
      api_key: apiKey,
      mode: 'live'
    });

    // URLs pour le paiement
    const backUrl = "https://100dd593-28f8-4b90-bf1f-697c285ac699.lovableproject.com";
    const webhookUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/chargily-webhook`;
    
    console.log("Configuration:", {
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

    console.log("Sending checkout request with data:", JSON.stringify(checkoutData, null, 2));

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

  } catch (error) {
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return new Response(
      JSON.stringify({
        error: "Une erreur est survenue lors du traitement du paiement",
        details: error.message,
        stack: error.stack
      }),
      {
        status: 200, // Gardons 200 pour éviter l'erreur FunctionsHttpError
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);
