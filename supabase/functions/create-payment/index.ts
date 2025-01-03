import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { amount, client_name, client_email, client_phone, back_url, webhook_url } = await req.json()

    console.log('Received payment request:', {
      amount,
      client_name,
      client_email,
      client_phone,
      back_url,
      webhook_url
    })

    const chargilyApiUrl = 'https://epay.chargily.com.dz/api/invoice'
    const secretKey = Deno.env.get('CHARGILY_SECRET_KEY')

    if (!secretKey) {
      console.error('Missing CHARGILY_SECRET_KEY')
      throw new Error('Configuration de paiement manquante')
    }

    const response = await fetch(chargilyApiUrl, {
      method: 'POST',
      headers: {
        'X-Authorization': secretKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client: client_name,
        client_email: client_email,
        client_phone: client_phone || '',
        amount: amount,
        discount: 0,
        mode: 'CIB',
        back_url: back_url,
        webhook_url: webhook_url,
        comment: 'Paiement Sat-shop',
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Chargily API error:', errorData)
      throw new Error('Erreur lors de la communication avec le service de paiement')
    }

    const data = await response.json()
    console.log('Chargily API response:', data)

    if (!data.checkout_url) {
      console.error('Missing checkout_url in response:', data)
      throw new Error('URL de paiement non reçue du service')
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in create-payment function:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Une erreur est survenue',
        details: error instanceof Error ? error.stack : undefined
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})