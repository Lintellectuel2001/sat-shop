import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TelegramNotificationRequest {
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
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Input validation
    const requestData = await req.json();
    const { orderId, customerName, customerEmail, customerPhone, productName, productPrice }: TelegramNotificationRequest = requestData;
    
    // Validate required fields
    if (!orderId || !customerName || !customerEmail || !productName || !productPrice) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Sanitize inputs to prevent injection attacks
    const sanitize = (input: string) => input.replace(/[<>'"&]/g, '');
    const sanitizedData = {
      orderId: sanitize(orderId),
      customerName: sanitize(customerName),
      customerEmail: sanitize(customerEmail),
      customerPhone: sanitize(customerPhone || ''),
      productName: sanitize(productName),
      productPrice: sanitize(productPrice)
    };

    const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const chatId = Deno.env.get("TELEGRAM_CHAT_ID");

    if (!botToken || !chatId) {
      console.error("Missing Telegram configuration");
      return new Response(
        JSON.stringify({ error: "Telegram configuration missing" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Créer le message formaté avec données sanitisées
    const message = `🛒 *NOUVELLE COMMANDE*

📦 *Produit:* ${sanitizedData.productName}
💰 *Prix:* ${sanitizedData.productPrice}

👤 *Client:*
• Nom: ${sanitizedData.customerName}
• Email: ${sanitizedData.customerEmail}
• Téléphone: ${sanitizedData.customerPhone}

🆔 *ID Commande:* ${sanitizedData.orderId}

📅 *Date:* ${new Date().toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;

    // Envoyer le message via l'API Telegram
    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      }),
    });

    const telegramData = await telegramResponse.json();

    if (!telegramResponse.ok) {
      console.error("Telegram API error:", telegramData);
      return new Response(
        JSON.stringify({ error: "Failed to send Telegram notification", details: telegramData }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Telegram notification sent successfully:", telegramData);

    return new Response(JSON.stringify({ success: true, telegramData }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in send-telegram-notification function:", error);
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