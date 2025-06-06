
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  RefreshCw, 
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { linkedinApiService, LinkedInProfile } from '@/services/linkedinApiService';
import { useTenantContext } from '@/contexts/TenantContext';
import LinkedInProfileBadge from './LinkedInProfileBadge';

interface PersonLinkedInEnrichmentProps {
  personId: string;
  personEmail: string;
  personName: string;
  onEnrichmentComplete?: (profile: LinkedInProfile) => void;
}

const PersonLinkedInEnrichment: React.FC<PersonLinkedInEnrichmentProps> = ({
  personId,
  personEmail,
  personName,
  onEnrichmentComplete
}) => {
  const { toast } = useToast();
  const { selectedTenantId } = useTenantContext();
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichmentStatus, setEnrichmentStatus] = useState<'not_started' | 'enriched' | 'failed'>('not_started');
  const [linkedInProfile, setLinkedInProfile] = useState<LinkedInProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkExistingEnrichment();
  }, [personId]);

  const checkExistingEnrichment = async () => {
    setIsLoading(true);
    try {
      const profile = await linkedinApiService.getEnrichedProfile(personId);
      if (profile) {
        setLinkedInProfile(profile);
        setEnrichmentStatus('enriched');
      } else {
        setEnrichmentStatus('not_started');
      }
    } catch (error) {
      console.error('Error checking enrichment status:', error);
      setEnrichmentStatus('not_started');
    } finally {
      setIsLoading(false);
    }
  };

  const startEnrichment = async () => {
    if (!selectedTenantId) {
      toast({
        title: "No Tenant Selected",
        description: "Please select a tenant to enrich contact",
        variant: "destructive"
      });
      return;
    }

    setIsEnriching(true);
    
    try {
      // First try to search for profile
      const profile = await linkedinApiService.searchProfileByEmail(personEmail, selectedTenantId);
      
      if (profile) {
        // Enrich the contact data
        const success = await linkedinApiService.enrichContactData(personId, selectedTenantId);
        
        if (success) {
          // Get the enriched profile
          const enrichedProfile = await linkedinApiService.getEnrichedProfile(personId);
          if (enrichedProfile) {
            setLinkedInProfile(enrichedProfile);
            setEnrichmentStatus('enriched');
            onEnrichmentComplete?.(enrichedProfile);
            
            toast({
              title: "Profile Enriched",
              description: `Successfully linked LinkedIn profile for ${personName}`
            });
          }
        } else {
          throw new Error('Failed to store enrichment data');
        }
      } else {
        setEnrichmentStatus('failed');
        toast({
          title: "No Profile Found",
          description: "No LinkedIn profile found for this contact. LinkedIn's API has limited search capabilities.",
          variant: "destructive"
        });
      }
    } catch (error) {
      setEnrichmentStatus('failed');
      toast({
        title: "Enrichment Failed",
        description: "Failed to enrich contact with LinkedIn data",
        variant: "destructive"
      });
    } finally {
      setIsEnriching(false);
    }
  };

  const retryEnrichment = () => {
    setEnrichmentStatus('not_started');
    startEnrichment();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-sm">Checking LinkedIn enrichment status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">in</span>
          </div>
          LinkedIn Profile Enrichment
        </CardTitle>
        <CardDescription>
          Enhance contact data with LinkedIn profile information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {enrichmentStatus === 'not_started' && (
          <>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Note:</strong> Due to LinkedIn API limitations, this process creates enrichment entries 
                that can be manually updated with actual profile data. Direct email-based profile search 
                is not available through LinkedIn's public API.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{personName}</p>
                  <p className="text-sm text-gray-600">{personEmail}</p>
                </div>
                <Badge variant="outline" className="text-gray-600">
                  Not Enriched
                </Badge>
              </div>
              
              <Button 
                onClick={startEnrichment} 
                disabled={isEnriching}
                className="w-full"
              >
                {isEnriching ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Enriching Profile...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Enrich with LinkedIn Data
                  </>
                )}
              </Button>
            </div>
          </>
        )}

        {enrichmentStatus === 'enriched' && linkedInProfile && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="default" className="bg-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                LinkedIn Profile Linked
              </Badge>
              <Button variant="outline" size="sm" onClick={retryEnrichment}>
                <RefreshCw className="w-3 h-3 mr-1" />
                Re-enrich
              </Button>
            </div>
            
            <LinkedInProfileBadge 
              profile={linkedInProfile} 
              variant="detailed" 
              showViewButton={true} 
            />
            
            {linkedInProfile.publicProfileUrl && (
              <Button 
                variant="outline" 
                onClick={() => window.open(linkedInProfile.publicProfileUrl, '_blank')}
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Full LinkedIn Profile
              </Button>
            )}
          </div>
        )}

        {enrichmentStatus === 'failed' && (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to enrich this contact with LinkedIn data. This could be due to:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>No matching LinkedIn profile found</li>
                  <li>LinkedIn API limitations</li>
                  <li>Privacy settings on the profile</li>
                </ul>
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={retryEnrichment} className="flex-1">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.open(`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(personName)}`, '_blank')}
                className="flex-1"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Manual Search
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonLinkedInEnrichment;
