
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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    // Log request details for debugging
    console.log("Request method:", req.method);
    console.log("Request headers:", Object.fromEntries(req.headers.entries()));

    // Log raw request for debugging
    const rawBody = await req.text();
    console.log("Raw request body:", rawBody);

    let requestData;
    try {
      requestData = JSON.parse(rawBody);
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

    console.log("Parsed request data:", requestData);

    if (!requestData.amount || !requestData.productName || !requestData.backUrl) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          details: "amount, productName, and backUrl are required",
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

    const apiKey = Deno.env.get("CHARGILY_API_KEY");
    console.log("API Key exists:", !!apiKey);

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

    // Initialisation du client Chargily selon la documentation officielle
    const client = new ChargilyClient({
      api_key: apiKey,
      mode: 'live' // mode production
    });
    console.log("Chargily client initialized");

    // Ensure amount is a valid number
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

    console.log("Creating checkout with amount:", numericAmount);

    // Création du checkout selon la documentation officielle
    const checkoutData = {
      items: [
        {
          price: {
            amount: numericAmount,
            currency: 'dzd'
          },
          quantity: 1
        }
      ],
      success_url: requestData.backUrl,
      failure_url: requestData.backUrl,
      payment_method: 'edahabia',
      locale: 'fr',
      pass_fees_to_customer: false,
      metadata: {
        product_name: requestData.productName,
        customer_name: requestData.name || 'Customer'
      }
    };

    console.log("Sending checkout request to Chargily:", checkoutData);

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
