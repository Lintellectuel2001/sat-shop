
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Chargily from "npm:@chargily/chargily-pay@2.1.0";

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
    const requestData = await req.text();
    console.log("Raw request data:", requestData);

    const { amount, name, productName, backUrl }: PaymentRequest = JSON.parse(requestData);
    const apiKey = Deno.env.get("CHARGILY_API_KEY");

    console.log("Processing payment request with details:", {
      amount,
      name,
      productName,
      backUrl,
      apiKeyExists: !!apiKey
    });

    if (!apiKey) {
      throw new Error("CHARGILY_API_KEY not configured");
    }

    // Create Chargily instance using the default export
    const chargilyPay = new Chargily.ChargilyPay({
      apiKey: apiKey,
      mode: 'live',
    });

    const webhookUrl = `${req.url.split('/functions/')[0]}/functions/v1/chargily-webhook`;
    console.log("Webhook URL:", webhookUrl);

    const paymentData = {
      amount: parseFloat(amount),
      currency: "DZD",
      payment_method: "EDAHABIA",
      customer_name: name || "Customer",
      customer_phone: "213700000000",
      customer_email: "customer@email.com",
      description: `Payment for ${productName}`,
      webhook_url: webhookUrl,
      back_url: backUrl,
      feeOnCustomer: false,
    };

    console.log("Sending payment request to Chargily:", paymentData);

    const response = await chargilyPay.createPayment(paymentData);
    console.log("Payment response from Chargily:", response);

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
        error: error.message,
        details: "Payment creation failed"
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
