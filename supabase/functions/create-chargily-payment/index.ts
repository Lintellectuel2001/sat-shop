
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
    const { amount, name, productName, backUrl }: PaymentRequest = await req.json();

    console.log("Processing payment request with details:", {
      amount,
      name,
      productName,
      backUrl,
      apiKeyExists: !!Deno.env.get("CHARGILY_API_KEY")
    });

    const chargilyPay = new ChargilyPay({
      apiKey: Deno.env.get("CHARGILY_API_KEY") || '',
      mode: 'live',
    });

    const paymentData = {
      amount: parseFloat(amount),
      currency: "DZD",
      payment_method: "CIB",
      customer_name: name,
      customer_phone: "213XXXXXXXX",
      customer_email: "customer@email.com",
      description: `Payment for ${productName}`,
      webhook_url: `${req.url.split('/functions/')[0]}/functions/v1/chargily-webhook`,
      back_url: backUrl,
      feeOnCustomer: false,
    };

    console.log("Sending payment request to Chargily:", paymentData);

    const payment = await chargilyPay.createPayment(paymentData);

    console.log("Payment created successfully:", payment);

    return new Response(JSON.stringify(payment), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
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
