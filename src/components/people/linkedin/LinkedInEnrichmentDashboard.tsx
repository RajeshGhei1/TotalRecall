
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  RefreshCw, 
  CheckCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { linkedinService } from '@/services/linkedinService';
import { useTenantContext } from '@/contexts/TenantContext';

export const LinkedInEnrichmentDashboard: React.FC = () => {
  const { toast } = useToast();
  const { selectedTenantId } = useTenantContext();
  const [isEnriching, setIsEnriching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ success: number; failed: number } | null>(null);

  const startBulkEnrichment = async () => {
    if (!selectedTenantId) return;

    setIsEnriching(true);
    setProgress(0);
    setResults(null);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const enrichmentResults = await linkedinService.bulkEnrichContacts(selectedTenantId);
      
      clearInterval(progressInterval);
      setProgress(100);
      setResults(enrichmentResults);

      toast({
        title: "Enrichment Complete",
        description: `Successfully enriched ${enrichmentResults.success} contacts`
      });
    } catch (error) {
      toast({
        title: "Enrichment Failed",
        description: "Failed to enrich contact data",
        variant: "destructive"
      });
    } finally {
      setIsEnriching(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">in</span>
            </div>
            LinkedIn Data Enrichment
          </CardTitle>
          <CardDescription>
            Automatically enrich your contact database with LinkedIn profile data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-gray-600">Contacts Enriched</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <BarChart3 className="w-8 h-8 mx-auto text-green-600 mb-2" />
                <div className="text-2xl font-bold">0%</div>
                <div className="text-sm text-gray-600">Match Rate</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <CheckCircle className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-gray-600">Profiles Linked</div>
              </CardContent>
            </Card>
          </div>

          {isEnriching && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Enriching contacts...</span>
                <span className="text-sm text-gray-600">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {results && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">Enrichment Results</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Success: {results.success}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm">Failed: {results.failed}</span>
                </div>
              </div>
            </div>
          )}

          <Button 
            onClick={startBulkEnrichment} 
            disabled={isEnriching || !selectedTenantId}
            className="w-full"
            size="lg"
          >
            {isEnriching ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Enriching Contacts...
              </>
            ) : (
              <>
                <Users className="w-4 h-4 mr-2" />
                Start Bulk Enrichment
              </>
            )}
          </Button>

          <div className="text-xs text-gray-600 space-y-1">
            <p>• This will search LinkedIn for profiles matching your contact emails</p>
            <p>• Found profiles will be automatically linked to your contacts</p>
            <p>• Profile data will be stored securely and updated periodically</p>
            <p>• All data usage complies with LinkedIn's API terms and privacy policies</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkedInEnrichmentDashboard;
