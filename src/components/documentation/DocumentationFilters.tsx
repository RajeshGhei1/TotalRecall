
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { documentCategories, priorityLevels } from '@/data/documentationCategories';

interface DocumentationFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedPriority: string;
  setSelectedPriority: (priority: string) => void;
}

export function DocumentationFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedPriority,
  setSelectedPriority,
}: DocumentationFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Search & Filter Documentation</CardTitle>
        <CardDescription>
          Browse Total Recall's current system documentation and implementation guides
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
