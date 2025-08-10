import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Plus, 
  X, 
  Lightbulb, 
  Brain,
  CheckCircle,
  Filter,
  Star
} from 'lucide-react';
import { 
  STANDARD_FEATURE_CATEGORIES, 
  AI_CAPABILITIES,
  getAllStandardFeatures,
  getAllAICapabilities,
  getRecommendedFeatures,
  getRecommendedAICapabilities,
  searchFeatures,
  searchAICapabilities,
  getFeatureLibraryStats
} from '@/services/moduleFeatureLibrary';

interface FeatureSelectorProps {
  selectedFeatures: string[];
  selectedAICapabilities: string[];
  onFeaturesChange: (features: string[]) => void;
  onAICapabilitiesChange: (capabilities: string[]) => void;
  moduleType?: string;
  moduleCategory?: string;
  showRecommendations?: boolean;
  showStats?: boolean;
  compact?: boolean;
  title?: string;
  description?: string;
}

export const FeatureSelector: React.FC<FeatureSelectorProps> = ({
  selectedFeatures,
  selectedAICapabilities,
  onFeaturesChange,
  onAICapabilitiesChange,
  moduleType = '',
  moduleCategory = '',
  showRecommendations = true,
  showStats = true,
  compact = false,
  title = "Module Features & AI Capabilities",
  description = "Select the features and AI capabilities this module will provide"
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customFeature, setCustomFeature] = useState('');
  const [customAICapability, setCustomAICapability] = useState('');
  const [activeTab, setActiveTab] = useState('features');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Get library stats
  const stats = getFeatureLibraryStats();

  // Get recommendations
  const recommendedFeatures = useMemo(() => {
    return showRecommendations ? getRecommendedFeatures(moduleType, moduleCategory) : [];
  }, [moduleType, moduleCategory, showRecommendations]);

  const recommendedAI = useMemo(() => {
    return showRecommendations ? getRecommendedAICapabilities(moduleType, moduleCategory) : [];
  }, [moduleType, moduleCategory, showRecommendations]);

  // Filter features by search and category
  const filteredFeatureCategories = useMemo(() => {
    let categories = STANDARD_FEATURE_CATEGORIES;
    
    if (selectedCategoryFilter !== 'all') {
      categories = categories.filter(cat => cat.id === selectedCategoryFilter);
    }

    if (searchTerm) {
      const searchResults = searchFeatures(searchTerm);
      categories = categories.map(cat => ({
        ...cat,
        features: cat.features.filter(feature => searchResults.includes(feature))
      })).filter(cat => cat.features.length > 0);
    }

    return categories;
  }, [searchTerm, selectedCategoryFilter]);

  // Filter AI capabilities
  const filteredAICapabilities = useMemo(() => {
    if (searchTerm) {
      return searchAICapabilities(searchTerm);
    }
    return AI_CAPABILITIES;
  }, [searchTerm]);

  // Feature management functions
  const toggleFeature = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      onFeaturesChange(selectedFeatures.filter(f => f !== feature));
    } else {
      onFeaturesChange([...selectedFeatures, feature]);
    }
  };

  const toggleAICapability = (capability: string) => {
    if (selectedAICapabilities.includes(capability)) {
      onAICapabilitiesChange(selectedAICapabilities.filter(c => c !== capability));
    } else {
      onAICapabilitiesChange([...selectedAICapabilities, capability]);
    }
  };

  const addCustomFeature = () => {
    if (customFeature.trim() && !selectedFeatures.includes(customFeature.trim())) {
      onFeaturesChange([...selectedFeatures, customFeature.trim()]);
      setCustomFeature('');
    }
  };

  const addCustomAICapability = () => {
    if (customAICapability.trim() && !selectedAICapabilities.includes(customAICapability.trim())) {
      onAICapabilitiesChange([...selectedAICapabilities, customAICapability.trim()]);
      setCustomAICapability('');
    }
  };

  const removeFeature = (feature: string) => {
    onFeaturesChange(selectedFeatures.filter(f => f !== feature));
  };

  const removeAICapability = (capability: string) => {
    onAICapabilitiesChange(selectedAICapabilities.filter(c => c !== capability));
  };

  const applyRecommendations = (type: 'features' | 'ai') => {
    if (type === 'features') {
      const newFeatures = [...new Set([...selectedFeatures, ...recommendedFeatures])];
      onFeaturesChange(newFeatures);
    } else {
      const newCapabilities = [...new Set([...selectedAICapabilities, ...recommendedAI])];
      onAICapabilitiesChange(newCapabilities);
    }
  };

  const renderSelectedItems = (items: string[], onRemove: (item: string) => void, variant: 'default' | 'outline' = 'default') => (
    <div className="flex flex-wrap gap-2 mt-2 p-3 bg-gray-50 rounded-md">
      {items.map((item) => (
        <Badge key={item} variant={variant} className="flex items-center gap-1">
          {item}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onRemove(item)}
          />
        </Badge>
      ))}
    </div>
  );

  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{title}</CardTitle>
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Stats */}
          {showStats && (
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.totalFeatures}</div>
                <div className="text-xs text-gray-500">Features</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{stats.totalAICapabilities}</div>
                <div className="text-xs text-gray-500">AI Capabilities</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{selectedFeatures.length + selectedAICapabilities.length}</div>
                <div className="text-xs text-gray-500">Selected</div>
              </div>
            </div>
          )}

          {/* Selected Items Display */}
          {selectedFeatures.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Selected Features ({selectedFeatures.length})</Label>
              {renderSelectedItems(selectedFeatures, removeFeature)}
            </div>
          )}

          {selectedAICapabilities.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Selected AI Capabilities ({selectedAICapabilities.length})</Label>
              {renderSelectedItems(selectedAICapabilities, removeAICapability, 'outline')}
            </div>
          )}

          <Button 
            variant="outline" 
            onClick={() => setActiveTab('features')}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add More Features
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          {title}
        </CardTitle>
        {description && <p className="text-sm text-gray-600">{description}</p>}
        
        {/* Stats Display */}
        {showStats && (
          <div className="grid grid-cols-4 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalFeatures}</div>
              <div className="text-xs text-gray-500">Standard Features</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalAICapabilities}</div>
              <div className="text-xs text-gray-500">AI Capabilities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{selectedFeatures.length}</div>
              <div className="text-xs text-gray-500">Features Selected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{selectedAICapabilities.length}</div>
              <div className="text-xs text-gray-500">AI Selected</div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="features" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Standard Features ({selectedFeatures.length})
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Capabilities ({selectedAICapabilities.length})
            </TabsTrigger>
          </TabsList>

          {/* Search and Filters */}
          <div className="flex gap-4 mt-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search features and capabilities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Categories</option>
              {STANDARD_FEATURE_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <TabsContent value="features" className="space-y-4">
            {/* Recommendations */}
            {showRecommendations && recommendedFeatures.length > 0 && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-blue-600" />
                    Recommended for {moduleCategory || moduleType} modules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {recommendedFeatures.map(feature => (
                      <Badge 
                        key={feature} 
                        variant={selectedFeatures.includes(feature) ? "default" : "outline"}
                        className="cursor-pointer flex items-center gap-1"
                        onClick={() => toggleFeature(feature)}
                      >
                        <Star className="h-3 w-3" />
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => applyRecommendations('features')}
                  >
                    Apply All Recommendations
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Selected Features */}
            {selectedFeatures.length > 0 && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Selected Features ({selectedFeatures.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderSelectedItems(selectedFeatures, removeFeature)}
                </CardContent>
              </Card>
            )}

            {/* Feature Categories */}
            <ScrollArea className="h-96 border rounded-md p-4">
              {filteredFeatureCategories.map(category => (
                <div key={category.id} className="mb-6">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    {category.name} ({category.features.length})
                  </Label>
                  <p className="text-xs text-gray-500 mb-3">{category.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {category.features.map(feature => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox
                          id={feature}
                          checked={selectedFeatures.includes(feature)}
                          onCheckedChange={() => toggleFeature(feature)}
                        />
                        <Label 
                          htmlFor={feature} 
                          className="text-sm cursor-pointer hover:text-blue-600"
                        >
                          {feature}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </ScrollArea>

            {/* Add Custom Feature */}
            <div className="flex gap-2">
              <Input
                placeholder="Add custom feature..."
                value={customFeature}
                onChange={(e) => setCustomFeature(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomFeature()}
              />
              <Button onClick={addCustomFeature} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            {/* AI Recommendations */}
            {showRecommendations && recommendedAI.length > 0 && (
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Brain className="h-4 w-4 text-purple-600" />
                    Recommended AI for {moduleCategory || moduleType} modules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {recommendedAI.map(capability => (
                      <Badge 
                        key={capability} 
                        variant={selectedAICapabilities.includes(capability) ? "default" : "outline"}
                        className="cursor-pointer flex items-center gap-1"
                        onClick={() => toggleAICapability(capability)}
                      >
                        <Brain className="h-3 w-3" />
                        {capability}
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => applyRecommendations('ai')}
                  >
                    Apply All AI Recommendations
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Selected AI Capabilities */}
            {selectedAICapabilities.length > 0 && (
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Selected AI Capabilities ({selectedAICapabilities.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderSelectedItems(selectedAICapabilities, removeAICapability, 'outline')}
                </CardContent>
              </Card>
            )}

            {/* AI Capabilities Grid */}
            <ScrollArea className="h-96 border rounded-md p-4">
              <div className="grid grid-cols-1 gap-3">
                {filteredAICapabilities.map(capability => (
                  <div key={capability.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      id={capability.id}
                      checked={selectedAICapabilities.includes(capability.name)}
                      onCheckedChange={() => toggleAICapability(capability.name)}
                    />
                    <div className="flex-1">
                      <Label 
                        htmlFor={capability.id} 
                        className="text-sm font-medium cursor-pointer hover:text-purple-600"
                      >
                        {capability.name}
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">{capability.description}</p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {capability.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Add Custom AI Capability */}
            <div className="flex gap-2">
              <Input
                placeholder="Add custom AI capability..."
                value={customAICapability}
                onChange={(e) => setCustomAICapability(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomAICapability()}
              />
              <Button onClick={addCustomAICapability} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FeatureSelector; 