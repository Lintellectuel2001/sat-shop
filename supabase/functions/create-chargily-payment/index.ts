
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.5'
import { ChargilyClient, Currency, CheckoutMode, Locale } from 'https://esm.sh/@chargily/chargily-pay@2.1.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the request body
    const { amount, productName, cartId, name = "Customer", productId } = await req.json()

    // Validation des entrées
    if (!amount || !productName) {
      return new Response(
        JSON.stringify({ 
          error: "Le montant et le nom du produit sont obligatoires" 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Vérifier que le montant est un nombre
    const numericAmount = Number(amount)
    if (isNaN(numericAmount)) {
      return new Response(
        JSON.stringify({ 
          error: "Le montant doit être un nombre valide" 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    console.log("Processing payment request:", { amount: numericAmount, productName, cartId, productId })

    // Initialiser le client Chargily
    const chargilyClient = new ChargilyClient({
      apiKey: Deno.env.get('CHARGILY_API_KEY') || '',
      secretKey: Deno.env.get('CHARGILY_SECRET_KEY') || '',
    })

    // Base URL de l'application pour le webhook
    const baseUrl = Deno.env.get('APP_URL') || 'https://example.com'

    // Créer un checkout Chargily
    const checkoutData = await chargilyClient.createCheckout({
      amount: numericAmount,
      currency: Currency.DZD,
      checkoutMode: CheckoutMode.PAYMENT,
      successUrl: `${baseUrl}/payment/success?cart_id=${cartId || ''}`,
      failureUrl: `${baseUrl}/payment/failure?cart_id=${cartId || ''}`,
      webhookEndpoint: `${Deno.env.get('SUPABASE_URL')}/functions/v1/chargily-webhook`,
      customerInfo: {
        name: name,
        email: "customer@example.com", // Email fictif pour test
        phoneNumber: "+213000000000", // Numéro fictif pour test
      },
      items: [
        {
          name: productName,
          price: numericAmount,
          quantity: 1,
        },
      ],
      locale: Locale.FR,
      metadata: {
        cart_id: cartId || '',
        product_id: productId || '',
      }
    })

    console.log("Chargily checkout created:", checkoutData)

    // Mettre à jour le lien de paiement dans la table products si productId est fourni
    if (productId) {
      const { error: updateError } = await supabaseClient
        .from('products')
        .update({ payment_link: checkoutData.checkout_url })
        .eq('id', productId)
      
      if (updateError) {
        console.error("Error updating product payment link:", updateError)
      } else {
        console.log("Product payment link updated successfully")
      }
    }

    // Retourner l'URL de checkout et l'ID du paiement
    return new Response(
      JSON.stringify({
        checkout_url: checkoutData.checkout_url,
        payment_id: checkoutData.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error("Error processing payment:", error)
    
    return new Response(
      JSON.stringify({
        error: "Une erreur est survenue lors du traitement du paiement",
        details: error.message,
        stack: error.stack,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
