
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, X, Filter, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import MultiSelectFilter from '@/components/reporting/filters/MultiSelectFilter';
import { CompanyFilters } from '../hooks/useCompanyFilters';

interface EnhancedCompanyFiltersProps {
  filters: CompanyFilters;
  onFiltersChange: (filters: CompanyFilters) => void;
  onReset: () => void;
  companies: any[];
}

const EnhancedCompanyFilters: React.FC<EnhancedCompanyFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  companies,
}) => {
  // Extract unique values from companies for filter options
  const getUniqueOptions = (field: string) => {
    const values = companies
      .map(company => company[field])
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
    return values.map(value => ({ value, label: value }));
  };

  const industryOptions = getUniqueOptions('industry1');
  const sizeOptions = getUniqueOptions('size');
  const locationOptions = getUniqueOptions('location');
  const companyTypeOptions = getUniqueOptions('companytype');
  const sectorOptions = getUniqueOptions('companysector');

  const updateFilters = (field: keyof CompanyFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
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

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Enhanced Multi-Select Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()} active
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="text-xs"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset All
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="space-y-2">
          <Label htmlFor="search">Search Companies</Label>
          <Input
            id="search"
            placeholder="Search by name, domain, email..."
            value={filters.search}
            onChange={(e) => updateFilters('search', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Multi-Select Filters */}
          <MultiSelectFilter
            label="Industries"
            options={industryOptions}
            value={filters.industries || []}
            onChange={(value) => updateFilters('industries', value)}
            placeholder="Select industries"
          />

          <MultiSelectFilter
            label="Company Sizes"
            options={sizeOptions}
            value={filters.sizes || []}
            onChange={(value) => updateFilters('sizes', value)}
            placeholder="Select sizes"
          />

          <MultiSelectFilter
            label="Locations"
            options={locationOptions}
            value={filters.locations || []}
            onChange={(value) => updateFilters('locations', value)}
            placeholder="Select locations"
          />

          <MultiSelectFilter
            label="Company Types"
            options={companyTypeOptions}
            value={filters.companyTypes || []}
            onChange={(value) => updateFilters('companyTypes', value)}
            placeholder="Select types"
          />

          <MultiSelectFilter
            label="Sectors"
            options={sectorOptions}
            value={filters.sectors || []}
            onChange={(value) => updateFilters('sectors', value)}
            placeholder="Select sectors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Date Range Filters */}
          <DateRangePicker
            fromDate={filters.foundedFrom}
            toDate={filters.foundedTo}
            onFromChange={(date) => updateFilters('foundedFrom', date)}
            onToChange={(date) => updateFilters('foundedTo', date)}
            label="Founded Date Range"
          />

          <DateRangePicker
            fromDate={filters.registrationFrom}
            toDate={filters.registrationTo}
            onFromChange={(date) => updateFilters('registrationFrom', date)}
            onToChange={(date) => updateFilters('registrationTo', date)}
            label="Registration Date Range"
          />
        </div>

        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <div className="space-y-2 pt-4 border-t">
            <Label className="text-sm font-medium">Active Filters:</Label>
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <Badge variant="secondary" className="text-xs">
                  Search: {filters.search}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => updateFilters('search', '')}
                  />
                </Badge>
              )}
              {filters.industries?.map(industry => (
                <Badge key={industry} variant="secondary" className="text-xs">
                  Industry: {industry}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => updateFilters('industries', 
                      filters.industries?.filter(i => i !== industry) || [])}
                  />
                </Badge>
              ))}
              {filters.sizes?.map(size => (
                <Badge key={size} variant="secondary" className="text-xs">
                  Size: {size}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => updateFilters('sizes', 
                      filters.sizes?.filter(s => s !== size) || [])}
                  />
                </Badge>
              ))}
              {filters.locations?.map(location => (
                <Badge key={location} variant="secondary" className="text-xs">
                  Location: {location}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => updateFilters('locations', 
                      filters.locations?.filter(l => l !== location) || [])}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedCompanyFilters;
