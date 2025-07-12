
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, X, Filter, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export interface CompanyFilters {
  search: string;
  industries: string[];
  sizes: string[];
  locations: string[];
  foundedFrom?: Date;
  foundedTo?: Date;
  registrationFrom?: Date;
  registrationTo?: Date;
  companyTypes: string[];
  sectors: string[];
}

interface CompanyAdvancedFiltersProps {
  filters: CompanyFilters;
  onFiltersChange: (filters: CompanyFilters) => void;
  onReset: () => void;
  companies: unknown[];
}

const CompanyAdvancedFilters: React.FC<CompanyAdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  companies,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract unique values from companies for filter options
  const getUniqueValues = (field: string) => {
    const values = companies
      .map(company => company[field])
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
    return values;
  };

  const industries = getUniqueValues('industry');
  const sizes = getUniqueValues('size');
  const locations = getUniqueValues('location');
  const companyTypes = getUniqueValues('companytype');
  const sectors = getUniqueValues('companysector');

  const updateFilters = (field: keyof CompanyFilters, value: unknown) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  const toggleArrayFilter = (field: 'industries' | 'sizes' | 'locations' | 'companyTypes' | 'sectors', value: string) => {
    const currentValues = filters[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    updateFilters(field, newValues);
  };

  const removeArrayFilterItem = (field: 'industries' | 'sizes' | 'locations' | 'companyTypes' | 'sectors', value: string) => {
    const currentValues = filters[field] || [];
    const newValues = currentValues.filter(v => v !== value);
    updateFilters(field, newValues);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.industries?.length) count++;
    if (filters.sizes?.length) count++;
    if (filters.locations?.length) count++;
    if (filters.foundedFrom || filters.foundedTo) count++;
    if (filters.registrationFrom || filters.registrationTo) count++;
    if (filters.companyTypes?.length) count++;
    if (filters.sectors?.length) count++;
    return count;
  };

  const DateRangePicker = ({ 
    fromDate, 
    toDate, 
    onFromChange, 
    onToChange, 
    label 
  }: {
    fromDate?: Date;
    toDate?: Date;
    onFromChange: (date?: Date) => void;
    onToChange: (date?: Date) => void;
    label: string;
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !fromDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {fromDate ? format(fromDate, "MMM dd, yyyy") : "From"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={onFromChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !toDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {toDate ? format(toDate, "MMM dd, yyyy") : "To"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={onToChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );

  const MultiSelectFilter = ({ 
    options, 
    selectedValues, 
    onToggle, 
    placeholder 
  }: {
    options: string[];
    selectedValues: string[];
    onToggle: (value: string) => void;
    placeholder: string;
  }) => (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem 
            key={option} 
            value={option}
            className="cursor-pointer"
            onClick={() => onToggle(option)}
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedValues.includes(option)}
                onChange={() => onToggle(option)}
                className="h-4 w-4"
              />
              <span>{option}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()} active
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="text-xs"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Active Filters Display */}
          {getActiveFiltersCount() > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Active Filters:</Label>
              <div className="flex flex-wrap gap-2">
                {filters.industries?.map(industry => (
                  <Badge key={industry} variant="secondary" className="text-xs">
                    Industry: {industry}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => removeArrayFilterItem('industries', industry)}
                    />
                  </Badge>
                ))}
                {filters.sizes?.map(size => (
                  <Badge key={size} variant="secondary" className="text-xs">
                    Size: {size}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => removeArrayFilterItem('sizes', size)}
                    />
                  </Badge>
                ))}
                {filters.locations?.map(location => (
                  <Badge key={location} variant="secondary" className="text-xs">
                    Location: {location}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => removeArrayFilterItem('locations', location)}
                    />
                  </Badge>
                ))}
                {filters.companyTypes?.map(type => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    Type: {type}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => removeArrayFilterItem('companyTypes', type)}
                    />
                  </Badge>
                ))}
                {filters.sectors?.map(sector => (
                  <Badge key={sector} variant="secondary" className="text-xs">
                    Sector: {sector}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => removeArrayFilterItem('sectors', sector)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Industry Filter */}
            <div className="space-y-2">
              <Label htmlFor="industry-filter">Industry</Label>
              <MultiSelectFilter
                options={industries}
                selectedValues={filters.industries || []}
                onToggle={(value) => toggleArrayFilter('industries', value)}
                placeholder="Select industries"
              />
            </div>

            {/* Company Size Filter */}
            <div className="space-y-2">
              <Label htmlFor="size-filter">Company Size</Label>
              <MultiSelectFilter
                options={sizes}
                selectedValues={filters.sizes || []}
                onToggle={(value) => toggleArrayFilter('sizes', value)}
                placeholder="Select sizes"
              />
            </div>

            {/* Location Filter */}
            <div className="space-y-2">
              <Label htmlFor="location-filter">Location</Label>
              <MultiSelectFilter
                options={locations}
                selectedValues={filters.locations || []}
                onToggle={(value) => toggleArrayFilter('locations', value)}
                placeholder="Select locations"
              />
            </div>

            {/* Company Type Filter */}
            <div className="space-y-2">
              <Label htmlFor="type-filter">Company Type</Label>
              <MultiSelectFilter
                options={companyTypes}
                selectedValues={filters.companyTypes || []}
                onToggle={(value) => toggleArrayFilter('companyTypes', value)}
                placeholder="Select types"
              />
            </div>

            {/* Sector Filter */}
            <div className="space-y-2">
              <Label htmlFor="sector-filter">Sector</Label>
              <MultiSelectFilter
                options={sectors}
                selectedValues={filters.sectors || []}
                onToggle={(value) => toggleArrayFilter('sectors', value)}
                placeholder="Select sectors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {/* Founded Date Range */}
            <DateRangePicker
              fromDate={filters.foundedFrom}
              toDate={filters.foundedTo}
              onFromChange={(date) => updateFilters('foundedFrom', date)}
              onToChange={(date) => updateFilters('foundedTo', date)}
              label="Founded Date Range"
            />

            {/* Registration Date Range */}
            <DateRangePicker
              fromDate={filters.registrationFrom}
              toDate={filters.registrationTo}
              onFromChange={(date) => updateFilters('registrationFrom', date)}
              onToChange={(date) => updateFilters('registrationTo', date)}
              label="Registration Date Range"
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default CompanyAdvancedFilters;
