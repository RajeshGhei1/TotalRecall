
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  ArrowRight, 
  Star, 
  Clock, 
  TrendingUp,
  Zap,
  Target,
  X
} from 'lucide-react';
import { personalizationEngine, PersonalizedRecommendation, NavigationRecommendation } from '@/services/ai/personalizationEngine';
import { useRealTimeBehaviorTracking } from '@/hooks/ai/useRealTimeBehaviorTracking';

interface PersonalizedRecommendationsProps {
  userId: string;
  className?: string;
  maxRecommendations?: number;
  showNavigationRecommendations?: boolean;
}

export const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({
  userId,
  className = '',
  maxRecommendations = 5,
  showNavigationRecommendations = true
}) => {
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [navigationRecommendations, setNavigationRecommendations] = useState<NavigationRecommendation[]>([]);
  const [dismissedRecommendations, setDismissedRecommendations] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const { 
    smartContext, 
    getRecommendations, 
    trackInteraction 
  } = useRealTimeBehaviorTracking(userId);

  useEffect(() => {
    if (userId && smartContext) {
      loadRecommendations();
    }
  }, [userId, smartContext]);

  const loadRecommendations = async () => {
    setIsLoading(true);
    try {
      // Get personalized recommendations
      const personalizedRecs = await getRecommendations();
      
      // Filter out dismissed recommendations
      const filteredRecs = personalizedRecs.filter(rec => 
        !dismissedRecommendations.has(rec.id)
      );
      
      setRecommendations(filteredRecs.slice(0, maxRecommendations));

      // Generate navigation recommendations if enabled
      if (showNavigationRecommendations && smartContext) {
        const navRecs = personalizationEngine.generateNavigationRecommendations(
          smartContext, 
          [], // Will be populated from actual user preferences
          []  // Will be populated from actual patterns
        );
        setNavigationRecommendations(navRecs.slice(0, 3));
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecommendationClick = (recommendation: PersonalizedRecommendation) => {
    // Track the interaction
    trackInteraction('recommendation_clicked', {
      recommendationId: recommendation.id,
      recommendationType: recommendation.type,
      confidence: recommendation.confidence
    });

    // Execute the recommendation action
    recommendation.action();
  };

  const handleRecommendationDismiss = (recommendationId: string) => {
    setDismissedRecommendations(prev => new Set([...prev, recommendationId]));
    setRecommendations(prev => prev.filter(rec => rec.id !== recommendationId));
    
    // Track dismissal
    trackInteraction('recommendation_dismissed', {
      recommendationId
    });
  };

  const handleNavigationClick = (navRec: NavigationRecommendation) => {
    trackInteraction('navigation_recommendation_clicked', {
      path: navRec.path,
      confidence: navRec.confidence,
      estimatedValue: navRec.estimatedValue
    });
    
    // Navigate to the recommended path
    window.location.href = navRec.path;
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'action': return <Zap className="h-4 w-4" />;
      case 'navigation': return <ArrowRight className="h-4 w-4" />;
      case 'content': return <Star className="h-4 w-4" />;
      case 'workflow': return <Target className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-blue-600 bg-blue-100';
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <span className="ml-2 text-sm text-gray-500">Loading recommendations...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0 && navigationRecommendations.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No recommendations available at the moment.</p>
            <p className="text-sm text-gray-400 mt-1">
              Continue using the platform to receive personalized suggestions.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Smart Recommendations
            </CardTitle>
            <CardDescription>
              AI-powered suggestions based on your usage patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((recommendation) => (
                <div
                  key={recommendation.id}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mt-1">
                    {getRecommendationIcon(recommendation.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{recommendation.title}</h4>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getConfidenceColor(recommendation.confidence)}`}
                      >
                        {Math.round(recommendation.confidence * 100)}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {recommendation.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleRecommendationClick(recommendation)}
                      >
                        Take Action
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRecommendationDismiss(recommendation.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Recommendations */}
      {showNavigationRecommendations && navigationRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Navigation
            </CardTitle>
            <CardDescription>
              Suggested next steps based on your workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {navigationRecommendations.map((navRec, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigationClick(navRec)}
                  className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{navRec.label}</span>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(navRec.confidence * 100)}% match
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{navRec.reason}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time-Saving Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="justify-start">
              <Zap className="h-3 w-3 mr-2" />
              Quick Create
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Star className="h-3 w-3 mr-2" />
              Favorites
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <TrendingUp className="h-3 w-3 mr-2" />
              Recent Items
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Target className="h-3 w-3 mr-2" />
              Templates
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
