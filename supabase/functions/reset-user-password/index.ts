
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ResetPasswordRequest {
  userId: string;
  tenantId: string;
  newPassword: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create admin client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { userId, tenantId, newPassword }: ResetPasswordRequest = await req.json();

    console.log('Password reset request for user:', userId, 'in tenant:', tenantId);

    // Verify the requesting user has permission (tenant admin or super admin)
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Check if the requesting user is a tenant admin for this tenant or super admin
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'super_admin') {
      // Super admin can reset any password
    } else {
      // Check if user is tenant admin for this specific tenant
      const { data: userTenant } = await supabaseAdmin
        .from('user_tenants')
        .select('user_role')
        .eq('user_id', user.id)
        .eq('tenant_id', tenantId)
        .single();

      if (!userTenant || userTenant.user_role !== 'tenant_admin') {
        throw new Error('Insufficient permissions');
      }
    }

    // Verify the target user exists and is in the specified tenant
    const { data: targetUserTenant } = await supabaseAdmin
      .from('user_tenants')
      .select('*')
      .eq('user_id', userId)
      .eq('tenant_id', tenantId)
      .single();

    if (!targetUserTenant) {
      throw new Error('User not found in tenant');
    }

    // Reset the user's password using admin API
    const { data: updateResult, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    );

    if (updateError) {
      console.error('Error updating password:', updateError);
      throw updateError;
    }

    console.log('Password reset successful for user:', userId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Password reset successfully',
        userId: updateResult.user.id 
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error('Error in reset-user-password function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        success: false 
      }),
      {
        status: error.message === 'Unauthorized' || error.message === 'Insufficient permissions' ? 403 : 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
