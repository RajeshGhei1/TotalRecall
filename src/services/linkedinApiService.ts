
import { supabase } from '@/integrations/supabase/client';

interface LinkedInConnectionConfig {
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: string;
  [key: string]: any;
}

interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress?: string;
  profilePicture?: string;
}

class LinkedInApiService {
  private baseUrl = 'https://api.linkedin.com/v2';

  // Store OAuth connection in database
  async storeConnection(
    tenantId: string,
    accessToken: string,
    refreshToken?: string,
    expiresIn?: number
  ): Promise<boolean> {
    try {
      const expiresAt = expiresIn 
        ? new Date(Date.now() + (expiresIn * 1000)).toISOString()
        : null;

      const { error } = await supabase
        .from('tenant_social_media_connections')
        .upsert({
          tenant_id: tenantId,
          platform: 'linkedin',
          is_active: true,
          connection_config: {
            access_token: accessToken,
            refresh_token: refreshToken,
            token_expires_at: expiresAt
          },
          connected_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error storing LinkedIn connection:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error storing LinkedIn connection:', error);
      return false;
    }
  }

  // Get stored access token
  private async getAccessToken(tenantId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('tenant_social_media_connections')
        .select('connection_config')
        .eq('tenant_id', tenantId)
        .eq('platform', 'linkedin')
        .eq('is_active', true)
        .maybeSingle();

      if (error || !data) {
        console.error('Error fetching LinkedIn access token:', error);
        return null;
      }

      const config = data.connection_config as LinkedInConnectionConfig;
      return config?.access_token || null;
    } catch (error) {
      console.error('Error getting LinkedIn access token:', error);
      return null;
    }
  }

  // Get user profile from LinkedIn API
  async getUserProfile(tenantId: string): Promise<LinkedInProfile | null> {
    try {
      const accessToken = await this.getAccessToken(tenantId);
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await fetch(`${this.baseUrl}/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`LinkedIn API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        id: data.id,
        firstName: data.firstName?.localized?.en_US || '',
        lastName: data.lastName?.localized?.en_US || '',
        emailAddress: data.emailAddress,
        profilePicture: data.profilePicture?.displayImage
      };
    } catch (error) {
      console.error('Error fetching LinkedIn profile:', error);
      return null;
    }
  }

  // Disconnect LinkedIn integration
  async disconnect(tenantId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tenant_social_media_connections')
        .update({ is_active: false })
        .eq('tenant_id', tenantId)
        .eq('platform', 'linkedin');

      if (error) {
        console.error('Error disconnecting LinkedIn:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error disconnecting LinkedIn:', error);
      return false;
    }
  }

  // Check if LinkedIn is connected for a tenant
  async isConnected(tenantId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('tenant_social_media_connections')
        .select('id')
        .eq('tenant_id', tenantId)
        .eq('platform', 'linkedin')
        .eq('is_active', true)
        .maybeSingle();

      return !error && !!data;
    } catch (error) {
      console.error('Error checking LinkedIn connection:', error);
      return false;
    }
  }
}

export const linkedinApiService = new LinkedInApiService();
