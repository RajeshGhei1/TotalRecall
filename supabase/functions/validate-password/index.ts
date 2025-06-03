
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PasswordRequirements {
  password_min_length: number;
  password_require_uppercase: boolean;
  password_require_lowercase: boolean;
  password_require_numbers: boolean;
  password_require_symbols: boolean;
}

const DEFAULT_REQUIREMENTS: PasswordRequirements = {
  password_min_length: 8,
  password_require_uppercase: false,
  password_require_lowercase: false,
  password_require_numbers: false,
  password_require_symbols: false,
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { password } = await req.json();

    if (!password) {
      return new Response(
        JSON.stringify({ 
          isValid: false, 
          error: 'Password is required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Fetch password requirements from global settings
    const { data: settings, error: settingsError } = await supabaseClient
      .from('global_settings')
      .select('setting_key, setting_value')
      .eq('category', 'security')
      .in('setting_key', [
        'password_min_length',
        'password_require_uppercase',
        'password_require_lowercase',
        'password_require_numbers',
        'password_require_symbols'
      ]);

    if (settingsError) {
      console.error('Failed to fetch password requirements:', settingsError);
    }

    const settingsMap = settings?.reduce((acc, setting) => {
      acc[setting.setting_key] = setting.setting_value;
      return acc;
    }, {} as Record<string, any>) || {};

    const requirements: PasswordRequirements = {
      password_min_length: settingsMap.password_min_length !== undefined 
        ? Number(settingsMap.password_min_length) 
        : DEFAULT_REQUIREMENTS.password_min_length,
      password_require_uppercase: settingsMap.password_require_uppercase !== undefined 
        ? Boolean(settingsMap.password_require_uppercase) 
        : DEFAULT_REQUIREMENTS.password_require_uppercase,
      password_require_lowercase: settingsMap.password_require_lowercase !== undefined 
        ? Boolean(settingsMap.password_require_lowercase) 
        : DEFAULT_REQUIREMENTS.password_require_lowercase,
      password_require_numbers: settingsMap.password_require_numbers !== undefined 
        ? Boolean(settingsMap.password_require_numbers) 
        : DEFAULT_REQUIREMENTS.password_require_numbers,
      password_require_symbols: settingsMap.password_require_symbols !== undefined 
        ? Boolean(settingsMap.password_require_symbols) 
        : DEFAULT_REQUIREMENTS.password_require_symbols,
    };

    console.log('Using password requirements:', requirements);

    // Validate password against requirements
    const errors: string[] = [];

    // Check length
    if (password.length < requirements.password_min_length) {
      errors.push(`Password must be at least ${requirements.password_min_length} characters`);
    }

    // Check uppercase
    if (requirements.password_require_uppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    // Check lowercase
    if (requirements.password_require_lowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    // Check numbers
    if (requirements.password_require_numbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    // Check symbols
    if (requirements.password_require_symbols && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one symbol');
    }

    const isValid = errors.length === 0;

    return new Response(
      JSON.stringify({ 
        isValid, 
        errors,
        requirements 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error validating password:', error);
    return new Response(
      JSON.stringify({ 
        isValid: false, 
        error: 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
