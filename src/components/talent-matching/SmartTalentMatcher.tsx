import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Target, 
  Users, 
  Star, 
  MapPin, 
  Briefcase, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTenantContext } from '@/contexts/TenantContext';
import { smartTalentMatchingService, type SmartMatchResult, type CandidateMatch } from '@/services/smartTalentMatchingService';

const SmartTalentMatcher: React.FC = () => {
  const { toast } = useToast();
  const { selectedTenantId } = useTenantContext();
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchResults, setMatchResults] = useState<SmartMatchResult | null>(null);

  // Fetch jobs for the tenant
  const { data: jobs = [] } = useQuery({
    queryKey: ['jobs', selectedTenantId],
    queryFn: async () => {
      if (!selectedTenantId) return [];
      
      const { data, error } = await supabase
        .from('jobs')
        .select('id, title, department, status')
        .eq('tenant_id', selectedTenantId)
        .eq('status', 'active');

      if (error) throw error;
      return data;
    },
    enabled: !!selectedTenantId
  });

  const handleAnalyzeJob = async () => {
    if (!selectedJobId || !selectedTenantId) {
      toast({
        title: "Missing Information",
        description: "Please select a job to analyze",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await smartTalentMatchingService.findBestCandidatesForJob(
        selectedJobId,
        selectedTenantId
      );
      
      setMatchResults(result);
      toast({
        title: "Analysis Complete",
        description: `Found ${result.matchResults.length} candidate matches`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze candidates",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderMatchCard = (match: CandidateMatch) => {
    const { candidate, matchAnalysis } = match;
    const scoreColor = smartTalentMatchingService.getMatchScoreColor(matchAnalysis.matchScore);
    const scoreLabel = smartTalentMatchingService.getMatchScoreLabel(matchAnalysis.matchScore);

    return (
      <Card key={match.candidateId} className="mb-6 border-2 hover:border-blue-200 transition-colors">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {candidate.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{candidate.name}</h3>
                <p className="text-sm text-muted-foreground">{candidate.currentTitle}</p>
                <p className="text-sm text-muted-foreground">{candidate.currentCompany}</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${scoreColor}`}>
                {matchAnalysis.matchScore}% Match
              </div>
              <p className="text-xs text-muted-foreground mt-1">{scoreLabel}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="recommendations">Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{matchAnalysis.skillAlignment.score}%</div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Target className="w-3 h-3" />
                    Skills Match
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{matchAnalysis.experienceMatch.score}%</div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    Experience
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{matchAnalysis.locationCompatibility.score}%</div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Location
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{matchAnalysis.salaryAlignment.score}%</div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    Salary
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Key Strengths
                  </h4>
                  <div className="space-y-1">
                    {matchAnalysis.strengths.slice(0, 3).map((strength, index) => (
                      <div key={index} className="text-sm text-green-700 flex items-center gap-2">
                        <CheckCircle className="w-3 h-3" />
                        {strength}
                      </div>
                    ))}
                  </div>
                </div>
                
                {matchAnalysis.concerns.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      Areas of Concern
                    </h4>
                    <div className="space-y-1">
                      {matchAnalysis.concerns.slice(0, 2).map((concern, index) => (
                        <div key={index} className="text-sm text-orange-700 flex items-center gap-2">
                          <AlertTriangle className="w-3 h-3" />
                          {concern}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="skills" className="mt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-green-600">Matching Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {matchAnalysis.skillAlignment.matchingSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-green-700 bg-green-50">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {matchAnalysis.skillAlignment.missingSkills.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-orange-600">Missing Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {matchAnalysis.skillAlignment.missingSkills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-orange-700 border-orange-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700">{matchAnalysis.skillAlignment.analysis}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-4">
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-medium mb-1">Experience Analysis</h4>
                    <p className="text-sm text-gray-700">{matchAnalysis.experienceMatch.analysis}</p>
                  </div>
                  
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h4 className="font-medium mb-1">Location Compatibility</h4>
                    <p className="text-sm text-gray-700">{matchAnalysis.locationCompatibility.analysis}</p>
                  </div>
                  
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h4 className="font-medium mb-1">Salary Alignment</h4>
                    <p className="text-sm text-gray-700">{matchAnalysis.salaryAlignment.analysis}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">AI Summary</h4>
                  <p className="text-sm text-gray-700">{matchAnalysis.summary}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="mt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    AI Recommendations
                  </h4>
                  <div className="space-y-2">
                    {matchAnalysis.recommendations.map((recommendation, index) => (
                      <div key={index} className="bg-yellow-50 p-3 rounded-lg text-sm">
                        {recommendation}
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    Schedule Interview
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Send Message
                  </Button>
                  <Button size="sm" variant="outline">
                    View Profile
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            Smart Talent Matching
          </h2>
          <p className="text-gray-600 mt-1">
            AI-powered candidate analysis and job matching
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Select Job</label>
              <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a job to analyze" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title} - {job.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleAnalyzeJob}
              disabled={!selectedJobId || isAnalyzing}
              className="flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <TrendingUp className="h-4 w-4 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4" />
                  Analyze Candidates
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {matchResults && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Match Results for "{matchResults.jobTitle}"
            </h3>
            <Badge variant="outline">
              {matchResults.matchResults.length} candidates analyzed
            </Badge>
          </div>
          
          <div className="space-y-4">
            {matchResults.matchResults.map(renderMatchCard)}
          </div>
        </div>
      )}

      {matchResults && matchResults.matchResults.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No candidates found for analysis</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmartTalentMatcher;
