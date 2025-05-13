
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the JWT from the request headers
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Verify the user is a super admin
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Check if the user is a super admin
    const { data: isSuperAdmin, error: superAdminError } = await supabaseClient.rpc('is_super_admin', { 
      user_id: user.id 
    });

    if (superAdminError || !isSuperAdmin) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Not a super admin' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    // Parse the request body
    const { action, tenant_id, model_id, api_key } = await req.json();

    // Perform different actions based on the request
    if (action === 'get_tenant_model') {
      const { data, error } = await supabaseClient
        .from('tenant_ai_models')
        .select('model_id, api_key')
        .eq('tenant_id', tenant_id)
        .maybeSingle();

      if (error) throw error;

      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } 
    else if (action === 'update_tenant_model') {
      // Check if a record already exists
      const { data: existing } = await supabaseClient
        .from('tenant_ai_models')
        .select('*')
        .eq('tenant_id', tenant_id)
        .maybeSingle();

      let result;
      
      if (existing) {
        // Update existing record
        result = await supabaseClient
          .from('tenant_ai_models')
          .update({ 
            model_id: model_id,
            api_key: api_key,
            updated_at: new Date().toISOString()
          })
          .eq('tenant_id', tenant_id);
      } else {
        // Insert new record
        result = await supabaseClient
          .from('tenant_ai_models')
          .insert({
            tenant_id: tenant_id,
            model_id: model_id,
            api_key: api_key
          });
      }

      if (result.error) throw result.error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
