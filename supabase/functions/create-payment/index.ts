import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { ChargilyClient } from "npm:@chargily/chargily-pay@2.1.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  productId: string;
  productName: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productId, productName, amount, customerEmail, customerName, customerPhone }: PaymentRequest = await req.json();

    const chargilyApiKey = Deno.env.get("CHARGILY_API_KEY");
    if (!chargilyApiKey) {
      throw new Error("Chargily API key not configured");
    }

    console.log("Initializing Chargily client with API key");

    // Initialize Chargily client
    const client = new ChargilyClient({
      api_key: chargilyApiKey,
      mode: 'live', // Change to 'live' for production
    });

    const origin = req.headers.get("origin") || "https://your-domain.com";

    console.log("Creating checkout with data:", {
      productId,
      productName,
      amount,
      customerEmail,
      customerName,
      origin
    });

    // Create checkout using official Chargily client
    const checkout = await client.createCheckout({
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      failure_url: `${origin}/payment/failure`,
      payment_method: "edahabia", // Can be "edahabia" or "cib"
      locale: "ar", // "ar" or "en"
      pass_fees_to_customer: false,
      collect_shipping_address: false,
      metadata: {
        product_id: productId,
        product_name: productName,
        customer_email: customerEmail,
        customer_name: customerName,
        customer_phone: customerPhone || "",
      },
      // Create a simple checkout with amount directly
      amount: amount * 100, // Convert to centimes
      currency: "dzd",
      description: `Achat de ${productName}`,
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone || "",
      },
    });

    console.log("Chargily checkout created successfully:", checkout);

    return new Response(JSON.stringify({
      success: true,
      checkout_url: checkout.checkout_url,
      session_id: checkout.id,
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error creating payment:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);