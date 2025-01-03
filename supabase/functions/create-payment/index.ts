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

    const chargilyApiUrl = 'https://epay.chargily.com.dz/api/invoice'
    const publicKey = Deno.env.get('CHARGILY_PUBLIC_KEY')
    const secretKey = Deno.env.get('CHARGILY_SECRET_KEY')

    console.log('Creating payment for:', { amount, client_name, client_email })

    const response = await fetch(chargilyApiUrl, {
      method: 'POST',
      headers: {
        'X-Authorization': secretKey || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client: client_name,
        client_email: client_email,
        client_phone: client_phone || '',
        amount: amount,
        discount: 0,
        mode: 'CIB', // Mode de paiement (CIB, EDAHABIA)
        back_url: back_url,
        webhook_url: webhook_url,
        comment: 'Paiement Sat-shop',
      }),
    })

    const data = await response.json()
    console.log('Payment response:', data)

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error creating payment:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})