
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { ChargilyPay } from 'npm:@chargily/chargily-pay';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
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
      throw new Error("CHARGILY_API_KEY is not configured");
    }

    const chargilyPay = new ChargilyPay({
      apiKey: apiKey,
      mode: 'live',
    });

    const webhookUrl = `${req.url.split('/functions/')[0]}/functions/v1/chargily-webhook`;

    const paymentData = {
      amount: parseFloat(amount),
      currency: "DZD",
      payment_method: "EDAHABIA", // Changed from CIB to EDAHABIA for better compatibility
      customer_name: name,
      customer_phone: "213700000000", // Default phone number
      customer_email: "customer@email.com",
      description: `Payment for ${productName}`,
      webhook_url: webhookUrl,
      back_url: backUrl,
      feeOnCustomer: false,
    };

    console.log("Sending payment request to Chargily:", paymentData);

    const response = await chargilyPay.createPayment(paymentData);
    console.log("Payment response from Chargily:", response);

    if (!response.checkout_url) {
      throw new Error("No checkout URL received from Chargily");
    }

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error creating payment:", {
      message: error.message,
      stack: error.stack,
      details: error.details || 'No additional details'
    });
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack,
        details: error.details || 'No additional details'
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
