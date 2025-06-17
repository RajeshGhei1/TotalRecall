
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  TrendingUp, 
  Award, 
  Settings,
  Brain,
  Star,
  BarChart3,
  Users
} from 'lucide-react';

interface CandidateScoringEngineProps {
  view?: 'scores' | 'criteria' | 'analytics' | 'settings';
  showAIScoring?: boolean;
  enableCustomCriteria?: boolean;
}

const CandidateScoringEngine: React.FC<CandidateScoringEngineProps> = ({
  view = 'scores',
  showAIScoring = true,
  enableCustomCriteria = true
}) => {
  const [activeTab, setActiveTab] = useState(view);

  const candidates = [
    {
      id: '1',
      name: 'Sarah Johnson',
      position: 'Senior Software Engineer',
      overallScore: 92,
      aiScore: 94,
      scores: {
        technical: 95,
        experience: 90,
        cultural: 88,
        communication: 94
      },
      strengths: ['React Expert', 'Team Leadership', 'Problem Solving'],
      concerns: ['Limited Backend Experience'],
      recommendation: 'Strong hire'
    },
    {
      id: '2',
      name: 'Michael Chen',
      position: 'Product Manager',
      overallScore: 87,
      aiScore: 85,
      scores: {
        technical: 78,
        experience: 92,
        cultural: 90,
        communication: 88
      },
      strengths: ['Strategic Thinking', 'User Focus', 'Data Analysis'],
      concerns: ['Technical Depth'],
      recommendation: 'Hire'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      position: 'UX Designer',
      overallScore: 95,
      aiScore: 96,
      scores: {
        technical: 88,
        experience: 95,
        cultural: 98,
        communication: 96
      },
      strengths: ['Design Systems', 'User Research', 'Cross-functional Collaboration'],
      concerns: [],
      recommendation: 'Strong hire'
    }
  ];

  const scoringCriteria = [
    {
      id: '1',
      name: 'Technical Skills',
      weight: 30,
      description: 'Programming languages, frameworks, and technical expertise',
      enabled: true
    },
    {
      id: '2',
      name: 'Experience',
      weight: 25,
      description: 'Years of experience and relevant background',
      enabled: true
    },
    {
      id: '3',
      name: 'Cultural Fit',
      weight: 25,
      description: 'Alignment with company values and team dynamics',
      enabled: true
    },
    {
      id: '4',
      name: 'Communication',
      weight: 20,
      description: 'Written and verbal communication skills',
      enabled: true
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 75) return 'bg-yellow-100 text-yellow-800';
    if (score >= 60) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Strong hire':
        return 'bg-green-100 text-green-800';
      case 'Hire':
        return 'bg-blue-100 text-blue-800';
      case 'Maybe':
        return 'bg-yellow-100 text-yellow-800';
      case 'No hire':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as typeof activeTab);
  };

  const renderScores = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85.2</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3.2</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              High Scorers (90+)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8</span> this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              AI Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+1%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {candidates.map((candidate) => (
          <Card key={candidate.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{candidate.name}</h3>
                  <p className="text-muted-foreground">{candidate.position}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getScoreColor(candidate.overallScore)}`}>
                      {candidate.overallScore}
                    </div>
                    <div className="text-sm text-muted-foreground">Overall Score</div>
                  </div>
                  {showAIScoring && (
                    <div className="text-right">
                      <div className={`text-xl font-bold ${getScoreColor(candidate.aiScore)}`}>
                        {candidate.aiScore}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Brain className="h-3 w-3" />
                        AI Score
                      </div>
                    </div>
                  )}
                  <Badge className={getRecommendationColor(candidate.recommendation)}>
                    {candidate.recommendation}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4 mb-4">
                {Object.entries(candidate.scores).map(([category, score]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{category}</span>
                      <span className={`font-medium ${getScoreColor(score)}`}>{score}</span>
                    </div>
                    <Progress value={score} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium text-sm mb-2 text-green-700">Strengths</h4>
                  <div className="flex flex-wrap gap-1">
                    {candidate.strengths.map((strength, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-green-50 text-green-700">
                        {strength}
                      </Badge>
                    ))}
                  </div>
                </div>
                {candidate.concerns.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2 text-orange-700">Areas of Concern</h4>
                    <div className="flex flex-wrap gap-1">
                      {candidate.concerns.map((concern, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-orange-50 text-orange-700">
                          {concern}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm">View Details</Button>
                <Button size="sm" variant="outline">Schedule Interview</Button>
                <Button size="sm" variant="outline">
                  <Star className="h-3 w-3 mr-1" />
                  Favorite
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCriteria = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Scoring Criteria</h3>
        {enableCustomCriteria && (
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Add Criteria
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {scoringCriteria.map((criteria) => (
          <Card key={criteria.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{criteria.name}</h4>
                    <Badge variant={criteria.enabled ? 'default' : 'secondary'}>
                      {criteria.enabled ? 'Active' : 'Disabled'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{criteria.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Weight:</span>
                    <Badge variant="outline">{criteria.weight}%</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button 
                    variant={criteria.enabled ? 'secondary' : 'default'} 
                    size="sm"
                  >
                    {criteria.enabled ? 'Disable' : 'Enable'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weight Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scoringCriteria.filter(c => c.enabled).map((criteria) => (
              <div key={criteria.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{criteria.name}</span>
                  <span className="font-medium">{criteria.weight}%</span>
                </div>
                <Progress value={criteria.weight} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Candidates Scored
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+156</span> this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Processing Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3s</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">-0.5s</span> faster
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              High Scorers Hired
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5%</span> success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Model Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+1.2%</span> improved
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">90-100 (Excellent)</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full">
                    <div className="w-6 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">23</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">75-89 (Good)</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full">
                    <div className="w-12 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">67</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">60-74 (Fair)</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full">
                    <div className="w-8 h-2 bg-yellow-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">34</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Below 60 (Poor)</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full">
                    <div className="w-3 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">12</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Criteria Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scoringCriteria.map((criteria, index) => (
                <div key={criteria.id} className="flex justify-between items-center">
                  <span className="text-sm">{criteria.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full">
                      <div 
                        className="h-2 bg-primary rounded-full" 
                        style={{ width: `${85 - index * 5}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{85 - index * 5}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (view !== 'scores') {
    switch (view) {
      case 'criteria':
        return renderCriteria();
      case 'analytics':
        return renderAnalytics();
      default:
        return renderScores();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Candidate Scoring Engine</h1>
        <Button>
          <Target className="h-4 w-4 mr-2" />
          Configure Scoring
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="scores">Candidate Scores</TabsTrigger>
          <TabsTrigger value="criteria">Scoring Criteria</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="scores" className="mt-6">
          {renderScores()}
        </TabsContent>

        <TabsContent value="criteria" className="mt-6">
          {renderCriteria()}
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          {renderAnalytics()}
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">Scoring Settings</h3>
            <p className="text-muted-foreground">Advanced scoring configuration and AI model settings coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Module metadata for registration
(CandidateScoringEngine as any).moduleMetadata = {
  id: 'candidate-scoring-engine',
  name: 'Candidate Scoring Engine',
  category: 'recruitment',
  version: '1.0.0',
  description: 'AI-powered candidate scoring and evaluation system with customizable criteria',
  author: 'System',
  requiredPermissions: ['read', 'write', 'ai_access'],
  dependencies: ['ats-core', 'ai-recruitment-assistant'],
  props: {
    view: { type: 'string', options: ['scores', 'criteria', 'analytics', 'settings'], default: 'scores' },
    showAIScoring: { type: 'boolean', default: true },
    enableCustomCriteria: { type: 'boolean', default: true }
  }
};

export default CandidateScoringEngine;
