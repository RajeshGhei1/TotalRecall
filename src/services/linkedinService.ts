
import { linkedinApiService, LinkedInProfile, LinkedInPosition } from './linkedinApiService';

// Re-export types for backward compatibility
export type { LinkedInProfile, LinkedInPosition };

// Backward compatibility wrapper - delegates to the new API service
class LinkedInService {
  searchProfileByEmail = async (email: string, tenantId: string): Promise<LinkedInProfile | null> => {
    return await linkedinApiService.searchProfileByEmail(email, tenantId);
  };

  enrichContactData = async (personId: string, tenantId: string): Promise<boolean> => {
    return await linkedinApiService.enrichContactData(personId, tenantId);
  };

  bulkEnrichContacts = async (tenantId: string): Promise<{ success: number; failed: number }> => {
    return await linkedinApiService.bulkEnrichContacts(tenantId);
  };

  postToLinkedIn = async (content: string, tenantId: string): Promise<boolean> => {
    return await linkedinApiService.postToLinkedIn(content, tenantId);
  };

  getEnrichedProfile = async (personId: string): Promise<LinkedInProfile | null> => {
    return await linkedinApiService.getEnrichedProfile(personId);
  };
}

export const linkedinService = new LinkedInService();

// Also export the new API service for direct access
export { linkedinApiService };
