
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Target, 
  BarChart3, 
  RefreshCw,
  Download,
  Lightbulb
} from 'lucide-react';
import TalentInsightsPanel from './TalentInsightsPanel';
import TalentPredictiveAnalytics from './TalentPredictiveAnalytics';
import TalentPatternAnalysis from './TalentPatternAnalysis';
import TalentMatchingEngine from './TalentMatchingEngine';
import { useTalentAnalytics } from '@/hooks/talent-analytics/useTalentAnalytics';

interface TalentAnalyticsDashboardProps {
  mode?: 'dashboard' | 'insights' | 'patterns' | 'predictions';
  showMetrics?: boolean;
  enableRealTime?: boolean;
}

const TalentAnalyticsDashboard: React.FC<TalentAnalyticsDashboardProps> = ({ 
  mode = 'dashboard', 
  showMetrics = true, 
  enableRealTime = true 
}) => {
  const [activeTab, setActiveTab] = useState(mode === 'dashboard' ? 'insights' : mode);
  const { data: analytics, isLoading, refetch } = useTalentAnalytics();

  const handleRefresh = () => {
    if (enableRealTime) {
      refetch();
    }
  };

  const handleExportReport = () => {
    // TODO: Implement report export functionality
    console.log('Exporting talent analytics report...');
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="h-8 w-8 text-blue-600" />
            Smart Talent Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered insights and predictive analytics for strategic talent management
          </p>
        </div>
        <div className="flex gap-2">
          {enableRealTime && (
            <Button variant="outline" onClick={handleRefresh} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          )}
          <Button onClick={handleExportReport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      {showMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Talent Analyzed</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalTalentAnalyzed || 0}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Insights Generated</CardTitle>
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.insightsGenerated || 0}</div>
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prediction Accuracy</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.predictionAccuracy || 0}%</div>
              <p className="text-xs text-muted-foreground">
                AI model performance
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Models</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.activeModels || 0}</div>
              <p className="text-xs text-muted-foreground">
                Predictive models running
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="predictive" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Predictive Analytics
          </TabsTrigger>
          <TabsTrigger value="patterns" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Pattern Analysis
          </TabsTrigger>
          <TabsTrigger value="matching" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Talent Matching
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights">
          <TalentInsightsPanel />
        </TabsContent>

        <TabsContent value="predictive">
          <TalentPredictiveAnalytics />
        </TabsContent>

        <TabsContent value="patterns">
          <TalentPatternAnalysis />
        </TabsContent>

        <TabsContent value="matching">
          <TalentMatchingEngine />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TalentAnalyticsDashboard;
