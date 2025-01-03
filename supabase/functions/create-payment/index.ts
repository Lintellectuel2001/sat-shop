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

    // Validate required fields
    if (!amount || !client_name || !client_email) {
      console.error('Missing required fields')
      throw new Error('Informations de paiement incomplètes')
    }

    // Log key information for debugging (safely)
    console.log('API Key present:', !!secretKey, 'Length:', secretKey.length)
    console.log('Using Chargily API URL:', chargilyApiUrl)

    const cleanAmount = parseFloat(amount.toString().replace(' DA', '').trim())
    console.log('Cleaned amount:', cleanAmount)

    const paymentData = {
      client: client_name,
      client_email: client_email,
      client_phone: client_phone || '',
      amount: cleanAmount,
      discount: 0,
      mode: 'CIB',
      back_url: back_url,
      webhook_url: webhook_url,
      comment: 'Paiement Sat-shop',
    }

    console.log('Attempting payment creation with data:', {
      ...paymentData,
      client_email: '***@***.***' // Mask email for security
    })

    const paymentResponse = await fetch(chargilyApiUrl, {
      method: 'POST',
      headers: {
        'X-Authorization': secretKey,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    })

    console.log('Chargily API response status:', paymentResponse.status)
    
    const responseText = await paymentResponse.text()
    console.log('Chargily API raw response:', responseText)

    if (!paymentResponse.ok) {
      let errorMessage = 'Erreur lors de la création du paiement'
      
      if (paymentResponse.status === 401) {
        console.error('Authentication failed with Chargily API')
        console.error('Response:', responseText)
        console.error('Headers sent:', {
          'X-Authorization': 'present',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        })
        errorMessage = 'Erreur d\'authentification avec le service de paiement'
      } else if (paymentResponse.status === 400) {
        console.error('Bad request to Chargily API')
        console.error('Response:', responseText)
        console.error('Request data:', JSON.stringify(paymentData, null, 2))
        errorMessage = 'Données de paiement invalides'
      }

      throw new Error(errorMessage)
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      console.error('Failed to parse Chargily API response:', e)
      throw new Error('Réponse invalide du service de paiement')
    }

    if (!data.checkout_url) {
      console.error('Missing checkout_url in response:', data)
      throw new Error('URL de paiement non reçue')
    }

    console.log('Payment created successfully:', {
      checkout_url: data.checkout_url,
      status: 'success'
    })

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