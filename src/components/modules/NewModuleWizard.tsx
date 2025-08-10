
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wand2, 
  FileText, 
  Code, 
  TestTube, 
  Upload,
  CheckCircle,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import FeatureSelector from '@/components/common/FeatureSelector';

interface NewModuleWizardProps {
  onComplete: (moduleData: Record<string, unknown>) => void;
  onCancel: () => void;
}

const NewModuleWizard: React.FC<NewModuleWizardProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [moduleData, setModuleData] = useState({
    name: '',
    description: '',
    category: '',
    version: '1.0.0',
    templateId: '',
    features: [] as string[],
    ai_capabilities: [] as string[],
    dependencies: [] as string[],
    configuration: {}
  });

  const steps = [
    { id: 'basic', title: 'Basic Info', icon: FileText },
    { id: 'template', title: 'Template', icon: Wand2 },
    { id: 'features', title: 'Features', icon: Code },
    { id: 'review', title: 'Review', icon: CheckCircle }
  ];

  const categories = [
    { value: 'core', label: 'Core System' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'communication', label: 'Communication' },
    { value: 'data-services', label: 'Data Services' },
    { value: 'integrations', label: 'Integrations' },
    { value: 'recruitment', label: 'Recruitment' },
    { value: 'talent', label: 'Talent Management' },
    { value: 'custom', label: 'Custom Module' }
  ];

  const templates = [
    { id: 'dashboard', name: 'Dashboard Module', description: 'Create a dashboard with widgets and charts' },
    { id: 'form', name: 'Form Module', description: 'Build forms with validation and submission handling' },
    { id: 'data-table', name: 'Data Table Module', description: 'Display and manage tabular data' },
    { id: 'workflow', name: 'Workflow Module', description: 'Create automated workflows and processes' },
    { id: 'api-integration', name: 'API Integration', description: 'Connect to external APIs and services' },
    { id: 'blank', name: 'Blank Module', description: 'Start from scratch with minimal boilerplate' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    toast({
      title: 'Module Created',
      description: `${moduleData.name} has been scaffolded and is ready for development.`,
    });
    onComplete(moduleData);
  };

  const handleFeaturesChange = (features: string[]) => {
    setModuleData(prev => ({ ...prev, features }));
  };

  const handleAICapabilitiesChange = (ai_capabilities: string[]) => {
    setModuleData(prev => ({ ...prev, ai_capabilities }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 
                ${isActive ? 'border-blue-500 bg-blue-500 text-white' : 
                  isCompleted ? 'border-green-500 bg-green-500 text-white' : 
                  'border-gray-300 text-gray-400'}
              `}>
                <Icon className="h-5 w-5" />
              </div>
              <span className={`ml-2 text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-16 h-px mx-4 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
              )}
            </div>
          );
        })}
      </div>

      <Card>
        <CardContent className="p-6">
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Module Name</Label>
                    <Input
                      id="name"
                      value={moduleData.name}
                      onChange={(e) => setModuleData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Advanced Analytics Dashboard"
                    />
                  </div>
                  <div>
                    <Label htmlFor="version">Version</Label>
                    <Input
                      id="version"
                      value={moduleData.version}
                      onChange={(e) => setModuleData(prev => ({ ...prev, version: e.target.value }))}
                      placeholder="1.0.0"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={moduleData.category} 
                    onValueChange={(value) => setModuleData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="mt-4">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={moduleData.description}
                    onChange={(e) => setModuleData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what your module does and its main purpose..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Choose Template</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        moduleData.templateId === template.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setModuleData(prev => ({ ...prev, templateId: template.id }))}
                    >
                      <h4 className="font-medium mb-2">{template.name}</h4>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <FeatureSelector
                selectedFeatures={moduleData.features}
                selectedAICapabilities={moduleData.ai_capabilities}
                onFeaturesChange={handleFeaturesChange}
                onAICapabilitiesChange={handleAICapabilitiesChange}
                moduleType={moduleData.category}
                moduleCategory={moduleData.category}
                showRecommendations={true}
                showStats={true}
                title="Select Module Features"
                description="Choose the features and AI capabilities your module will provide"
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Review & Create</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Module Details</h4>
                    <div className="mt-2 space-y-1 text-sm">
                      <p><strong>Name:</strong> {moduleData.name}</p>
                      <p><strong>Version:</strong> {moduleData.version}</p>
                      <p><strong>Category:</strong> {categories.find(c => c.value === moduleData.category)?.label}</p>
                      <p><strong>Template:</strong> {templates.find(t => t.id === moduleData.templateId)?.name}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">Description</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{moduleData.description}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Selected Features ({moduleData.features.length})</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {moduleData.features.map((feature) => (
                        <Badge key={feature} variant="secondary">{feature}</Badge>
                      ))}
                      {moduleData.features.length === 0 && (
                        <span className="text-sm text-gray-500">No features selected</span>
                      )}
                    </div>
                  </div>
                  {moduleData.ai_capabilities.length > 0 && (
                    <div>
                      <h4 className="font-medium">Selected AI Capabilities ({moduleData.ai_capabilities.length})</h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {moduleData.ai_capabilities.map((capability) => (
                          <Badge key={capability} variant="outline" className="bg-purple-50">{capability}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <div>
              {currentStep > 0 && (
                <Button variant="outline" onClick={handlePrevious}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleComplete}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Create Module
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewModuleWizard;
