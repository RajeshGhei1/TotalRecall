import React from 'react';
import { Search, Filter, X, BookOpen, Users, Code, Zap, Database, Shield, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { documentCategories, priorityLevels, documentTypes, difficultyLevels } from '@/data/documentationCategories';

interface DocumentationFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedPriority: string;
  setSelectedPriority: (priority: string) => void;
  selectedType?: string;
  setSelectedType?: (type: string) => void;
  selectedDifficulty?: string;
  setSelectedDifficulty?: (difficulty: string) => void;
}

export function DocumentationFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedPriority,
  setSelectedPriority,
  selectedType,
  setSelectedType,
  selectedDifficulty,
  setSelectedDifficulty,
}: DocumentationFiltersProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'getting-started': return <BookOpen className="h-4 w-4" />;
      case 'user-guides': return <Users className="h-4 w-4" />;
      case 'technical': return <Code className="h-4 w-4" />;
      case 'api': return <Zap className="h-4 w-4" />;
      case 'deployment': return <Database className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'troubleshooting': return <Settings className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedPriority('all');
    if (setSelectedType) setSelectedType('all');
    if (setSelectedDifficulty) setSelectedDifficulty('all');
  };

  const hasActiveFilters = searchTerm || 
    selectedCategory !== 'all' || 
    selectedPriority !== 'all' || 
    selectedType !== 'all' || 
    selectedDifficulty !== 'all';

  return (
    <Card className="border-slate-200 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Search & Filter</CardTitle>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-slate-500 hover:text-slate-700"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
        <CardDescription>
          Browse Total Recall's complete documentation including ATS training materials
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enhanced Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search documentation by title, description, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Category Filters */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Categories
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {documentCategories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              
              return (
                <Button
                  key={category.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`justify-start h-auto p-3 ${
                    isSelected 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 w-full">
                    {Icon && <Icon className="h-4 w-4" />}
                    <div className="text-left">
                      <div className="font-medium">{category.label}</div>
                      <div className="text-xs opacity-75">({category.count})</div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Document Type Filters */}
        {selectedType !== undefined && setSelectedType && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-700">Document Type</h3>
            <div className="flex flex-wrap gap-2">
              {documentTypes.map((type) => (
                <Button
                  key={type.id}
                  variant={selectedType === type.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type.id)}
                  className={selectedType === type.id ? '' : 'border-slate-300 hover:bg-slate-50'}
                >
                  {type.label} {type.count !== undefined && `(${type.count})`}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Difficulty Level Filters */}
        {selectedDifficulty !== undefined && setSelectedDifficulty && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-700">Difficulty Level</h3>
            <div className="flex flex-wrap gap-2">
              {difficultyLevels.map((difficulty) => (
                <Button
                  key={difficulty.id}
                  variant={selectedDifficulty === difficulty.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDifficulty(difficulty.id)}
                  className={selectedDifficulty === difficulty.id ? '' : 'border-slate-300 hover:bg-slate-50'}
                >
                  {difficulty.label} {difficulty.count !== undefined && `(${difficulty.count})`}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Priority Filters */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-700">Priority Level</h3>
          <div className="flex flex-wrap gap-2">
            {priorityLevels.map((priority) => (
              <Button
                key={priority.id}
                variant={selectedPriority === priority.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPriority(priority.id)}
                className={selectedPriority === priority.id ? '' : 'border-slate-300 hover:bg-slate-50'}
              >
                {priority.label} {priority.count !== undefined && `(${priority.count})`}
              </Button>
            ))}
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-sm font-medium text-slate-700 mb-2">Active Filters:</h4>
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <Badge variant="secondary" className="text-xs">
                  Search: "{searchTerm}"
                </Badge>
              )}
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  Category: {documentCategories.find(c => c.id === selectedCategory)?.label}
                </Badge>
              )}
              {selectedPriority !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  Priority: {priorityLevels.find(p => p.id === selectedPriority)?.label}
                </Badge>
              )}
              {selectedType && selectedType !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  Type: {documentTypes.find(t => t.id === selectedType)?.label}
                </Badge>
              )}
              {selectedDifficulty && selectedDifficulty !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  Difficulty: {difficultyLevels.find(d => d.id === selectedDifficulty)?.label}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
