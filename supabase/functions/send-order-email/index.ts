
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderEmailRequest {
  customerEmail: string;
  productName: string;
  productPrice: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customerEmail, productName, productPrice }: OrderEmailRequest = await req.json();

    if (!customerEmail) {
      throw new Error("Customer email is required");
    }

    console.log(`Sending order confirmation email to ${customerEmail} for ${productName}`);

    const emailResponse = await resend.emails.send({
      from: "Order Confirmation <onboarding@resend.dev>",
      to: [customerEmail],
      subject: `Confirmation de votre commande: ${productName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h1 style="color: #4F46E5; text-align: center;">Merci pour votre commande!</h1>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #374151;">Détails de la commande</h2>
            <p><strong>Produit:</strong> ${productName}</p>
            <p><strong>Prix:</strong> ${productPrice}</p>
          </div>
          <p style="line-height: 1.6;">Votre commande a été confirmée et est en cours de traitement. Vous recevrez bientôt un lien pour accéder à votre produit.</p>
          <p style="line-height: 1.6;">Pour toute question, n'hésitez pas à nous contacter.</p>
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #6B7280; font-size: 14px;">Merci d'avoir choisi notre service!</p>
          </div>
        </div>
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
    console.error("Error in send-order-email function:", error);
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
