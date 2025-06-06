
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
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { linkedinService, LinkedInProfile } from '@/services/linkedinService';
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

  const searchLinkedInProfile = async () => {
    if (!selectedTenantId) return;

    setIsSearching(true);
    try {
      const profile = await linkedinService.searchProfileByEmail(personEmail, selectedTenantId);
      
      if (profile) {
        setFoundProfile(profile);
        toast({
          title: "LinkedIn Profile Found",
          description: `Found profile for ${profile.firstName} ${profile.lastName}`
        });
      } else {
        toast({
          title: "No Profile Found",
          description: "No LinkedIn profile found for this contact",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Failed to search LinkedIn profiles",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const linkProfile = async () => {
    if (!foundProfile || !selectedTenantId) return;

    const success = await linkedinService.enrichContactData(personId, selectedTenantId);
    
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
        {!foundProfile && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-600 mb-4">
              Search for LinkedIn profile using email: {personEmail}
            </p>
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(foundProfile.publicProfileUrl, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View Profile
                  </Button>
                </div>
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
                    onClick={() => setFoundProfile(null)}
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
      </CardContent>
    </Card>
  );
};

export default LinkedInProfileMatcher;
