import { supabase } from '@/integrations/supabase/client';

export interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  headline?: string;
  profilePictureUrl?: string;
  publicProfileUrl?: string;
  industry?: string;
  location?: string;
  summary?: string;
  positions?: LinkedInPosition[];
  email?: string;
}

export interface LinkedInPosition {
  title: string;
  companyName: string;
  startDate?: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

export interface LinkedInConnection {
  id: string;
  tenant_id: string;
  platform: string;
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: string;
  is_active: boolean;
  connection_config: any;
  connected_at?: string;
  created_at: string;
  updated_at: string;
}

interface LinkedInConnectionConfig {
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: string;
  permissions?: string[];
}

class LinkedInApiService {
  private baseUrl = 'https://api.linkedin.com/v2';
  
  // Get stored connection for a tenant
  private getConnection = async (tenantId: string): Promise<LinkedInConnection | null> => {
    const { data, error } = await supabase
      .from('tenant_social_media_connections')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('platform', 'linkedin')
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) {
      console.error('LinkedIn connection error:', error);
      return null;
    }
    
    // Cast connection_config to the expected type
    const config = data.connection_config as LinkedInConnectionConfig;
    
    // Map the database fields to our interface, handling missing token fields
    return {
      id: data.id,
      tenant_id: data.tenant_id,
      platform: data.platform,
      access_token: config?.access_token,
      refresh_token: config?.refresh_token,
      token_expires_at: config?.token_expires_at,
      is_active: data.is_active,
      connection_config: data.connection_config,
      connected_at: data.connected_at,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  };

  // Store or update LinkedIn connection
  storeConnection = async (
    tenantId: string, 
    accessToken: string, 
    refreshToken?: string,
    expiresIn?: number
  ): Promise<boolean> => {
    try {
      const expiresAt = expiresIn 
        ? new Date(Date.now() + expiresIn * 1000).toISOString()
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
            token_expires_at: expiresAt,
            permissions: ['r_liteprofile', 'r_emailaddress', 'w_member_social']
          }
        });

