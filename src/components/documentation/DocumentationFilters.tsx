
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Search & Filter Documentation</CardTitle>
        <CardDescription>
          Browse Total Recall's complete documentation including ATS training materials
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search documentation by title, description, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filters */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {documentCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {category.label} ({category.count})
                </Button>
              );
            })}
          </div>
        </div>

        {/* Document Type Filters */}
        {selectedType !== undefined && setSelectedType && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Document Type</h3>
            <div className="flex flex-wrap gap-2">
              {documentTypes.map((type) => (
                <Button
                  key={type.id}
                  variant={selectedType === type.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type.id)}
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
            <h3 className="text-sm font-medium text-gray-700">Difficulty Level</h3>
            <div className="flex flex-wrap gap-2">
              {difficultyLevels.map((difficulty) => (
                <Button
                  key={difficulty.id}
                  variant={selectedDifficulty === difficulty.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDifficulty(difficulty.id)}
                >
                  {difficulty.label} {difficulty.count !== undefined && `(${difficulty.count})`}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Priority Filters */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Priority Level</h3>
          <div className="flex flex-wrap gap-2">
            {priorityLevels.map((priority) => (
              <Button
                key={priority.id}
                variant={selectedPriority === priority.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPriority(priority.id)}
              >
                {priority.label} {priority.count !== undefined && `(${priority.count})`}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
