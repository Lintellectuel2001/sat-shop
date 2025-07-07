import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderNotificationRequest {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productName: string;
  productPrice: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { orderId, customerName, customerEmail, customerPhone, productName, productPrice }: OrderNotificationRequest = await req.json();

    // Récupérer les informations du produit pour avoir le prix d'achat
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('id, purchase_price')
      .eq('name', productName)
      .single();

    if (productError) {
      console.error('Error fetching product data:', productError);
      return new Response(
        JSON.stringify({ error: 'Product not found' }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const purchasePrice = productData.purchase_price || 0;

    // Calculer le bénéfice net
    const salePrice = parseFloat(productPrice.replace(/[^0-9.-]+/g, ""));
    const netProfit = salePrice - purchasePrice;

    // Récupérer les statistiques du produit (commandes validées)
    const { data: productStats, error: statsError } = await supabase
      .from('orders')
      .select('amount')
      .eq('product_id', productData.id)
      .eq('status', 'validated');

    if (statsError) {
      console.error('Error fetching product stats:', statsError);
    }

    const totalSales = productStats?.length || 0;
    let totalProfit = 0;

    // Calculer le bénéfice cumulé
    if (productStats) {
      for (const order of productStats) {
        const orderPrice = parseFloat(order.amount.replace(/[^0-9.-]+/g, ""));
        totalProfit += orderPrice - purchasePrice;
      }
    }

    // Envoyer l'email de notification
    const emailResponse = await resend.emails.send({
      from: "SatShop <onboarding@resend.dev>",
      to: ["admin@votre-domaine.com"], // ⚠️ IMPORTANT: Remplacez par votre email !
      subject: `🎉 Nouvelle commande reçue - ${productName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #2563eb; text-align: center; margin-bottom: 30px;">🛒 Nouvelle Commande</h1>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #1e40af; margin-bottom: 15px;">👤 Informations Client</h2>
              <p><strong>Nom :</strong> ${customerName}</p>
              <p><strong>Email :</strong> ${customerEmail}</p>
              <p><strong>Téléphone :</strong> ${customerPhone}</p>
            </div>

            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #1e40af; margin-bottom: 15px;">📦 Détails Produit</h2>
              <p><strong>Produit :</strong> ${productName}</p>
              <p><strong>Prix de vente :</strong> ${productPrice}</p>
              <p><strong>Prix d'achat :</strong> ${purchasePrice} DA</p>
              <p style="color: #16a34a; font-weight: bold; font-size: 18px;"><strong>💰 Bénéfice net :</strong> ${netProfit.toFixed(2)} DA</p>
            </div>

            <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px;">
              <h2 style="color: #16a34a; margin-bottom: 15px;">📊 Statistiques du Produit</h2>
              <p><strong>Nombre total de ventes :</strong> ${totalSales + 1}</p>
              <p><strong>Bénéfice cumulé :</strong> ${(totalProfit + netProfit).toFixed(2)} DA</p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px;">
                Cette commande a été passée le ${new Date().toLocaleDateString('fr-FR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("Email notification sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
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
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);