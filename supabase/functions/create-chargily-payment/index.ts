
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ChargilyPay } from "npm:@chargily/chargily-pay@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
    return new Response('ok', { headers: corsHeaders });
  }

  try {
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

    const chargilyPay = new ChargilyPay(apiKey, 'live');
    console.log("Chargily client initialized");

    const webhookUrl = `${req.url.split('/functions/')[0]}/functions/v1/chargily-webhook`;
    console.log("Webhook URL:", webhookUrl);

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

    const paymentData = {
      amount: numericAmount,
      currency: "DZD",
      payment_method: "EDAHABIA",
      customer_name: requestData.name || "Customer",
      customer_phone: "213700000000",
      customer_email: "customer@email.com",
      description: `Payment for ${requestData.productName}`,
      webhook_url: webhookUrl,
      back_url: requestData.backUrl,
      feeOnCustomer: false,
    };

    console.log("Sending payment request to Chargily:", paymentData);

    const response = await chargilyPay.createPayment(paymentData);
    console.log("Payment response from Chargily:", response);

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
