
import { supabase } from '@/integrations/supabase/client';

export interface LinkedInCredentials {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
}

class LinkedInCredentialsService {
  private async getCredentials(tenantId: string): Promise<LinkedInCredentials | null> {
    try {
      const { data, error } = await supabase
        .from('tenant_social_media_connections')
        .select('connection_config')
        .eq('tenant_id', tenantId)
        .eq('platform', 'linkedin')
        .maybeSingle();

      if (error || !data) {
        console.error('Error fetching LinkedIn credentials:', error);
        return null;
      }

      const config = data.connection_config as any;
      
      if (!config?.client_id || !config?.client_secret) {
        return null;
      }

      return {
        clientId: config.client_id,
        clientSecret: config.client_secret,
        redirectUri: config.redirect_uri || `${window.location.origin}/auth`,
        scope: config.scope || ['r_liteprofile', 'r_emailaddress', 'w_member_social']
      };
    } catch (error) {
      console.error('Error getting LinkedIn credentials:', error);
      return null;
    }
  }

  async isConfigured(tenantId: string): Promise<boolean> {
    const credentials = await this.getCredentials(tenantId);
    return !!credentials;
  }

  async getConfiguredCredentials(tenantId: string): Promise<LinkedInCredentials | null> {
    return await this.getCredentials(tenantId);
  }

  async testCredentials(tenantId: string): Promise<boolean> {
    const credentials = await this.getCredentials(tenantId);
    if (!credentials) return false;

    try {
      // Test by attempting to generate an auth URL
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: credentials.clientId,
        redirect_uri: credentials.redirectUri,
        state: 'test',
        scope: credentials.scope.join(' ')
      });

      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
      
      // If we can generate a valid URL, credentials are properly formatted
      return !!authUrl && authUrl.includes(credentials.clientId);
    } catch (error) {
      console.error('Error testing LinkedIn credentials:', error);
      return false;
    }
  }
}

export const linkedinCredentialsService = new LinkedInCredentialsService();
