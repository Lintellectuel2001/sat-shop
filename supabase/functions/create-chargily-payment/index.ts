
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { ChargilyClient } from 'npm:@chargily/chargily-pay';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  amount: string;
  name: string;
  productName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, name, productName }: PaymentRequest = await req.json();

    const client = new ChargilyClient({
      api_key: Deno.env.get("CHARGILY_API_KEY") || '',
      mode: 'live',
    });

    console.log("Creating payment for:", { amount, name, productName });

    const payment = await client.createPayment({
      amount: parseFloat(amount),
      currency: "DZD",
      payment_method: "CIB", // Or "EDAHABIA"
      customer_name: name,
      customer_phone: "213XXXXXXXX", // This should be provided by the customer
      customer_email: "customer@email.com", // This should be provided by the customer
      description: `Payment for ${productName}`,
      webhook_url: "https://your-webhook-url.com", // You should set up a webhook endpoint
      back_url: window.location.origin, // This will redirect back to your site
      feeOnCustomer: false,
    });

    console.log("Payment created successfully:", payment);

    return new Response(JSON.stringify(payment), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error creating payment:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
