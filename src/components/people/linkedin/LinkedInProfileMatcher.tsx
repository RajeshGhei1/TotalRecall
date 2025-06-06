
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ExternalLink, 
  Search, 
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { linkedinApiService, LinkedInProfile } from '@/services/linkedinApiService';
import { useTenantContext } from '@/contexts/TenantContext';

interface LinkedInProfileMatcherProps {
  personId: string;
  personEmail: string;
  personName: string;
  onProfileLinked?: (profile: LinkedInProfile) => void;
}

export const LinkedInProfileMatcher: React.FC<LinkedInProfileMatcherProps> = ({
  personId,
  personEmail,
  personName,
  onProfileLinked
}) => {
  const { toast } = useToast();
  const { selectedTenantId } = useTenantContext();
  const [isSearching, setIsSearching] = useState(false);
  const [foundProfile, setFoundProfile] = useState<LinkedInProfile | null>(null);
  const [isLinked, setIsLinked] = useState(false);
  const [enrichmentAttempted, setEnrichmentAttempted] = useState(false);

  const searchLinkedInProfile = async () => {
    if (!selectedTenantId) {
      toast({
        title: "No Tenant Selected",
        description: "Please select a tenant to search LinkedIn profiles",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    setEnrichmentAttempted(true);
    
    try {
      // First check if already enriched
      const existingProfile = await linkedinApiService.getEnrichedProfile(personId);
      if (existingProfile) {
        setFoundProfile(existingProfile);
        setIsLinked(true);
        toast({
          title: "Profile Already Linked",
          description: `LinkedIn profile for ${existingProfile.firstName} ${existingProfile.lastName} is already linked`
        });
        return;
      }

      // Try to search (note: this is limited without Partner API)
      const profile = await linkedinApiService.searchProfileByEmail(personEmail, selectedTenantId);
      
      if (profile) {
        setFoundProfile(profile);
        toast({
          title: "LinkedIn Profile Found",
          description: `Found profile for ${profile.firstName} ${profile.lastName}`
        });
      } else {
        // Create enrichment entry for manual linking
        const success = await linkedinApiService.enrichContactData(personId, selectedTenantId);
        if (success) {
          const enrichedProfile = await linkedinApiService.getEnrichedProfile(personId);
          setFoundProfile(enrichedProfile);
          toast({
            title: "Profile Entry Created",
            description: "A LinkedIn profile entry has been created. Please verify and update manually if needed.",
            variant: "default"
          });
        } else {
          toast({
            title: "No Profile Found",
            description: "No LinkedIn profile found for this contact. LinkedIn's API has limited search capabilities.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Failed to search LinkedIn profiles. Please check your connection.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const linkProfile = async () => {
    if (!foundProfile || !selectedTenantId) return;

    const success = await linkedinApiService.enrichContactData(personId, selectedTenantId);
    
    if (success) {
      setIsLinked(true);
      onProfileLinked?.(foundProfile);
      toast({
        title: "Profile Linked",
        description: "LinkedIn profile has been linked to this contact"
      });
    } else {
      toast({
        title: "Linking Failed",
        description: "Failed to link LinkedIn profile",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">in</span>
          </div>
          LinkedIn Profile Matching
        </CardTitle>
        <CardDescription>
          Find and link LinkedIn profile for {personName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!foundProfile && !enrichmentAttempted && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-600 mb-4">
              Search for LinkedIn profile using email: {personEmail}
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 mt-0.5" />
                <div className="text-xs text-amber-800">
                  <p className="font-medium">LinkedIn API Limitations</p>
                  <p>LinkedIn's public API doesn't support email-based search. This feature creates a placeholder entry that can be manually updated with actual profile data.</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={searchLinkedInProfile} 
              disabled={isSearching}
              className="w-full"
            >
              {isSearching ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search LinkedIn
                </>
              )}
            </Button>
          </div>
        )}

        {foundProfile && (
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <Avatar className="w-16 h-16">
                <AvatarImage src={foundProfile.profilePictureUrl} />
                <AvatarFallback>
                  {foundProfile.firstName.charAt(0)}{foundProfile.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h4 className="font-medium">
                  {foundProfile.firstName} {foundProfile.lastName}
                </h4>
                {foundProfile.headline && (
                  <p className="text-sm text-gray-600">{foundProfile.headline}</p>
                )}
                {foundProfile.location && (
                  <p className="text-xs text-gray-500">{foundProfile.location}</p>
                )}
                
                <div className="flex items-center gap-2 mt-2">
                  {foundProfile.industry && (
                    <Badge variant="outline">{foundProfile.industry}</Badge>
                  )}
                  {foundProfile.publicProfileUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(foundProfile.publicProfileUrl, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View Profile
                    </Button>
                  )}
                </div>
                
                {foundProfile.email && foundProfile.email !== personEmail && (
                  <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded">
                    <p className="text-xs text-amber-800">
                      <strong>Note:</strong> Profile email ({foundProfile.email}) differs from contact email ({personEmail})
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {!isLinked ? (
                <>
                  <Button onClick={linkProfile} className="flex-1">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Link Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setFoundProfile(null);
                      setEnrichmentAttempted(false);
                    }}
                  >
                    Search Again
                  </Button>
                </>
              ) : (
                <div className="flex items-center justify-center w-full py-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-600 font-medium">Profile Linked</span>
                </div>
              )}
            </div>
          </div>
        )}

        {enrichmentAttempted && !foundProfile && (
          <div className="text-center py-4">
            <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-4">
              No LinkedIn profile found or created for this contact.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setEnrichmentAttempted(false);
              }}
            >
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LinkedInProfileMatcher;
