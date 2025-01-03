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

    console.log('Payment request received with client:', client_email)

    const chargilyApiUrl = 'https://epay.chargily.com.dz/api/invoice'
    const secretKey = Deno.env.get('CHARGILY_SECRET_KEY')

    if (!secretKey) {
      console.error('Missing CHARGILY_SECRET_KEY')
      return new Response(
        JSON.stringify({ 
          error: 'Configuration de paiement manquante',
          details: 'Clé API Chargily non configurée'
        }), 
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    console.log('Attempting payment creation with Chargily...')

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
      let errorText = await paymentResponse.text()
      console.error('Chargily API error response:', errorText)
      
      try {
        // Try to parse error as JSON if possible
        const errorJson = JSON.parse(errorText)
        errorText = JSON.stringify(errorJson, null, 2)
      } catch {
        // If not JSON, keep as is
      }
      
      let errorMessage = 'Erreur lors de la communication avec le service de paiement'
      if (paymentResponse.status === 401) {
        errorMessage = 'Erreur d\'authentification avec le service de paiement. Veuillez vérifier la clé API.'
        console.error('Authentication failed with Chargily API. Please verify the API key.')
      }

      return new Response(
        JSON.stringify({ 
          error: errorMessage,
          details: errorText,
          status: paymentResponse.status
        }), 
        {
          status: paymentResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const data = await paymentResponse.json()
    console.log('Chargily API success response:', data)

    if (!data.checkout_url) {
      console.error('Missing checkout_url in response:', data)
      return new Response(
        JSON.stringify({ 
          error: 'URL de paiement non reçue du service',
          details: data
        }), 
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify(data), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in create-payment function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Une erreur est survenue lors du traitement de la demande',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
