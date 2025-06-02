
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Extract the JWT token
    const token = authHeader.replace('Bearer ', '')
    
    // Get user from token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    if (userError || !user) {
      throw new Error('Invalid user token')
    }

    // Get request body
    const {
      action,
      entity_type,
      entity_id,
      old_values,
      new_values,
      severity = 'info',
      module_name,
      additional_context = {}
    } = await req.json()

    // Get IP address and user agent
    const ip_address = req.headers.get('x-forwarded-for') || 
                      req.headers.get('x-real-ip') || 
                      '127.0.0.1'
    const user_agent = req.headers.get('user-agent')

    // Get user's tenant (if any)
    const { data: userTenant } = await supabaseClient
      .from('user_tenants')
      .select('tenant_id')
      .eq('user_id', user.id)
      .single()

    // Call the log_audit_event function
    const { data, error } = await supabaseClient.rpc('log_audit_event', {
      p_user_id: user.id,
      p_tenant_id: userTenant?.tenant_id || null,
      p_action: action,
      p_entity_type: entity_type,
      p_entity_id: entity_id || null,
      p_old_values: old_values || null,
      p_new_values: new_values || null,
      p_ip_address: ip_address,
      p_user_agent: user_agent,
      p_session_id: null, // Could be enhanced to track sessions
      p_severity: severity,
      p_module_name: module_name || null,
      p_additional_context: additional_context
    })

    if (error) {
      console.error('Error logging audit event:', error)
      throw error
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        audit_id: data 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in log-audit-event function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
