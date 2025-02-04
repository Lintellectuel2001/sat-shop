
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderNotificationRequest {
  productName: string;
  productPrice: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      headers: corsHeaders,
      status: 200
    });
  }

  try {
    const { productName, productPrice }: OrderNotificationRequest = await req.json();
    console.log("Processing order notification for:", { productName, productPrice });

    const emailResponse = await resend.emails.send({
      from: "Sat-shop <onboarding@resend.dev>",
      to: ["mehalli.rabie@gmail.com"],
      subject: "Nouvelle commande sur Sat-shop!",
      html: `
        <h1>Nouvelle commande reçue!</h1>
        <p>Détails de la commande:</p>
        <ul>
          <li>Produit: ${productName}</li>
          <li>Prix: ${productPrice}</li>
        </ul>
        <p>Veuillez vérifier votre tableau de bord pour plus de détails.</p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-order-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
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
