
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
    console.log("Request method:", req.method);
    console.log("Request headers:", Object.fromEntries(req.headers.entries()));

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

    // Validation plus stricte des données d'entrée
    if (!requestData?.backUrl) {
      return new Response(
        JSON.stringify({
          error: "Missing backUrl",
          details: "backUrl is required",
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

    console.log("BackUrl from request:", requestData.backUrl);

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

    const client = new ChargilyClient({
      api_key: apiKey,
      mode: 'live'
    });
    console.log("Chargily client initialized");

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

    // Ensure we have a complete URL for the webhook
    const baseUrl = new URL(req.url).origin;
    const webhookUrl = `${baseUrl}/functions/v1/chargily-webhook`;

    // Ensure success/error URL is complete
    let successUrl = requestData.backUrl;
    try {
      // Test if it's a valid URL
      new URL(successUrl);
    } catch {
      // If not, assume it's a path and construct full URL
      successUrl = new URL(successUrl, baseUrl).toString();
    }

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
      successUrl: successUrl,
      errorUrl: successUrl,
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
