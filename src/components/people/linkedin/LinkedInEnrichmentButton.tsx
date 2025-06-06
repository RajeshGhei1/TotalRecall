
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { linkedinApiService } from '@/services/linkedinApiService';
import { useTenantContext } from '@/contexts/TenantContext';

interface LinkedInEnrichmentButtonProps {
  personId: string;
  personEmail: string;
  personName: string;
  variant?: 'button' | 'badge';
  size?: 'sm' | 'default' | 'lg';
  onEnrichmentComplete?: () => void;
}

const LinkedInEnrichmentButton: React.FC<LinkedInEnrichmentButtonProps> = ({
  personId,
  personEmail,
  personName,
  variant = 'button',
  size = 'sm',
  onEnrichmentComplete
}) => {
  const { toast } = useToast();
  const { selectedTenantId } = useTenantContext();
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichmentStatus, setEnrichmentStatus] = useState<'unknown' | 'enriched' | 'failed'>('unknown');

  const handleEnrichment = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling in list items
    
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
      // Check if already enriched
      const existingProfile = await linkedinApiService.getEnrichedProfile(personId);
      if (existingProfile) {
        setEnrichmentStatus('enriched');
        toast({
          title: "Already Enriched",
          description: `${personName} is already linked to LinkedIn`
        });
        onEnrichmentComplete?.();
        return;
      }

      // Try to enrich
      const profile = await linkedinApiService.searchProfileByEmail(personEmail, selectedTenantId);
      
      if (profile) {
        const success = await linkedinApiService.enrichContactData(personId, selectedTenantId);
        
        if (success) {
          setEnrichmentStatus('enriched');
          toast({
            title: "Profile Enriched",
            description: `Successfully linked LinkedIn profile for ${personName}`
          });
          onEnrichmentComplete?.();
        } else {
          throw new Error('Failed to store enrichment data');
        }
      } else {
        setEnrichmentStatus('failed');
        toast({
          title: "No Profile Found",
          description: "No LinkedIn profile found for this contact",
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

  if (variant === 'badge') {
    if (enrichmentStatus === 'enriched') {
      return (
        <Badge variant="default" className="bg-blue-600">
          <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center mr-1">
            <span className="text-blue-600 font-bold text-xs">in</span>
          </div>
          LinkedIn
        </Badge>
      );
    }

    if (enrichmentStatus === 'failed') {
      return (
        <Badge variant="outline" className="text-red-600 border-red-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          Failed
        </Badge>
      );
    }

    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleEnrichment}
        disabled={isEnriching}
        className="h-6 px-2 text-xs"
      >
        {isEnriching ? (
          <RefreshCw className="w-3 h-3 animate-spin" />
        ) : (
          <>
            <Plus className="w-3 h-3 mr-1" />
            LinkedIn
          </>
        )}
      </Button>
    );
  }

  // Button variant
  if (enrichmentStatus === 'enriched') {
    return (
      <Button variant="outline" size={size} disabled className="text-green-600 border-green-200">
        <CheckCircle className="w-4 h-4 mr-2" />
        LinkedIn Connected
      </Button>
    );
  }

  if (enrichmentStatus === 'failed') {
    return (
      <Button 
        variant="outline" 
        size={size} 
        onClick={handleEnrichment}
        disabled={isEnriching}
        className="text-red-600 border-red-200 hover:bg-red-50"
      >
        {isEnriching ? (
          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <AlertCircle className="w-4 h-4 mr-2" />
        )}
        Retry LinkedIn
      </Button>
    );
  }

  return (
    <Button 
      variant="outline" 
      size={size} 
      onClick={handleEnrichment}
      disabled={isEnriching}
      className="text-blue-600 border-blue-200 hover:bg-blue-50"
    >
      {isEnriching ? (
        <>
          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          Enriching...
        </>
      ) : (
        <>
          <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center mr-2">
            <span className="text-white font-bold text-xs">in</span>
          </div>
          Enrich with LinkedIn
        </>
      )}
    </Button>
  );
};

export default LinkedInEnrichmentButton;
