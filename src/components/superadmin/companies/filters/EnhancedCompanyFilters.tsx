
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

  // Generate options from actual company data - use original companies array for option generation
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

  // Industry options - use original companies array for all option generation
  const industryOptions = React.useMemo(() => {
    const industries = new Set<string>();
    companies.forEach(company => {
      if (company.industry1) industries.add(company.industry1);
      if (company.industry2) industries.add(company.industry2);
      if (company.industry3) industries.add(company.industry3);
    });
    return Array.from(industries).sort().map(value => ({ label: value, value }));
  }, [companies]);

  // Industry 1 (Primary) options - always use full companies array
  const industry1Options = React.useMemo(() => {
    return generateOptionsFromCompanies('industry1');
  }, [companies]);

  // Industry 2 (Secondary) options - filter based on Industry 1 selection but from original data
  const industry2Options = React.useMemo(() => {
    if (!filters.industry1?.length) {
      return generateOptionsFromCompanies('industry2');
    }
    
    const availableIndustry2 = new Set<string>();
    companies.forEach(company => {
      if (company.industry1 && filters.industry1.includes(company.industry1) && company.industry2) {
        availableIndustry2.add(company.industry2);
      }
    });
    
    return Array.from(availableIndustry2).sort().map(value => ({ label: value, value }));
  }, [companies, filters.industry1]);

  // Industry 3 (Specific) options - filter based on Industry 2 selection but from original data
  const industry3Options = React.useMemo(() => {
    if (!filters.industry2?.length) {
      return generateOptionsFromCompanies('industry3');
    }
    
    const availableIndustry3 = new Set<string>();
    companies.forEach(company => {
      if (company.industry2 && filters.industry2.includes(company.industry2) && company.industry3) {
        availableIndustry3.add(company.industry3);
      }
    });
    
    return Array.from(availableIndustry3).sort().map(value => ({ label: value, value }));
  }, [companies, filters.industry2]);

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

  // Clear dependent filters when parent filter changes
  const updateIndustry1Filter = (value: string[]) => {
    onFiltersChange({
      ...filters,
      industry1: value,
      industry2: [], // Clear dependent filters
      industry3: []
    });
  };

  const updateIndustry2Filter = (value: string[]) => {
    onFiltersChange({
      ...filters,
      industry2: value,
      industry3: [] // Clear dependent filter
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
                label="Company Status"
                options={generateOptionsFromCompanies('companystatus')}
                value={filters.statuses}
                onChange={(value) => updateFilter('statuses', value)}
                placeholder="Select status"
              />
            </div>
          </FilterSection>

          {/* Group Structure */}
          <FilterSection title="Group Structure" sectionKey="groupStructure">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <MultiSelectFilter
                label="Company Groups"
                options={generateOptionsFromCompanies('company_group_name')}
                value={filters.companyGroups}
                onChange={(value) => updateFilter('companyGroups', value)}
                placeholder="Select groups"
              />
              <MultiSelectFilter
                label="Has Parent Company"
                options={generateBooleanOptions()}
                value={filters.hasParent}
                onChange={(value) => updateFilter('hasParent', value)}
                placeholder="Select option"
              />
            </div>
          </FilterSection>

          {/* Location Information */}
          <FilterSection title="Location Information" sectionKey="locationInformation">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MultiSelectFilter
                label="HO Locations"
                options={generateOptionsFromCompanies('holocation')}
                value={filters.hoLocations}
                onChange={(value) => updateFilter('hoLocations', value)}
                placeholder="Select HO locations"
              />
            </div>
          </FilterSection>

          {/* Industry & Company Type */}
          <FilterSection title="Industry & Company Type" sectionKey="industryCompanyType">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MultiSelectFilter
                  label="Industry 1 (Primary)"
                  options={industry1Options}
                  value={filters.industry1 || []}
                  onChange={updateIndustry1Filter}
                  placeholder="Select primary industry"
                />
                <MultiSelectFilter
                  label="Industry 2 (Secondary)"
                  options={industry2Options}
                  value={filters.industry2 || []}
                  onChange={updateIndustry2Filter}
                  placeholder={filters.industry1?.length ? "Select secondary industry" : "Please select Industry 1 first"}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MultiSelectFilter
                  label="Industry 3 (Specific)"
                  options={industry3Options}
                  value={filters.industry3 || []}
                  onChange={(value) => updateFilter('industry3', value)}
                  placeholder={filters.industry2?.length ? "Select specific industry" : "Please select Industry 2 first"}
                />
                <MultiSelectFilter
                  label="Company Sector"
                  options={generateOptionsFromCompanies('companysector')}
                  value={filters.sectors}
                  onChange={(value) => updateFilter('sectors', value)}
                  placeholder="Select company sector"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MultiSelectFilter
                  label="Company Type"
                  options={generateOptionsFromCompanies('companytype')}
                  value={filters.companyTypes}
                  onChange={(value) => updateFilter('companyTypes', value)}
                  placeholder="Select company type"
                />
                <MultiSelectFilter
                  label="Entity Type"
                  options={generateOptionsFromCompanies('entitytype')}
                  value={filters.entityTypes}
                  onChange={(value) => updateFilter('entityTypes', value)}
                  placeholder="Select entity type"
                />
              </div>
            </div>
          </FilterSection>

          {/* Company Metrics */}
          <FilterSection title="Company Metrics" sectionKey="companyMetrics">
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

          {/* Contact Details */}
          <FilterSection title="Contact Details" sectionKey="contactDetails">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          </FilterSection>

          {/* Online Presence */}
          <FilterSection title="Online Presence" sectionKey="onlinePresence">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <MultiSelectFilter
                label="Has Twitter"
                options={generateBooleanOptions()}
                value={filters.hasTwitter}
                onChange={(value) => updateFilter('hasTwitter', value)}
                placeholder="Select option"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MultiSelectFilter
                label="Has Facebook"
                options={generateBooleanOptions()}
                value={filters.hasFacebook}
                onChange={(value) => updateFilter('hasFacebook', value)}
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
