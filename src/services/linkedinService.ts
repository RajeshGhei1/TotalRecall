
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
}

export interface LinkedInPosition {
  title: string;
  companyName: string;
  startDate?: string;
  endDate?: string;
  isCurrent: boolean;
}

export interface LinkedInConnection {
  id: string;
  tenant_id: string;
  access_token: string;
  refresh_token?: string;
  expires_at: string;
  is_active: boolean;
  connection_config: {
    client_id: string;
    client_secret: string;
    scopes: string[];
  };
}

class LinkedInService {
  private getConnection = async (tenantId: string): Promise<LinkedInConnection | null> => {
    const { data, error } = await supabase
      .from('tenant_social_media_connections')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('platform', 'linkedin')
      .eq('is_active', true)
      .single();

    if (error || !data) return null;
    return data as LinkedInConnection;
  };

  searchProfileByEmail = async (email: string, tenantId: string): Promise<LinkedInProfile | null> => {
    const connection = await this.getConnection(tenantId);
    if (!connection) return null;

    try {
      // In a real implementation, this would call LinkedIn's API
      // For now, we'll simulate the response
      const mockProfile: LinkedInProfile = {
        id: `linkedin_${email.split('@')[0]}`,
        firstName: email.split('@')[0].split('.')[0] || 'Unknown',
        lastName: email.split('@')[0].split('.')[1] || 'User',
        headline: 'Professional at LinkedIn',
        profilePictureUrl: `https://via.placeholder.com/150?text=${email.charAt(0).toUpperCase()}`,
        publicProfileUrl: `https://linkedin.com/in/${email.split('@')[0]}`,
        industry: 'Technology',
        location: 'United States'
      };

      return mockProfile;
    } catch (error) {
      console.error('LinkedIn API error:', error);
      return null;
    }
  };

  enrichContactData = async (personId: string, tenantId: string): Promise<boolean> => {
    try {
      // Get person's email from the database
      const { data: person } = await supabase
        .from('people')
        .select('email, full_name')
        .eq('id', personId)
        .single();

      if (!person) return false;

      // Search for LinkedIn profile
      const linkedinProfile = await this.searchProfileByEmail(person.email, tenantId);
      
      if (linkedinProfile) {
        // Store the LinkedIn data
        await supabase
          .from('custom_field_values')
          .upsert({
            entity_id: personId,
            entity_type: 'contact',
            field_id: null, // We'll need to create custom fields for LinkedIn data
            value: {
              linkedin_profile: linkedinProfile,
              last_enriched: new Date().toISOString()
            }
          });

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error enriching contact data:', error);
      return false;
    }
  };

  bulkEnrichContacts = async (tenantId: string): Promise<{ success: number; failed: number }> => {
    const { data: contacts } = await supabase
      .from('people')
      .select('id, email')
      .eq('type', 'contact');

    let success = 0;
    let failed = 0;

    if (contacts) {
      for (const contact of contacts) {
        const enriched = await this.enrichContactData(contact.id, tenantId);
        if (enriched) success++;
        else failed++;
      }
    }

    return { success, failed };
  };

  postToLinkedIn = async (content: string, tenantId: string): Promise<boolean> => {
    const connection = await this.getConnection(tenantId);
    if (!connection) return false;

    try {
      // In a real implementation, this would call LinkedIn's API to post content
      console.log('Posting to LinkedIn:', content);
      return true;
    } catch (error) {
      console.error('Error posting to LinkedIn:', error);
      return false;
    }
  };
}

export const linkedinService = new LinkedInService();
