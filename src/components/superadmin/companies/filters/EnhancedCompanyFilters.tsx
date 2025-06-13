
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import MultiSelectFilter from '@/components/reporting/filters/MultiSelectFilter';
import { CompanyFilters } from '../hooks/useCompanyFilters';
import { Company } from '@/hooks/useCompanies';

interface EnhancedCompanyFiltersProps {
  filters: CompanyFilters;
  onFiltersChange: (filters: CompanyFilters) => void;
  onReset: () => void;
  companies: Company[];
}

const EnhancedCompanyFilters: React.FC<EnhancedCompanyFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  companies
}) => {
  // Extract unique values for filter options
  const getUniqueValues = (field: keyof Company) => {
    return Array.from(new Set(
      companies
        .map(company => company[field])
        .filter(value => value !== null && value !== undefined && value !== '')
    )).map(value => ({ label: String(value), value: String(value) }));
  };

  const industryOptions = getUniqueValues('industry1');
  const sizeOptions = getUniqueValues('size');
  const locationOptions = getUniqueValues('location');
  const countryOptions = getUniqueValues('country');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Advanced Filters</CardTitle>
        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MultiSelectFilter
            label="Industries"
            options={industryOptions}
            value={filters.industry1}
            onChange={(value) => onFiltersChange({ ...filters, industry1: value })}
            placeholder="Select industries"
          />

          <MultiSelectFilter
            label="Company Size"
            options={sizeOptions}
            value={filters.sizes}
            onChange={(value) => onFiltersChange({ ...filters, sizes: value })}
            placeholder="Select sizes"
          />

          <MultiSelectFilter
            label="Locations"
            options={locationOptions}
            value={filters.locations}
            onChange={(value) => onFiltersChange({ ...filters, locations: value })}
            placeholder="Select locations"
          />

          <MultiSelectFilter
            label="Countries"
            options={countryOptions}
            value={filters.countries}
            onChange={(value) => onFiltersChange({ ...filters, countries: value })}
            placeholder="Select countries"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedCompanyFilters;
