import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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

    // Create payment request to Chargily
    const paymentData = {
      mode: "payment",
      amount: amount * 100, // Chargily expects amount in centimes
      currency: "dzd",
      success_url: `${req.headers.get("origin")}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      failure_url: `${req.headers.get("origin")}/payment/failure`,
      payment_method: "edahabia,cib",
      description: `Achat de ${productName}`,
      metadata: {
        product_id: productId,
        product_name: productName,
        customer_email: customerEmail,
        customer_name: customerName,
        customer_phone: customerPhone || "",
      },
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone || "",
      },
    };

    console.log("Creating Chargily payment:", paymentData);

    const response = await fetch("https://pay.chargily.io/api/v2/checkouts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${chargilyApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Chargily API error:", response.status, errorData);
      throw new Error(`Chargily API error: ${response.status} ${errorData}`);
    }

    const result = await response.json();
    console.log("Chargily payment created:", result);

    return new Response(JSON.stringify({
      success: true,
      checkout_url: result.checkout_url,
      session_id: result.id,
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