
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Chargily from "npm:@chargily/chargily-pay";

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
    // Verify content type
    if (req.headers.get("content-type") !== "application/json") {
      throw new Error("Content-Type must be application/json");
    }

    const requestData = await req.json();
    console.log("Parsed request data:", requestData);

    if (!requestData.amount || !requestData.productName || !requestData.backUrl) {
      throw new Error("Missing required fields: amount, productName, or backUrl");
    }

    const apiKey = Deno.env.get("CHARGILY_API_KEY");
    console.log("API Key exists:", !!apiKey);

    if (!apiKey) {
      throw new Error("CHARGILY_API_KEY not configured");
    }

    // Create Chargily instance using the default export
    const chargilyPay = new Chargily({
      apiKey: apiKey,
      mode: 'live',
    });

    const webhookUrl = `${req.url.split('/functions/')[0]}/functions/v1/chargily-webhook`;
    console.log("Webhook URL:", webhookUrl);

    // Ensure amount is a valid number
    const numericAmount = parseFloat(requestData.amount);
    if (isNaN(numericAmount)) {
      throw new Error("Invalid amount value");
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
      throw new Error("Invalid response from Chargily");
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
