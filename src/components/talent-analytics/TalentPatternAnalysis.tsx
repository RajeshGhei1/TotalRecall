import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  Activity, 
  Clock, 
  Users, 
  Target, 
  TrendingUp,
  Calendar,
  MapPin,
  Briefcase
} from 'lucide-react';

const TalentPatternAnalysis: React.FC = () => {
  const [selectedPattern, setSelectedPattern] = useState('engagement');

  // Mock behavioral pattern data
  const engagementPatterns = [
    { time: '8AM', engagement: 65 },
    { time: '10AM', engagement: 85 },
    { time: '12PM', engagement: 70 },
    { time: '2PM', engagement: 90 },
    { time: '4PM', engagement: 75 },
    { time: '6PM', engagement: 45 }
  ];

  const skillDevelopmentPatterns = [
    { skill: 'Technical', current: 85, potential: 95 },
    { skill: 'Leadership', current: 70, potential: 85 },
    { skill: 'Communication', current: 80, potential: 90 },
    { skill: 'Problem Solving', current: 90, potential: 95 },
    { skill: 'Creativity', current: 75, potential: 88 },
    { skill: 'Teamwork', current: 88, potential: 92 }
  ];

  const careerPathPatterns = [
    { path: 'Technical Track', frequency: 45, satisfaction: 88 },
    { path: 'Management Track', frequency: 30, satisfaction: 82 },
    { path: 'Specialist Track', frequency: 15, satisfaction: 92 },
    { path: 'Hybrid Track', frequency: 10, satisfaction: 85 }
  ];

  return (
    <div className="space-y-6">
      {/* Pattern Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Behavioral Pattern Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedPattern} onValueChange={setSelectedPattern}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
              <TabsTrigger value="learning">Learning</TabsTrigger>
            </TabsList>

            <TabsContent value="engagement" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Daily Engagement Patterns
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={engagementPatterns}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="engagement" fill="#3B82F6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Key Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-blue-900">Peak Performance</span>
                        </div>
                        <p className="text-sm text-blue-800">
                          Highest engagement occurs at 2PM across all teams
                        </p>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-yellow-600" />
                          <span className="font-medium text-yellow-900">Optimal Scheduling</span>
                        </div>
                        <p className="text-sm text-yellow-800">
                          Schedule critical meetings between 10AM-4PM
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-900">Productivity Boost</span>
                        </div>
                        <p className="text-sm text-green-800">
                          15% increase in output during peak hours
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance Correlation Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">High Performers</h4>
                      <div className="space-y-2 text-sm">
                        <div>• Work 7.2 hours avg/day</div>
                        <div>• Take breaks every 90 min</div>
                        <div>• Collaborate 3x more</div>
                        <div>• Learn 2+ new skills/quarter</div>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Average Performers</h4>
                      <div className="space-y-2 text-sm">
                        <div>• Work 8.1 hours avg/day</div>
                        <div>• Take breaks every 2 hours</div>
                        <div>• Standard collaboration</div>
                        <div>• Learn 1 skill/quarter</div>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Improvement Areas</h4>
                      <div className="space-y-2 text-sm">
                        <div>• Reduce meeting overhead</div>
                        <div>• Increase peer learning</div>
                        <div>• Focus time blocks</div>
                        <div>• Skills development plans</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="collaboration" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Team Collaboration Matrix
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-1 text-xs">
                      {/* Simplified heatmap representation */}
                      <div className="p-2 text-center font-medium">Team</div>
                      <div className="p-2 text-center font-medium">Eng</div>
                      <div className="p-2 text-center font-medium">Design</div>
                      <div className="p-2 text-center font-medium">Product</div>
                      
                      <div className="p-2 font-medium">Engineering</div>
                      <div className="p-2 bg-green-500 text-white text-center">High</div>
                      <div className="p-2 bg-yellow-400 text-center">Med</div>
                      <div className="p-2 bg-red-400 text-white text-center">Low</div>
                      
                      <div className="p-2 font-medium">Design</div>
                      <div className="p-2 bg-yellow-400 text-center">Med</div>
                      <div className="p-2 bg-green-500 text-white text-center">High</div>
                      <div className="p-2 bg-green-400 text-center">High</div>
                      
                      <div className="p-2 font-medium">Product</div>
                      <div className="p-2 bg-red-400 text-white text-center">Low</div>
                      <div className="p-2 bg-green-400 text-center">High</div>
                      <div className="p-2 bg-green-500 text-white text-center">High</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Collaboration Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-l-4 border-red-400 pl-3">
                        <h4 className="font-medium text-red-700">Opportunity</h4>
                        <p className="text-sm text-gray-600">
                          Engineering and Product teams have low collaboration frequency
                        </p>
                      </div>
                      <div className="border-l-4 border-green-400 pl-3">
                        <h4 className="font-medium text-green-700">Strength</h4>
                        <p className="text-sm text-gray-600">
                          Design team effectively bridges Engineering and Product
                        </p>
                      </div>
                      <div className="border-l-4 border-blue-400 pl-3">
                        <h4 className="font-medium text-blue-700">Recommendation</h4>
                        <p className="text-sm text-gray-600">
                          Implement cross-functional pair programming sessions
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="learning" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Skill Development Radar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={skillDevelopmentPatterns}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="skill" />
                        <PolarRadiusAxis domain={[0, 100]} />
                        <Radar
                          name="Current Level"
                          dataKey="current"
                          stroke="#3B82F6"
                          fill="#3B82F6"
                          fillOpacity={0.3}
                        />
                        <Radar
                          name="Potential Level"
                          dataKey="potential"
                          stroke="#10B981"
                          fill="#10B981"
                          fillOpacity={0.1}
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Career Path Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Career Path Pattern Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={careerPathPatterns}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="path" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="frequency" fill="#8B5CF6" name="Frequency %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h4 className="font-medium mb-4">Path Recommendations</h4>
              <div className="space-y-3">
                {careerPathPatterns.map((path, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{path.path}</div>
                      <div className="text-xs text-muted-foreground">
                        {path.frequency}% of talent
                      </div>
                    </div>
                    <Badge 
                      variant={path.satisfaction > 85 ? "default" : "secondary"}
                    >
                      {path.satisfaction}% satisfaction
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TalentPatternAnalysis;
