import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderEmailRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  productName: string;
  productPrice: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstName, lastName, email, phone, productName, productPrice }: OrderEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "Sat-shop <onboarding@resend.dev>",
      to: ["mehalli.rabie@gmail.com"],
      subject: "Nouvelle commande sur Sat-shop",
      html: `
        <h1>Nouvelle commande</h1>
        <h2>Informations client :</h2>
        <p>Nom : ${lastName}</p>
        <p>Prénom : ${firstName}</p>
        <p>Email : ${email}</p>
        <p>Téléphone : ${phone}</p>
        <h2>Produit commandé :</h2>
        <p>Nom du produit : ${productName}</p>
        <p>Prix : ${productPrice}</p>
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