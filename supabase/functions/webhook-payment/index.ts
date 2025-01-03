import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const supabase = createClient(supabaseUrl!, supabaseKey!)

    const payload = await req.json()
    console.log('Received webhook:', payload)

    // Mettre à jour le statut de la commande dans la base de données
    if (payload.invoice && payload.invoice.status === 'paid') {
      const { data, error } = await supabase
        .from('cart_history')
        .insert({
          action_type: 'payment_completed',
          user_id: payload.invoice.client_email, // Vous pouvez adapter ceci selon vos besoins
          product_id: payload.invoice.comment
        })

      if (error) {
        console.error('Error updating payment status:', error)
        throw error
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})