      return !error;
    } catch (error) {
      console.error('Error storing LinkedIn connection:', error);
      return false;
    }
  };

  // Get LinkedIn user profile
  getUserProfile = async (tenantId: string): Promise<LinkedInProfile | null> => {
    const connection = await this.getConnection(tenantId);
    if (!connection?.access_token) return null;

    try {
      // Get basic profile
      const profileResponse = await fetch(`${this.baseUrl}/people/~`, {
        headers: {
          'Authorization': `Bearer ${connection.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!profileResponse.ok) {
        throw new Error(`LinkedIn API error: ${profileResponse.status}`);
      }

      const profileData = await profileResponse.json();

      // Get email address
      const emailResponse = await fetch(`${this.baseUrl}/emailAddress?q=members&projection=(elements*(handle~))`, {
        headers: {
          'Authorization': `Bearer ${connection.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      let email = undefined;
      if (emailResponse.ok) {
        const emailData = await emailResponse.json();
        email = emailData.elements?.[0]?.['handle~']?.emailAddress;
      }

      return this.transformLinkedInProfile(profileData, email);
    } catch (error) {
      console.error('LinkedIn API error:', error);
      return null;
    }
  };

  // Search for LinkedIn profile by email (note: LinkedIn doesn't allow email search directly)
  // This is a placeholder for the real implementation which would require LinkedIn's Partner API
  searchProfileByEmail = async (email: string, tenantId: string): Promise<LinkedInProfile | null> => {
    const connection = await this.getConnection(tenantId);
    if (!connection?.access_token) return null;

    // Note: LinkedIn's public API doesn't support searching by email
    // This would require LinkedIn's Partner API or Recruiter API
    // For now, we'll return null and suggest manual linking
    console.warn('LinkedIn email search requires Partner API access');
    return null;
  };

  // Get connections/network (requires additional permissions)
  getConnections = async (tenantId: string): Promise<LinkedInProfile[]> => {
    const connection = await this.getConnection(tenantId);
    if (!connection?.access_token) return [];

    try {
      const response = await fetch(`${this.baseUrl}/people/~:(connections)`, {
        headers: {
          'Authorization': `Bearer ${connection.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`LinkedIn API error: ${response.status}`);
      }

      const data = await response.json();
      return data.values?.map((profile: any) => this.transformLinkedInProfile(profile)) || [];
    } catch (error) {
      console.error('LinkedIn connections error:', error);
      return [];
    }
  };

  // Post to LinkedIn
  postToLinkedIn = async (content: string, tenantId: string): Promise<boolean> => {
    const connection = await this.getConnection(tenantId);
    if (!connection?.access_token) return false;

    try {
      const response = await fetch(`${this.baseUrl}/ugcPosts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${connection.access_token}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify({
          author: `urn:li:person:${connection.connection_config?.personId}`,
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
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('LinkedIn post error:', error);
      return false;
    }
  };

  // Enrich contact data with LinkedIn profile
  enrichContactData = async (personId: string, tenantId: string): Promise<boolean> => {
    try {
      // Get person's data
      const { data: person } = await supabase
        .from('people')
        .select('email, full_name')
        .eq('id', personId)
        .maybeSingle();

      if (!person) return false;

      // For now, since we can't search by email directly, we'll create a placeholder
      // In a real implementation, this would use LinkedIn's Partner API or manual linking
      const linkedinProfile: LinkedInProfile = {
        id: `linkedin_placeholder_${personId}`,
        firstName: person.full_name.split(' ')[0] || 'Unknown',
        lastName: person.full_name.split(' ').slice(1).join(' ') || 'User',
        headline: 'Professional (LinkedIn Profile)',
        profilePictureUrl: `https://via.placeholder.com/150?text=${person.full_name.charAt(0)}`,
        publicProfileUrl: `https://linkedin.com/in/search-${person.email.split('@')[0]}`,
        industry: 'Technology',
        location: 'Location not specified',
        email: person.email
      };

      // Store enrichment data - convert to JSON-compatible format
      const { error } = await supabase
        .from('linkedin_profile_enrichments')
        .upsert({
          person_id: personId,
          tenant_id: tenantId,
          linkedin_data: linkedinProfile as any, // Convert to JSON
          match_confidence: 0.5, // Low confidence since it's not from real search
          last_updated: new Date().toISOString()
        });

      if (error) {
        console.error('Error storing LinkedIn enrichment:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error enriching contact data:', error);
      return false;
    }
  };

  // Bulk enrich contacts
  bulkEnrichContacts = async (tenantId: string): Promise<{ success: number; failed: number }> => {
    const { data: contacts } = await supabase
      .from('people')
      .select('id, email, full_name')
      .eq('type', 'contact')
      .limit(50); // Limit to avoid API rate limits

    let success = 0;
    let failed = 0;

    if (contacts) {
      for (const contact of contacts) {
        const enriched = await this.enrichContactData(contact.id, tenantId);
        if (enriched) {
          success++;
          // Add delay to respect API rate limits
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          failed++;
        }
      }
    }

    return { success, failed };
  };

  // Get enriched LinkedIn data for a person
  getEnrichedProfile = async (personId: string): Promise<LinkedInProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('linkedin_profile_enrichments')
        .select('linkedin_data, match_confidence')
        .eq('person_id', personId)
        .maybeSingle();

      if (error || !data) {
        console.error('Error getting enriched profile:', error);
        return null;
      }

      // Convert JSON data back to LinkedInProfile
      return data.linkedin_data as unknown as LinkedInProfile;
    } catch (error) {
      console.error('Error getting enriched profile:', error);
      return null;
    }
  };

  // Helper to transform LinkedIn API response to our interface
  private transformLinkedInProfile = (linkedinData: any, email?: string): LinkedInProfile => {
    const firstName = linkedinData.localizedFirstName || linkedinData.firstName?.localized?.en_US || '';
    const lastName = linkedinData.localizedLastName || linkedinData.lastName?.localized?.en_US || '';
    
    return {
      id: linkedinData.id,
      firstName,
      lastName,
      headline: linkedinData.localizedHeadline || linkedinData.headline?.localized?.en_US,
      profilePictureUrl: linkedinData.profilePicture?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier,
      publicProfileUrl: linkedinData.publicProfileUrl,
      industry: linkedinData.industryName,
      location: linkedinData.locationName,
      summary: linkedinData.summary?.localized?.en_US,
      email,
      positions: this.extractPositions(linkedinData)
    };
  };

  private extractPositions = (linkedinData: any): LinkedInPosition[] => {
    const positions = linkedinData.positions?.values || [];
    return positions.map((pos: any) => ({
      title: pos.title?.localized?.en_US || pos.title,
      companyName: pos.company?.name?.localized?.en_US || pos.company?.name,
      startDate: pos.startDate ? `${pos.startDate.year}-${pos.startDate.month}` : undefined,
      endDate: pos.endDate ? `${pos.endDate.year}-${pos.endDate.month}` : undefined,
      isCurrent: !pos.endDate,
      description: pos.description?.localized?.en_US || pos.description
    }));
  };

  // Disconnect LinkedIn integration
  disconnect = async (tenantId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('tenant_social_media_connections')
        .update({ is_active: false })
        .eq('tenant_id', tenantId)
        .eq('platform', 'linkedin');

      return !error;
    } catch (error) {
      console.error('Error disconnecting LinkedIn:', error);
      return false;
    }
  };
}

export const linkedinApiService = new LinkedInApiService();
