
import { supabase } from '@/integrations/supabase/client';

interface LinkedInConnectionConfig {
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: string;
  [key: string]: any;
}

export interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress?: string;
  email?: string;
  profilePicture?: string;
  profilePictureUrl?: string;
  headline?: string;
  location?: string;
  industry?: string;
  publicProfileUrl?: string;
  positions?: LinkedInPosition[];
}

export interface LinkedInPosition {
  id: string;
  title: string;
  companyName: string;
  description?: string;
  startDate?: {
    month?: number;
    year?: number;
  };
  endDate?: {
    month?: number;
    year?: number;
  };
  isCurrent?: boolean;
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

  // Search for LinkedIn profile by email (Note: Limited by LinkedIn API)
  async searchProfileByEmail(email: string, tenantId: string): Promise<LinkedInProfile | null> {
    try {
      // Note: LinkedIn's public API doesn't support email-based search
      // This would require LinkedIn Partner API or other premium access
      console.log('Searching LinkedIn profile for email:', email);
      
      // For now, we'll create a placeholder entry that can be manually updated
      const placeholderProfile: LinkedInProfile = {
        id: `placeholder-${Date.now()}`,
        firstName: email.split('@')[0].split('.')[0] || 'Unknown',
        lastName: email.split('@')[0].split('.')[1] || 'User',
        email: email,
        emailAddress: email,
        headline: 'Profile pending verification',
        location: 'Location not specified',
        industry: 'Industry not specified'
      };

      return placeholderProfile;
    } catch (error) {
      console.error('Error searching LinkedIn profile by email:', error);
      return null;
    }
  }

  // Enrich contact data with LinkedIn information
  async enrichContactData(personId: string, tenantId: string): Promise<boolean> {
    try {
      // Create or update enrichment record
      const { error } = await supabase
        .from('linkedin_profile_enrichments')
        .upsert({
          person_id: personId,
          tenant_id: tenantId,
          linkedin_data: {
            enriched_at: new Date().toISOString(),
            status: 'pending_verification'
          },
          match_confidence: 0.5,
          last_updated: new Date().toISOString()
        });

      if (error) {
        console.error('Error enriching contact data:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error enriching contact data:', error);
      return false;
    }
  }

  // Get enriched profile data for a person
  async getEnrichedProfile(personId: string): Promise<LinkedInProfile | null> {
    try {
      const { data, error } = await supabase
        .from('linkedin_profile_enrichments')
        .select('*')
        .eq('person_id', personId)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      const linkedinData = data.linkedin_data as any;
      
      return {
        id: linkedinData?.id || `enriched-${personId}`,
        firstName: linkedinData?.firstName || 'Unknown',
        lastName: linkedinData?.lastName || 'User',
        email: linkedinData?.email,
        emailAddress: linkedinData?.emailAddress,
        headline: linkedinData?.headline || 'Profile enriched from LinkedIn',
        location: linkedinData?.location,
        industry: linkedinData?.industry,
        profilePictureUrl: linkedinData?.profilePicture,
        publicProfileUrl: linkedinData?.publicProfileUrl
      };
    } catch (error) {
      console.error('Error getting enriched profile:', error);
      return null;
    }
  }

  // Bulk enrich contacts
  async bulkEnrichContacts(tenantId: string): Promise<{ success: number; failed: number }> {
    try {
      // Get all people without LinkedIn enrichment
      const { data: people, error } = await supabase
        .from('people')
        .select('id, email')
        .not('id', 'in', 
          supabase
            .from('linkedin_profile_enrichments')
            .select('person_id')
        );

      if (error) throw error;

      let success = 0;
      let failed = 0;

      for (const person of people || []) {
        const enriched = await this.enrichContactData(person.id, tenantId);
        if (enriched) {
          success++;
        } else {
          failed++;
        }
      }

      return { success, failed };
    } catch (error) {
      console.error('Error bulk enriching contacts:', error);
      return { success: 0, failed: 0 };
    }
  }

  // Post content to LinkedIn
  async postToLinkedIn(content: string, tenantId: string): Promise<boolean> {
    try {
      const accessToken = await this.getAccessToken(tenantId);
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await fetch(`${this.baseUrl}/ugcPosts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          author: 'urn:li:person:YOUR_PERSON_ID',
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: {
                text: content
              },
              shareMediaCategory: 'NONE'
            }
          },
          visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
          }
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Error posting to LinkedIn:', error);
      return false;
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
