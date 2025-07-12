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
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedPriority('all');
    if (setSelectedType) setSelectedType('all');
    if (setSelectedDifficulty) setSelectedDifficulty('all');
  };

  const hasActiveFilters = selectedCategory !== 'all' || 
    selectedPriority !== 'all' || 
    selectedType !== 'all' || 
    selectedDifficulty !== 'all' ||
    searchTerm !== '';

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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search documentation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Category</label>
          <div className="space-y-1">
            {documentCategories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span className="truncate">{category.label}</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {category.count}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>

        {/* Priority Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Priority</label>
          <div className="space-y-1">
            {priorityLevels.map((priority) => {
              const isActive = selectedPriority === priority.id;
              
              return (
                <button
                  key={priority.id}
                  onClick={() => setSelectedPriority(priority.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="truncate">{priority.label}</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {priority.count}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>

        {/* Type Filter */}
        {setSelectedType && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Type</label>
            <div className="space-y-1">
              {documentTypes.map((type) => {
                const isActive = selectedType === type.id;
                
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="truncate">{type.label}</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {type.count}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Difficulty Filter */}
        {setSelectedDifficulty && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Difficulty</label>
            <div className="space-y-1">
              {difficultyLevels.map((difficulty) => {
                const isActive = selectedDifficulty === difficulty.id;
                
                return (
                  <button
                    key={difficulty.id}
                    onClick={() => setSelectedDifficulty(difficulty.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="truncate">{difficulty.label}</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {difficulty.count}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-700">Active Filters:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== 'all' && (
              <Badge variant="outline" className="text-xs">
                Category: {documentCategories.find(c => c.id === selectedCategory)?.label}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedPriority !== 'all' && (
              <Badge variant="outline" className="text-xs">
                Priority: {priorityLevels.find(p => p.id === selectedPriority)?.label}
                <button
                  onClick={() => setSelectedPriority('all')}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedType !== 'all' && setSelectedType && (
              <Badge variant="outline" className="text-xs">
                Type: {documentTypes.find(t => t.id === selectedType)?.label}
                <button
                  onClick={() => setSelectedType('all')}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedDifficulty !== 'all' && setSelectedDifficulty && (
              <Badge variant="outline" className="text-xs">
                Difficulty: {difficultyLevels.find(d => d.id === selectedDifficulty)?.label}
                <button
                  onClick={() => setSelectedDifficulty('all')}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {searchTerm && (
              <Badge variant="outline" className="text-xs">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
