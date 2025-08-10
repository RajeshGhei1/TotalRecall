import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Brain, 
  Layers, 
  Star,
  ArrowRight,
  Info
} from 'lucide-react';
import { getFeatureLibraryStats } from '@/services/moduleFeatureLibrary';

interface FeatureLibraryStatusProps {
  compact?: boolean;
  showDetails?: boolean;
  onViewLibrary?: () => void;
}

export const FeatureLibraryStatus: React.FC<FeatureLibraryStatusProps> = ({
  compact = false,
  showDetails = true,
  onViewLibrary
}) => {
  const stats = getFeatureLibraryStats();

  if (compact) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">Feature Library Active</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-700">
              <Badge variant="outline" className="bg-white">
                {stats.totalFeatures} Features
              </Badge>
              <Badge variant="outline" className="bg-white">
                {stats.totalAICapabilities} AI
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Feature Library Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.totalFeatures}</div>
            <div className="text-sm text-blue-700">Standard Features</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.totalAICapabilities}</div>
            <div className="text-sm text-purple-700">AI Capabilities</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.totalCategories}</div>
            <div className="text-sm text-green-700">Categories</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {stats.totalFeatures + stats.totalAICapabilities}
            </div>
            <div className="text-sm text-orange-700">Total Options</div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Feature library loaded successfully</span>
            <Badge variant="outline" className="text-xs">Active</Badge>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Brain className="h-4 w-4 text-purple-500" />
            <span>AI capabilities integrated</span>
            <Badge variant="outline" className="text-xs">Ready</Badge>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>Smart recommendations enabled</span>
            <Badge variant="outline" className="text-xs">Available</Badge>
          </div>
        </div>

        {/* Category Breakdown */}
        {showDetails && (
          <div>
            <h4 className="font-medium mb-3">Feature Categories</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {stats.categoriesBreakdown.map(category => (
                <div key={category.name} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="truncate">{category.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Categories */}
        {showDetails && (
          <div>
            <h4 className="font-medium mb-3">AI Capability Categories</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.aiCategoriesBreakdown).map(([category, count]) => (
                <Badge key={category} variant="outline" className="text-xs">
                  {category}: {count}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* CRM Specific Info */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">Perfect for CRM Modules</h4>
              <p className="text-sm text-blue-700 mt-1">
                The library includes 8 dedicated Sales & CRM features plus AI capabilities like 
                lead scoring, sales forecasting, and customer behavior analysis.
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                <Badge variant="outline" className="text-xs bg-white">Lead Management</Badge>
                <Badge variant="outline" className="text-xs bg-white">Sales Pipeline</Badge>
                <Badge variant="outline" className="text-xs bg-white">AI Scoring</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {onViewLibrary && (
          <Button onClick={onViewLibrary} className="w-full">
            <ArrowRight className="h-4 w-4 mr-2" />
            Create Module with Feature Library
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default FeatureLibraryStatus; 