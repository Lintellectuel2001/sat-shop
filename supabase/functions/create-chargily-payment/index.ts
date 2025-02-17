
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ChargilyClient } from "npm:@chargily/chargily-pay@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true',
};

interface PaymentRequest {
  amount: string;
  name: string;
  productName: string;
  backUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const rawBody = await req.text();
    console.log("Raw request body:", rawBody);

    let requestData;
    try {
      requestData = JSON.parse(rawBody);
      console.log("Parsed request data:", JSON.stringify(requestData, null, 2));
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return new Response(
        JSON.stringify({
          error: "Invalid JSON in request body",
          details: parseError.message,
          receivedBody: rawBody
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Validation des données
    if (!requestData?.backUrl || !requestData?.amount || !requestData?.productName) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          details: "backUrl, amount, and productName are required",
          receivedData: requestData
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Validate backUrl format
    try {
      new URL(requestData.backUrl);
    } catch (urlError) {
      return new Response(
        JSON.stringify({
          error: "Invalid backUrl format",
          details: "backUrl must be a valid URL",
          receivedUrl: requestData.backUrl
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    const apiKey = Deno.env.get("CHARGILY_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "Configuration error",
          details: "CHARGILY_API_KEY not configured"
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

    const client = new ChargilyClient({
      api_key: apiKey,
      mode: 'live'
    });

    const numericAmount = parseFloat(requestData.amount);
    if (isNaN(numericAmount)) {
      return new Response(
        JSON.stringify({
          error: "Invalid amount",
          details: "Amount must be a valid number",
          receivedAmount: requestData.amount
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Ensure backUrl doesn't end with a slash
    const backUrl = requestData.backUrl.replace(/\/$/, '');
    console.log("Using backUrl:", backUrl);

    // Utilisation de l'URL de base de la requête pour le webhook
    const baseUrl = new URL(req.url).origin;
    const webhookUrl = `${baseUrl}/functions/v1/chargily-webhook`;
    console.log("Using webhookUrl:", webhookUrl);

    const checkoutData = {
      invoice: {
        amount: numericAmount,
        currency: "DZD",
        name: requestData.name || "Customer",
        email: "client@example.com",
        phone: "+213555555555",
        description: requestData.productName,
      },
      mode: "EDAHABIA",
      successUrl: backUrl,
      errorUrl: backUrl,
      webhookUrl: webhookUrl,
      feeOnClient: false,
      lang: "fr"
    };

    console.log("Sending checkout request to Chargily:", JSON.stringify(checkoutData, null, 2));

    const response = await client.createCheckout(checkoutData);
    console.log("Checkout response from Chargily:", response);

    if (!response || !response.checkout_url) {
      return new Response(
        JSON.stringify({
          error: "Invalid Chargily response",
          details: "Response missing checkout_url",
          response: response
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
