import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { ChargilyClient } from 'npm:@chargily/chargily-pay'

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

    const secretKey = Deno.env.get('Chargily pay')
    if (!secretKey) {
      console.error('Missing Chargily pay secret key')
      throw new Error('Configuration de paiement manquante')
    }

    // Initialize Chargily client
    const client = new ChargilyClient(secretKey)

    // Validate required fields
    if (!amount || !client_name || !client_email) {
      console.error('Missing required fields')
      throw new Error('Informations de paiement incomplètes')
    }

    const cleanAmount = parseFloat(amount.toString().replace(' DA', '').trim())
    console.log('Cleaned amount:', cleanAmount)

    // Create checkout using the SDK's createCheckout method
    const response = await client.createCheckout({
      items: [{
        name: 'Sat-shop Service',
        amount: cleanAmount,
        quantity: 1
      }],
      success_url: back_url,
      failure_url: back_url,
      webhook_url: webhook_url,
      customer: {
        name: client_name,
        email: client_email,
        phone: client_phone || ''
      },
      payment_method: 'CIB',
      locale: 'fr',
      metadata: {
        source: 'sat-shop'
      }
    })

    console.log('Chargily checkout created:', response)

    if (!response.checkout_url) {
      console.error('Missing checkout_url in response:', response)
      throw new Error('URL de paiement non reçue')
    }

    return new Response(
      JSON.stringify({ checkout_url: response.checkout_url }),
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