import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertCircle, 
  CheckCircle, 
  ArrowRight, 
  Lightbulb,
  Settings,
  Star,
  Info
} from 'lucide-react';

interface ModuleFeatureUpgradeHelperProps {
  moduleCount?: number;
  onUpgradeModules?: () => void;
  onViewModules?: () => void;
}

export const ModuleFeatureUpgradeHelper: React.FC<ModuleFeatureUpgradeHelperProps> = ({
  moduleCount = 0,
  onUpgradeModules,
  onViewModules
}) => {
  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <Lightbulb className="h-5 w-5" />
          Upgrade Existing Modules
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-orange-200 bg-orange-100">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-orange-800">
            <strong>Good News!</strong> Your existing modules can now be enhanced with the comprehensive feature library.
          </AlertDescription>
        </Alert>

        {/* Current Status */}
        <div>
          <h4 className="font-medium text-orange-800 mb-2">Current Module Status:</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-white rounded border">
              <div className="text-2xl font-bold text-orange-600">{moduleCount}</div>
              <div className="text-sm text-orange-700">Existing Modules</div>
            </div>
            <div className="text-center p-3 bg-white rounded border">
              <div className="text-2xl font-bold text-green-600">139</div>
              <div className="text-sm text-green-700">Features Available</div>
            </div>
          </div>
        </div>

        {/* What's Available */}
        <div>
          <h4 className="font-medium text-orange-800 mb-2">Now Available for Your Modules:</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>96 Standard Features across 12 categories</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>43 AI Capabilities for intelligent functionality</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Smart recommendations based on module type</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Custom feature addition capabilities</span>
            </div>
          </div>
        </div>

        {/* How to Upgrade */}
        <div>
          <h4 className="font-medium text-orange-800 mb-2">How to Apply Features to Existing Modules:</h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white rounded border">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <p className="font-medium text-sm">Navigate to Module Management</p>
                <p className="text-xs text-gray-600">Go to Super Admin → Settings → Modules</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded border">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <p className="font-medium text-sm">Find Your Module</p>
                <p className="text-xs text-gray-600">Look for modules at any development stage</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded border">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <p className="font-medium text-sm">Click "Edit" or Settings Icon</p>
                <p className="text-xs text-gray-600">Opens enhanced edit dialog with feature library</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded border">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                4
              </div>
              <div>
                <p className="font-medium text-sm">Select Features & AI Capabilities</p>
                <p className="text-xs text-gray-600">Choose from comprehensive library with smart recommendations</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded border">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                5
              </div>
              <div>
                <p className="font-medium text-sm">Save & Upgrade</p>
                <p className="text-xs text-gray-600">Module is enhanced with comprehensive features</p>
              </div>
            </div>
          </div>
        </div>

        {/* Special Benefits */}
        <div className="p-3 bg-white rounded border">
          <h4 className="font-medium text-orange-800 mb-2 flex items-center gap-2">
            <Star className="h-4 w-4" />
            Special Benefits for CRM Modules:
          </h4>
          <div className="space-y-1 text-sm">
            <p>• 8 dedicated Sales & CRM features</p>
            <p>• 5 AI capabilities for sales intelligence</p>
            <p>• Lead scoring, forecasting, and behavior analysis</p>
            <p>• Perfect for your .NET CRM integration</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {onViewModules && (
            <Button 
              onClick={onViewModules}
              variant="outline" 
              className="flex-1"
            >
              <Settings className="h-4 w-4 mr-2" />
              View All Modules
            </Button>
          )}
          {onUpgradeModules && (
            <Button 
              onClick={onUpgradeModules}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Start Upgrading
            </Button>
          )}
        </div>

        {/* Status Note */}
        <div className="text-xs text-orange-700 bg-orange-100 p-2 rounded">
          <strong>Note:</strong> Legacy modules will be automatically detected and can be upgraded 
          to use the comprehensive feature library without losing existing functionality.
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleFeatureUpgradeHelper; 