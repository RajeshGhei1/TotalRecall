
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Search, Filter, RotateCcw } from 'lucide-react';
import { CompanyFilters } from '../hooks/useCompanyFilters';
import MultiSelectFilter from '@/components/reporting/filters/MultiSelectFilter';
import { Company } from '@/hooks/useCompanies';
import { cn } from '@/lib/utils';

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
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  // Generate options from actual company data
  const generateOptionsFromCompanies = (field: keyof Company) => {
    const uniqueValues = new Set<string>();
    companies.forEach(company => {
      const value = company[field];
      if (value && typeof value === 'string' && value.trim() !== '') {
        uniqueValues.add(value.trim());
      }
    });
    
    return Array.from(uniqueValues)
      .sort()
      .map(value => ({
        label: value,
        value: value
      }));
  };

  // Generate boolean options
  const generateBooleanOptions = () => [
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' }
  ];

  // Industry options
  const industryOptions = React.useMemo(() => {
    const industries = new Set<string>();
    companies.forEach(company => {
      if (company.industry1) industries.add(company.industry1);
      if (company.industry2) industries.add(company.industry2);
      if (company.industry3) industries.add(company.industry3);
    });
    return Array.from(industries).sort().map(value => ({ label: value, value }));
  }, [companies]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateFilter = (key: keyof CompanyFilters, value: string[]) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const FilterSection: React.FC<{
    title: string;
    children: React.ReactNode;
    sectionKey: string;
  }> = ({ title, children, sectionKey }) => (
    <Collapsible
      open={openSections[sectionKey]}
      onOpenChange={() => toggleSection(sectionKey)}
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between p-2 h-auto font-medium"
        >
          {title}
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              openSections[sectionKey] && "transform rotate-180"
            )}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pt-2">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Advanced Filters</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset All
          </Button>
        </div>

        {/* Global Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search companies by name, email, or website..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-4">
          {/* Basic Information */}
          <FilterSection title="Basic Information" sectionKey="basic">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <MultiSelectFilter
                label="Industries"
                options={industryOptions}
                value={filters.industries}
                onChange={(value) => updateFilter('industries', value)}
                placeholder="Select industries"
              />
              <MultiSelectFilter
                label="Company Size"
                options={generateOptionsFromCompanies('size')}
                value={filters.sizes}
                onChange={(value) => updateFilter('sizes', value)}
                placeholder="Select sizes"
              />
              <MultiSelectFilter
                label="Company Type"
                options={generateOptionsFromCompanies('companytype')}
                value={filters.companyTypes}
                onChange={(value) => updateFilter('companyTypes', value)}
                placeholder="Select types"
              />
            </div>
          </FilterSection>

          {/* Geographic Information */}
          <FilterSection title="Geographic Information" sectionKey="geographic">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MultiSelectFilter
                label="Locations"
                options={generateOptionsFromCompanies('location')}
                value={filters.locations}
                onChange={(value) => updateFilter('locations', value)}
                placeholder="Select locations"
              />
              <MultiSelectFilter
                label="Countries"
                options={generateOptionsFromCompanies('country')}
                value={filters.countries}
                onChange={(value) => updateFilter('countries', value)}
                placeholder="Select countries"
              />
              <MultiSelectFilter
                label="Global Regions"
                options={generateOptionsFromCompanies('globalregion')}
                value={filters.globalRegions}
                onChange={(value) => updateFilter('globalRegions', value)}
                placeholder="Select global regions"
              />
              <MultiSelectFilter
                label="Regions"
                options={generateOptionsFromCompanies('region')}
                value={filters.regions}
                onChange={(value) => updateFilter('regions', value)}
                placeholder="Select regions"
              />
            </div>
          </FilterSection>

          {/* Business Structure */}
          <FilterSection title="Business Structure" sectionKey="business">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <MultiSelectFilter
                label="Entity Types"
                options={generateOptionsFromCompanies('entitytype')}
                value={filters.entityTypes}
                onChange={(value) => updateFilter('entityTypes', value)}
                placeholder="Select entity types"
              />
              <MultiSelectFilter
                label="Company Sectors"
                options={generateOptionsFromCompanies('companysector')}
                value={filters.sectors}
                onChange={(value) => updateFilter('sectors', value)}
                placeholder="Select sectors"
              />
              <MultiSelectFilter
                label="Company Groups"
                options={generateOptionsFromCompanies('company_group_name')}
                value={filters.companyGroups}
                onChange={(value) => updateFilter('companyGroups', value)}
                placeholder="Select groups"
              />
            </div>
          </FilterSection>

          {/* Financial Metrics */}
          <FilterSection title="Financial Metrics" sectionKey="financial">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <MultiSelectFilter
                label="Employee Segments"
                options={generateOptionsFromCompanies('segmentaspernumberofemployees')}
                value={filters.employeeSegments}
                onChange={(value) => updateFilter('employeeSegments', value)}
                placeholder="Select employee segments"
              />
              <MultiSelectFilter
                label="Turnover Segments"
                options={generateOptionsFromCompanies('segmentasperturnover')}
                value={filters.turnoverSegments}
                onChange={(value) => updateFilter('turnoverSegments', value)}
                placeholder="Select turnover segments"
              />
              <MultiSelectFilter
                label="Capital Segments"
                options={generateOptionsFromCompanies('segmentasperpaidupcapital')}
                value={filters.capitalSegments}
                onChange={(value) => updateFilter('capitalSegments', value)}
                placeholder="Select capital segments"
              />
            </div>
          </FilterSection>

          {/* Specialization */}
          <FilterSection title="Specialization" sectionKey="specialization">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <MultiSelectFilter
                label="Specializations"
                options={generateOptionsFromCompanies('areaofspecialize')}
                value={filters.specializations}
                onChange={(value) => updateFilter('specializations', value)}
                placeholder="Select specializations"
              />
              <MultiSelectFilter
                label="Service Lines"
                options={generateOptionsFromCompanies('serviceline')}
                value={filters.serviceLines}
                onChange={(value) => updateFilter('serviceLines', value)}
                placeholder="Select service lines"
              />
              <MultiSelectFilter
                label="Verticals"
                options={generateOptionsFromCompanies('verticles')}
                value={filters.verticals}
                onChange={(value) => updateFilter('verticals', value)}
                placeholder="Select verticals"
              />
            </div>
          </FilterSection>

          {/* Data Availability */}
          <FilterSection title="Data Availability" sectionKey="data">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MultiSelectFilter
                label="Has Email"
                options={generateBooleanOptions()}
                value={filters.hasEmail}
                onChange={(value) => updateFilter('hasEmail', value)}
                placeholder="Select option"
              />
              <MultiSelectFilter
                label="Has Phone"
                options={generateBooleanOptions()}
                value={filters.hasPhone}
                onChange={(value) => updateFilter('hasPhone', value)}
                placeholder="Select option"
              />
              <MultiSelectFilter
                label="Has Website"
                options={generateBooleanOptions()}
                value={filters.hasWebsite}
                onChange={(value) => updateFilter('hasWebsite', value)}
                placeholder="Select option"
              />
              <MultiSelectFilter
                label="Has LinkedIn"
                options={generateBooleanOptions()}
                value={filters.hasLinkedin}
                onChange={(value) => updateFilter('hasLinkedin', value)}
                placeholder="Select option"
              />
            </div>
          </FilterSection>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedCompanyFilters;
