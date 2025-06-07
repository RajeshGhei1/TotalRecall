import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Brain, 
  Target, 
  Users, 
  Star, 
  Briefcase, 
  MapPin, 
  Clock,
  TrendingUp,
  Zap
} from 'lucide-react';
import SmartTalentMatcher from '@/components/talent-matching/SmartTalentMatcher';

const TalentMatchingEngine: React.FC = () => {
  const [activeTab, setActiveTab] = useState('smart-matching');

  // Mock talent matching data
  const talentMatches = [
    {
      id: '1',
      name: 'Sarah Johnson',
      currentRole: 'Senior Developer',
      matchScore: 95,
      skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
      experience: '5 years',
      location: 'San Francisco',
      availability: 'Available',
      strengths: ['Leadership', 'Problem Solving', 'Team Collaboration'],
      potentialRoles: ['Tech Lead', 'Engineering Manager', 'Solution Architect']
    },
    {
      id: '2',
      name: 'Mike Chen',
      currentRole: 'Data Scientist',
      matchScore: 88,
      skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
      experience: '4 years',
      location: 'New York',
      availability: 'Available in 2 weeks',
      strengths: ['Analytics', 'Research', 'Statistical Modeling'],
      potentialRoles: ['Senior Data Scientist', 'ML Engineer', 'Research Scientist']
    },
    {
      id: '3',
      name: 'Alex Rodriguez',
      currentRole: 'Product Manager',
      matchScore: 82,
      skills: ['Product Strategy', 'User Research', 'Agile', 'Analytics'],
      experience: '6 years',
      location: 'Austin',
      availability: 'Available',
      strengths: ['Strategic Thinking', 'Communication', 'Market Analysis'],
      potentialRoles: ['Senior PM', 'Product Director', 'VP Product']
    }
  ];

  const roleRequirements = [
    {
      role: 'Senior Full Stack Engineer',
      department: 'Engineering',
      urgency: 'High',
      requiredSkills: ['React', 'Node.js', 'TypeScript', 'AWS'],
      experience: '5+ years',
      location: 'San Francisco / Remote'
    },
    {
      role: 'ML Engineer',
      department: 'Data Science',
      urgency: 'Medium',
      requiredSkills: ['Python', 'TensorFlow', 'MLOps', 'Kubernetes'],
      experience: '3+ years',
      location: 'New York'
    }
  ];

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const runAIMatching = () => {
    console.log('Running AI-powered talent matching...');
    // TODO: Integrate with AI service
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="smart-matching" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            AI Matching
          </TabsTrigger>
          <TabsTrigger value="matches">Talent Matches</TabsTrigger>
          <TabsTrigger value="requirements">Role Requirements</TabsTrigger>
          <TabsTrigger value="analytics">Match Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="smart-matching">
          <SmartTalentMatcher />
        </TabsContent>

        <TabsContent value="matches">
          <div className="space-y-4">
            {talentMatches.map((talent) => (
              <Card key={talent.id} className="border-2 border-gray-200 hover:border-blue-300 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {talent.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{talent.name}</h3>
                        <p className="text-sm text-muted-foreground">{talent.currentRole}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getMatchScoreColor(talent.matchScore)}`} />
                      <span className="text-2xl font-bold">{talent.matchScore}%</span>
                      <span className="text-sm text-muted-foreground">match</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          Skills
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {talent.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Strengths
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {talent.strengths.map((strength, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span>{talent.experience}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{talent.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{talent.availability}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Potential Roles</h4>
                        <div className="space-y-1">
                          {talent.potentialRoles.map((role, index) => (
                            <div key={index} className="text-sm text-blue-600">
                              • {role}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button size="sm">View Full Profile</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="requirements">
          <div className="space-y-4">
            {roleRequirements.map((role, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{role.role}</CardTitle>
                      <p className="text-sm text-muted-foreground">{role.department}</p>
                    </div>
                    <Badge variant={role.urgency === 'High' ? 'destructive' : 'secondary'}>
                      {role.urgency} Priority
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Required Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {role.requiredSkills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Experience</h4>
                      <p className="text-sm text-muted-foreground">{role.experience}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Location</h4>
                      <p className="text-sm text-muted-foreground">{role.location}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button size="sm" variant="outline">Find Matches</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Matching Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Match Score</span>
                    <span className="font-bold">88.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Successful Placements</span>
                    <span className="font-bold">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Time to Match</span>
                    <span className="font-bold">2.3 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">AI Accuracy</span>
                    <span className="font-bold">94.7%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Matching Criteria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Technical Skills</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div className="w-4/5 h-2 bg-blue-500 rounded-full" />
                      </div>
                      <span className="text-xs">80%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Experience Level</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div className="w-3/4 h-2 bg-green-500 rounded-full" />
                      </div>
                      <span className="text-xs">75%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cultural Fit</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div className="w-3/5 h-2 bg-yellow-500 rounded-full" />
                      </div>
                      <span className="text-xs">60%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Career Aspirations</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div className="w-1/2 h-2 bg-purple-500 rounded-full" />
                      </div>
                      <span className="text-xs">50%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TalentMatchingEngine;
