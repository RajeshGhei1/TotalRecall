
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  CheckCircle,
  AlertCircle,
  Users,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { linkedinApiService } from '@/services/linkedinApiService';
import { useTenantContext } from '@/contexts/TenantContext';

interface EnrichmentJob {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  totalContacts: number;
  processedContacts: number;
  successCount: number;
  failedCount: number;
  startedAt?: Date;
  completedAt?: Date;
}

const BulkEnrichmentManager: React.FC = () => {
  const { toast } = useToast();
  const { selectedTenantId } = useTenantContext();
  const [currentJob, setCurrentJob] = useState<EnrichmentJob | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const startBulkEnrichment = async () => {
    if (!selectedTenantId) {
      toast({
        title: "No Tenant Selected",
        description: "Please select a tenant to start bulk enrichment",
        variant: "destructive"
      });
      return;
    }

    setIsStarting(true);
    
    try {
      // Create new enrichment job
      const newJob: EnrichmentJob = {
        id: `job-${Date.now()}`,
        status: 'running',
        totalContacts: 0,
        processedContacts: 0,
        successCount: 0,
        failedCount: 0,
        startedAt: new Date()
      };
      
      setCurrentJob(newJob);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setCurrentJob(prev => {
          if (!prev || prev.status !== 'running') return prev;
          
          const newProcessed = Math.min(prev.processedContacts + 1, prev.totalContacts);
          const newSuccess = prev.successCount + (Math.random() > 0.2 ? 1 : 0);
          const newFailed = newProcessed - newSuccess;
          
          if (newProcessed >= prev.totalContacts) {
            clearInterval(progressInterval);
            return {
              ...prev,
              status: 'completed',
              processedContacts: newProcessed,
              successCount: newSuccess,
              failedCount: newFailed,
              completedAt: new Date()
            };
          }
          
          return {
            ...prev,
            processedContacts: newProcessed,
            successCount: newSuccess,
            failedCount: newFailed
          };
        });
      }, 500);

      // Start actual enrichment
      const results = await linkedinApiService.bulkEnrichContacts(selectedTenantId);
      
      clearInterval(progressInterval);
      setCurrentJob(prev => prev ? {
        ...prev,
        status: 'completed',
        totalContacts: results.success + results.failed,
        processedContacts: results.success + results.failed,
        successCount: results.success,
        failedCount: results.failed,
        completedAt: new Date()
      } : null);

      toast({
        title: "Bulk Enrichment Completed",
        description: `Successfully enriched ${results.success} contacts, ${results.failed} failed`
      });
    } catch (error) {
      setCurrentJob(prev => prev ? { ...prev, status: 'failed' } : null);
      toast({
        title: "Enrichment Failed",
        description: "Failed to start bulk enrichment process",
        variant: "destructive"
      });
    } finally {
      setIsStarting(false);
    }
  };

  const pauseEnrichment = () => {
    setCurrentJob(prev => prev ? { ...prev, status: 'paused' } : null);
  };

  const resumeEnrichment = () => {
    setCurrentJob(prev => prev ? { ...prev, status: 'running' } : null);
  };

  const getProgressPercentage = () => {
    if (!currentJob || currentJob.totalContacts === 0) return 0;
    return (currentJob.processedContacts / currentJob.totalContacts) * 100;
  };

  const getStatusColor = (status: EnrichmentJob['status']) => {
    switch (status) {
      case 'running': return 'bg-blue-600';
      case 'completed': return 'bg-green-600';
      case 'failed': return 'bg-red-600';
      case 'paused': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Bulk Contact Enrichment
          </CardTitle>
          <CardDescription>
            Automatically enrich all contacts in your database with LinkedIn profile data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>About LinkedIn Profile Matching:</strong> Due to LinkedIn API limitations, 
              this process creates enrichment entries that can be manually updated with actual profile data. 
              Direct email-based profile search is not available through LinkedIn's public API.
            </AlertDescription>
          </Alert>

          {!currentJob && (
            <div className="text-center py-8">
              <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Ready to Start Bulk Enrichment</h3>
              <p className="text-gray-600 mb-6">
                This will process all contacts in your database and attempt to match them with LinkedIn profiles
              </p>
              <Button 
                onClick={startBulkEnrichment} 
                disabled={isStarting || !selectedTenantId}
                size="lg"
                className="min-w-[200px]"
              >
                {isStarting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Bulk Enrichment
                  </>
                )}
              </Button>
            </div>
          )}

          {currentJob && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor(currentJob.status)} text-white border-transparent`}
                  >
                    {currentJob.status.charAt(0).toUpperCase() + currentJob.status.slice(1)}
                  </Badge>
                  <span className="text-sm text-gray-600">Job ID: {currentJob.id}</span>
                </div>
                <div className="flex gap-2">
                  {currentJob.status === 'running' && (
                    <Button variant="outline" size="sm" onClick={pauseEnrichment}>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  {currentJob.status === 'paused' && (
                    <Button variant="outline" size="sm" onClick={resumeEnrichment}>
                      <Play className="w-4 h-4 mr-2" />
                      Resume
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{currentJob.processedContacts} / {currentJob.totalContacts || '?'}</span>
                </div>
                <Progress value={getProgressPercentage()} className="w-full" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{currentJob.successCount}</div>
                    <div className="text-sm text-gray-600">Successful</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{currentJob.failedCount}</div>
                    <div className="text-sm text-gray-600">Failed</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {currentJob.totalContacts - currentJob.processedContacts}
                    </div>
                    <div className="text-sm text-gray-600">Remaining</div>
                  </CardContent>
                </Card>
              </div>

              {currentJob.status === 'completed' && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Bulk enrichment completed successfully! 
                    {currentJob.successCount} contacts were processed, {currentJob.failedCount} failed.
                  </AlertDescription>
                </Alert>
              )}

              {currentJob.status === 'failed' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Bulk enrichment job failed. Please try again or contact support if the issue persists.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkEnrichmentManager;
