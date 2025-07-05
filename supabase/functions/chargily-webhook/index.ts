import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifySignature } from "npm:@chargily/chargily-pay@2.1.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get raw body for signature verification
    const body = await req.text();
    console.log("Webhook received, body length:", body.length);

    // Verify webhook signature using official Chargily method
    const chargilyApiKey = Deno.env.get("CHARGILY_API_KEY");
    const signature = req.headers.get("signature");
    
    if (!signature) {
      console.error("No signature header found");
      return new Response("Signature header is missing", { status: 400 });
    }
    
    if (!chargilyApiKey) {
      console.error("Chargily API key not configured");
      return new Response("Webhook verification failed", { status: 403 });
    }

    try {
      // Verify the webhook signature using Chargily's official method
      const isValid = verifySignature(Buffer.from(body), signature, chargilyApiKey);
      if (!isValid) {
        console.error("Invalid webhook signature");
        return new Response("Signature is invalid", { status: 403 });
      }
      console.log("Webhook signature verified successfully");
    } catch (verifyError) {
      console.error("Error verifying signature:", verifyError);
      return new Response("Signature verification failed", { status: 403 });
    }

    const payload = JSON.parse(body);
    console.log("Webhook payload:", payload);

    // Vérifier que le paiement est confirmé
    if (payload.type === "checkout.paid") {
      const checkoutData = payload.data;
      const metadata = checkoutData.metadata;

      console.log("Processing paid checkout:", checkoutData.id);

      // Créer la commande dans la base de données
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          product_id: metadata.product_id,
          product_name: metadata.product_name,
          customer_name: metadata.customer_name,
          customer_email: metadata.customer_email,
          amount: (checkoutData.amount / 100).toString(), // Convertir centimes en dinars
          status: "completed",
          payment_id: checkoutData.id,
        })
        .select()
        .single();

      if (orderError) {
        console.error("Error creating order:", orderError);
        throw orderError;
      }

      console.log("Order created:", order);

      // Récupérer les informations du produit
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", metadata.product_id)
        .single();

      if (productError) {
        console.error("Error fetching product:", productError);
        throw productError;
      }

      // Si le produit a des informations de téléchargement, les envoyer au client
      if (product.download_info) {
        console.log("Product has download info, processing delivery...");
        
        // Ici vous pouvez ajouter la logique pour envoyer automatiquement le produit digital
        // Par exemple, envoyer un email avec le lien de téléchargement ou le code d'activation
        
        // Exemple avec Resend (si configuré)
        try {
          const resendApiKey = Deno.env.get("RESEND_API_KEY");
          if (resendApiKey) {
            const emailResponse = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${resendApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: "Sat-shop <noreply@sat-shop.com>",
                to: [metadata.customer_email],
                subject: `Votre produit ${metadata.product_name} est prêt`,
                html: `
                  <h1>Merci pour votre achat ${metadata.customer_name}!</h1>
                  <p>Votre paiement a été confirmé pour le produit: <strong>${metadata.product_name}</strong></p>
                  <p>Informations de téléchargement:</p>
                  <pre>${JSON.stringify(product.download_info, null, 2)}</pre>
                  <p>Commande ID: ${order.id}</p>
                  <p>Montant payé: ${checkoutData.amount / 100} DZD</p>
                  <hr>
                  <p>Équipe Sat-shop</p>
                `,
              }),
            });

            if (emailResponse.ok) {
              console.log("Email sent successfully");
            } else {
              console.error("Failed to send email:", await emailResponse.text());
            }
          }
        } catch (emailError) {
          console.error("Error sending email:", emailError);
        }
      }

      // Mettre à jour le stock si nécessaire
      if (product.stock_quantity !== null) {
        const { error: stockError } = await supabase
          .from("products")
          .update({ 
            stock_quantity: product.stock_quantity - 1 
          })
          .eq("id", metadata.product_id);

        if (stockError) {
          console.error("Error updating stock:", stockError);
        }
      }

      // Log de l'historique des ventes
      const { error: historyError } = await supabase
        .from("cart_history")
        .insert({
          action_type: "purchase_completed",
          product_id: metadata.product_id,
          payment_id: checkoutData.id,
          payment_status: "completed",
          profit: checkoutData.amount / 100, // Profit brut
        });

      if (historyError) {
        console.error("Error logging cart history:", historyError);
      }

      return new Response(JSON.stringify({ success: true, order_id: order.id }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    // Autres types d'événements (échec, annulation, etc.)
    if (payload.type === "checkout.failed") {
      console.log("Payment failed:", payload.data.id);
      
      // Optionnel: logger les échecs de paiement
      const { error: historyError } = await supabase
        .from("cart_history")
        .insert({
          action_type: "purchase_failed",
          product_id: payload.data.metadata?.product_id,
          payment_id: payload.data.id,
          payment_status: "failed",
        });

      if (historyError) {
        console.error("Error logging failed payment:", historyError);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);