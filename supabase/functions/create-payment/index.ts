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

    console.log('Payment request received:', {
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

    console.log('Attempting to create payment with Chargily...')

    const paymentResponse = await fetch(chargilyApiUrl, {
      method: 'POST',
      headers: {
        'X-Authorization': secretKey,
        'Accept': 'application/json',
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

    console.log('Chargily API response status:', paymentResponse.status)

    if (!paymentResponse.ok) {
      const errorText = await paymentResponse.text()
      console.error('Chargily API error response:', errorText)
      
      let errorMessage = 'Erreur lors de la création du paiement'
      if (paymentResponse.status === 401) {
        console.error('Authentication failed with Chargily API. Please verify the API key.')
        errorMessage = 'Erreur d\'authentification avec le service de paiement'
      } else if (paymentResponse.status === 400) {
        console.error('Bad request to Chargily API. Please verify the payment data.')
        errorMessage = 'Données de paiement invalides'
      }

      throw new Error(errorMessage)
    }

    const data = await paymentResponse.json()
    console.log('Chargily API success response:', data)

    if (!data.checkout_url) {
      console.error('Missing checkout_url in response:', data)
      throw new Error('URL de paiement non reçue')
    }

    return new Response(
      JSON.stringify(data),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Payment process error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Une erreur est survenue',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})