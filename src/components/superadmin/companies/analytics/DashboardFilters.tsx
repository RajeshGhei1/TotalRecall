
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Filter, X, RefreshCw } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

interface FilterState {
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  industry: string;
  location: string;
  size: string;
  hierarchyLevel: string;
  searchTerm: string;
}

interface DashboardFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  industries: string[];
  locations: string[];
  sizes: string[];
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  filters,
  onFiltersChange,
  industries,
  locations,
  sizes,
}) => {
  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      dateRange: { from: null, to: null },
      industry: '',
      location: '',
      size: '',
      hierarchyLevel: '',
      searchTerm: ''
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.industry) count++;
    if (filters.location) count++;
    if (filters.size) count++;
    if (filters.hierarchyLevel) count++;
    if (filters.searchTerm) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Analytics Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary">{activeFilterCount}</Badge>
            )}
          </CardTitle>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Companies</Label>
            <Input
              id="search"
              placeholder="Search by name..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
            />
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange.from ? (
                    filters.dateRange.to ? (
                      <>
                        {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                        {format(filters.dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(filters.dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    "Select date range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={filters.dateRange.from || undefined}
                  selected={{
                    from: filters.dateRange.from || undefined,
                    to: filters.dateRange.to || undefined,
                  }}
                  onSelect={(range) => updateFilter('dateRange', {
                    from: range?.from || null,
                    to: range?.to || null
                  })}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Industry */}
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select value={filters.industry} onValueChange={(value) => updateFilter('industry', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All industries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All industries</SelectItem>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select value={filters.location} onValueChange={(value) => updateFilter('location', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Company Size */}
          <div className="space-y-2">
            <Label htmlFor="size">Company Size</Label>
            <Select value={filters.size} onValueChange={(value) => updateFilter('size', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All sizes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All sizes</SelectItem>
                {sizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Hierarchy Level */}
          <div className="space-y-2">
            <Label htmlFor="hierarchy">Hierarchy Level</Label>
            <Select value={filters.hierarchyLevel} onValueChange={(value) => updateFilter('hierarchyLevel', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All levels</SelectItem>
                <SelectItem value="0">Level 0 (Parent)</SelectItem>
                <SelectItem value="1">Level 1</SelectItem>
                <SelectItem value="2">Level 2</SelectItem>
                <SelectItem value="3">Level 3+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {filters.searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {filters.searchTerm}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter('searchTerm', '')} 
                />
              </Badge>
            )}
            {filters.industry && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Industry: {filters.industry}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter('industry', '')} 
                />
              </Badge>
            )}
            {filters.location && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Location: {filters.location}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter('location', '')} 
                />
              </Badge>
            )}
            {filters.size && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Size: {filters.size}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter('size', '')} 
                />
              </Badge>
            )}
            {filters.hierarchyLevel && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Level: {filters.hierarchyLevel}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter('hierarchyLevel', '')} 
                />
              </Badge>
            )}
            {(filters.dateRange.from || filters.dateRange.to) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Date Range
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter('dateRange', { from: null, to: null })} 
                />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardFilters;
