
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AdminNotificationRequest {
  productName: string;
  productPrice: string;
  adminEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received admin notification request:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      headers: corsHeaders,
      status: 200
    });
  }

  try {
    const body = await req.json();
    console.log("Received request body:", body);
    
    const { productName, productPrice, adminEmail }: AdminNotificationRequest = body;
    console.log("Processing admin notification for:", { productName, productPrice, adminEmail });

    if (!productName || !productPrice || !adminEmail) {
      throw new Error("Missing required fields: productName, productPrice, or adminEmail");
    }

    const emailResponse = await resend.emails.send({
      from: "Sat-shop <onboarding@resend.dev>",
      to: [adminEmail],
      subject: "Nouvelle commande sur Sat-shop!",
      html: `
        <h1>Nouvelle commande reçue!</h1>
        <p>Un client vient de cliquer sur "Commander Maintenant" pour le produit suivant:</p>
        <ul>
          <li><strong>Produit:</strong> ${productName}</li>
          <li><strong>Prix:</strong> ${productPrice}</li>
        </ul>
        <p>Cette notification est envoyée automatiquement lorsqu'un client clique sur le bouton de commande.</p>
        <p>Veuillez vérifier votre tableau de bord pour suivre cette commande.</p>
      `,
    });

    console.log("Admin notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-admin-notification function:", error);
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
