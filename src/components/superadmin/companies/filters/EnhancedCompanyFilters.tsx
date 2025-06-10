
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Calendar as CalendarIcon, X, Filter, RotateCcw, ChevronDown, ChevronRight } from 'lucide-react';
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
  const [sectionsOpen, setSectionsOpen] = useState({
    basic: true,
    location: false,
    business: false,
    profile: false,
    hierarchy: false,
    social: false,
  });

  // Extract unique values from companies for filter options
  const getUniqueOptions = (field: string) => {
    const values = companies
      .map(company => company[field])
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
    return values.map(value => ({ value, label: value }));
  };

  const getBooleanOptions = (label: string) => [
    { value: 'true', label: `Has ${label}` },
    { value: 'false', label: `No ${label}` }
  ];

  // Basic Info Options
  const industryOptions = getUniqueOptions('industry1');
  const sizeOptions = getUniqueOptions('size');
  const companyTypeOptions = getUniqueOptions('companytype');
  const entityTypeOptions = getUniqueOptions('entitytype');
  const sectorOptions = getUniqueOptions('companysector');
  const statusOptions = getUniqueOptions('companystatus');

  // Location Options
  const locationOptions = getUniqueOptions('location');
  const countryOptions = getUniqueOptions('country');
  const globalRegionOptions = getUniqueOptions('globalregion');
  const regionOptions = getUniqueOptions('region');
  const hoLocationOptions = getUniqueOptions('holocation');

  // Business Metrics Options
  const employeeSegmentOptions = getUniqueOptions('segmentaspernumberofemployees');
  const turnoverSegmentOptions = getUniqueOptions('segmentasperturnover');
  const capitalSegmentOptions = getUniqueOptions('segmentasperpaidupcapital');
  const turnoverYearOptions = getUniqueOptions('turnoveryear');

  // Business Profile Options
  const specializationOptions = getUniqueOptions('areaofspecialize');
  const serviceLineOptions = getUniqueOptions('serviceline');
  const verticalsOptions = getUniqueOptions('verticles');

  // Hierarchy Options
  const groupNameOptions = getUniqueOptions('company_group_name');

  // Social Media Options
  const emailOptions = getBooleanOptions('Email');
  const phoneOptions = getBooleanOptions('Phone');
  const linkedinOptions = getBooleanOptions('LinkedIn');
  const twitterOptions = getBooleanOptions('Twitter');
  const facebookOptions = getBooleanOptions('Facebook');
  const websiteOptions = getBooleanOptions('Website');

  const updateFilters = (field: keyof CompanyFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  const toggleSection = (section: string) => {
    setSectionsOpen(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.industries?.length) count++;
    if (filters.sizes?.length) count++;
    if (filters.locations?.length) count++;
    if (filters.countries?.length) count++;
    if (filters.companyTypes?.length) count++;
    if (filters.entityTypes?.length) count++;
    if (filters.sectors?.length) count++;
    if (filters.statuses?.length) count++;
    if (filters.foundedFrom || filters.foundedTo) count++;
    if (filters.registrationFrom || filters.registrationTo) count++;
    if (filters.establishmentFrom || filters.establishmentTo) count++;
    if (filters.employeeCountMin || filters.employeeCountMax) count++;
    if (filters.turnoverMin || filters.turnoverMax) count++;
    if (filters.paidCapitalMin || filters.paidCapitalMax) count++;
    if (filters.hasEmail?.length) count++;
    if (filters.hasPhone?.length) count++;
    if (filters.hasLinkedin?.length) count++;
    if (filters.hasTwitter?.length) count++;
    if (filters.hasFacebook?.length) count++;
    if (filters.hasWebsite?.length) count++;
    return count;
  };

  const NumberRangeInput = ({ 
    label, 
    minValue, 
    maxValue, 
    onMinChange, 
    onMaxChange,
    placeholder = "Enter value"
  }: {
    label: string;
    minValue?: string;
    maxValue?: string;
    onMinChange: (value: string) => void;
    onMaxChange: (value: string) => void;
    placeholder?: string;
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex gap-2">
        <Input
          placeholder={`Min ${placeholder}`}
          value={minValue || ''}
          onChange={(e) => onMinChange(e.target.value)}
          type="number"
        />
        <Input
          placeholder={`Max ${placeholder}`}
          value={maxValue || ''}
          onChange={(e) => onMaxChange(e.target.value)}
          type="number"
        />
      </div>
    </div>
  );

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

  const FilterSection = ({ 
    title, 
    isOpen, 
    onToggle, 
    children 
  }: { 
    title: string; 
    isOpen: boolean; 
    onToggle: () => void; 
    children: React.ReactNode 
  }) => (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-0 h-auto">
          <h3 className="text-lg font-semibold">{title}</h3>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 mt-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Enhanced Advanced Filters
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
      
      <CardContent className="space-y-6">
        {/* Global Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Global Search</Label>
          <Input
            id="search"
            placeholder="Search across all company fields..."
            value={filters.search}
            onChange={(e) => updateFilters('search', e.target.value)}
          />
        </div>

        {/* Basic Information Section */}
        <FilterSection 
          title="Basic Information" 
          isOpen={sectionsOpen.basic} 
          onToggle={() => toggleSection('basic')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              label="Company Types"
              options={companyTypeOptions}
              value={filters.companyTypes || []}
              onChange={(value) => updateFilters('companyTypes', value)}
              placeholder="Select types"
            />
            <MultiSelectFilter
              label="Entity Types"
              options={entityTypeOptions}
              value={filters.entityTypes || []}
              onChange={(value) => updateFilters('entityTypes', value)}
              placeholder="Select entity types"
            />
            <MultiSelectFilter
              label="Sectors"
              options={sectorOptions}
              value={filters.sectors || []}
              onChange={(value) => updateFilters('sectors', value)}
              placeholder="Select sectors"
            />
            <MultiSelectFilter
              label="Company Status"
              options={statusOptions}
              value={filters.statuses || []}
              onChange={(value) => updateFilters('statuses', value)}
              placeholder="Select status"
            />
          </div>
        </FilterSection>

        {/* Location Section */}
        <FilterSection 
          title="Location & Geography" 
          isOpen={sectionsOpen.location} 
          onToggle={() => toggleSection('location')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MultiSelectFilter
              label="Locations"
              options={locationOptions}
              value={filters.locations || []}
              onChange={(value) => updateFilters('locations', value)}
              placeholder="Select locations"
            />
            <MultiSelectFilter
              label="Countries"
              options={countryOptions}
              value={filters.countries || []}
              onChange={(value) => updateFilters('countries', value)}
              placeholder="Select countries"
            />
            <MultiSelectFilter
              label="Global Regions"
              options={globalRegionOptions}
              value={filters.globalRegions || []}
              onChange={(value) => updateFilters('globalRegions', value)}
              placeholder="Select global regions"
            />
            <MultiSelectFilter
              label="Regions/States"
              options={regionOptions}
              value={filters.regions || []}
              onChange={(value) => updateFilters('regions', value)}
              placeholder="Select regions"
            />
            <MultiSelectFilter
              label="HO Locations"
              options={hoLocationOptions}
              value={filters.hoLocations || []}
              onChange={(value) => updateFilters('hoLocations', value)}
              placeholder="Select HO locations"
            />
          </div>
        </FilterSection>

        {/* Business Metrics Section */}
        <FilterSection 
          title="Business Metrics" 
          isOpen={sectionsOpen.business} 
          onToggle={() => toggleSection('business')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <NumberRangeInput
              label="Employee Count Range"
              minValue={filters.employeeCountMin}
              maxValue={filters.employeeCountMax}
              onMinChange={(value) => updateFilters('employeeCountMin', value)}
              onMaxChange={(value) => updateFilters('employeeCountMax', value)}
              placeholder="employees"
            />
            <NumberRangeInput
              label="Turnover Range"
              minValue={filters.turnoverMin}
              maxValue={filters.turnoverMax}
              onMinChange={(value) => updateFilters('turnoverMin', value)}
              onMaxChange={(value) => updateFilters('turnoverMax', value)}
              placeholder="amount"
            />
            <NumberRangeInput
              label="Paid Capital Range"
              minValue={filters.paidCapitalMin}
              maxValue={filters.paidCapitalMax}
              onMinChange={(value) => updateFilters('paidCapitalMin', value)}
              onMaxChange={(value) => updateFilters('paidCapitalMax', value)}
              placeholder="capital"
            />
            <MultiSelectFilter
              label="Employee Segments"
              options={employeeSegmentOptions}
              value={filters.employeeSegments || []}
              onChange={(value) => updateFilters('employeeSegments', value)}
              placeholder="Select employee segments"
            />
            <MultiSelectFilter
              label="Turnover Segments"
              options={turnoverSegmentOptions}
              value={filters.turnoverSegments || []}
              onChange={(value) => updateFilters('turnoverSegments', value)}
              placeholder="Select turnover segments"
            />
            <MultiSelectFilter
              label="Capital Segments"
              options={capitalSegmentOptions}
              value={filters.capitalSegments || []}
              onChange={(value) => updateFilters('capitalSegments', value)}
              placeholder="Select capital segments"
            />
            <MultiSelectFilter
              label="Turnover Years"
              options={turnoverYearOptions}
              value={filters.turnoverYears || []}
              onChange={(value) => updateFilters('turnoverYears', value)}
              placeholder="Select turnover years"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <DateRangePicker
              fromDate={filters.foundedFrom}
              toDate={filters.foundedTo}
              onFromChange={(date) => updateFilters('foundedFrom', date)}
              onToChange={(date) => updateFilters('foundedTo', date)}
              label="Founded Date Range"
            />
            <DateRangePicker
              fromDate={filters.establishmentFrom}
              toDate={filters.establishmentTo}
              onFromChange={(date) => updateFilters('establishmentFrom', date)}
              onToChange={(date) => updateFilters('establishmentTo', date)}
              label="Establishment Date Range"
            />
          </div>
        </FilterSection>

        {/* Business Profile Section */}
        <FilterSection 
          title="Business Profile" 
          isOpen={sectionsOpen.profile} 
          onToggle={() => toggleSection('profile')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MultiSelectFilter
              label="Specializations"
              options={specializationOptions}
              value={filters.specializations || []}
              onChange={(value) => updateFilters('specializations', value)}
              placeholder="Select specializations"
            />
            <MultiSelectFilter
              label="Service Lines"
              options={serviceLineOptions}
              value={filters.serviceLines || []}
              onChange={(value) => updateFilters('serviceLines', value)}
              placeholder="Select service lines"
            />
            <MultiSelectFilter
              label="Verticals"
              options={verticalsOptions}
              value={filters.verticals || []}
              onChange={(value) => updateFilters('verticals', value)}
              placeholder="Select verticals"
            />
          </div>
        </FilterSection>

        {/* Hierarchy Section */}
        <FilterSection 
          title="Company Hierarchy" 
          isOpen={sectionsOpen.hierarchy} 
          onToggle={() => toggleSection('hierarchy')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MultiSelectFilter
              label="Company Groups"
              options={groupNameOptions}
              value={filters.companyGroups || []}
              onChange={(value) => updateFilters('companyGroups', value)}
              placeholder="Select company groups"
            />
            <NumberRangeInput
              label="Hierarchy Level"
              minValue={filters.hierarchyLevelMin}
              maxValue={filters.hierarchyLevelMax}
              onMinChange={(value) => updateFilters('hierarchyLevelMin', value)}
              onMaxChange={(value) => updateFilters('hierarchyLevelMax', value)}
              placeholder="level"
            />
            <MultiSelectFilter
              label="Has Parent Company"
              options={getBooleanOptions('Parent Company')}
              value={filters.hasParent || []}
              onChange={(value) => updateFilters('hasParent', value)}
              placeholder="Select parent status"
            />
          </div>
        </FilterSection>

        {/* Social Media & Contact Section */}
        <FilterSection 
          title="Contact & Social Media" 
          isOpen={sectionsOpen.social} 
          onToggle={() => toggleSection('social')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MultiSelectFilter
              label="Email Availability"
              options={emailOptions}
              value={filters.hasEmail || []}
              onChange={(value) => updateFilters('hasEmail', value)}
              placeholder="Select email status"
            />
            <MultiSelectFilter
              label="Phone Availability"
              options={phoneOptions}
              value={filters.hasPhone || []}
              onChange={(value) => updateFilters('hasPhone', value)}
              placeholder="Select phone status"
            />
            <MultiSelectFilter
              label="Website Availability"
              options={websiteOptions}
              value={filters.hasWebsite || []}
              onChange={(value) => updateFilters('hasWebsite', value)}
              placeholder="Select website status"
            />
            <MultiSelectFilter
              label="LinkedIn Presence"
              options={linkedinOptions}
              value={filters.hasLinkedin || []}
              onChange={(value) => updateFilters('hasLinkedin', value)}
              placeholder="Select LinkedIn status"
            />
            <MultiSelectFilter
              label="Twitter Presence"
              options={twitterOptions}
              value={filters.hasTwitter || []}
              onChange={(value) => updateFilters('hasTwitter', value)}
              placeholder="Select Twitter status"
            />
            <MultiSelectFilter
              label="Facebook Presence"
              options={facebookOptions}
              value={filters.hasFacebook || []}
              onChange={(value) => updateFilters('hasFacebook', value)}
              placeholder="Select Facebook status"
            />
          </div>
        </FilterSection>

        {/* Date Filters Section */}
        <FilterSection 
          title="Registration & Legal Dates" 
          isOpen={false} 
          onToggle={() => toggleSection('dates')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DateRangePicker
              fromDate={filters.registrationFrom}
              toDate={filters.registrationTo}
              onFromChange={(date) => updateFilters('registrationFrom', date)}
              onToChange={(date) => updateFilters('registrationTo', date)}
              label="Registration Date Range"
            />
          </div>
        </FilterSection>

        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <div className="space-y-2 pt-4 border-t">
            <Label className="text-sm font-medium">Active Filters ({getActiveFiltersCount()}):</Label>
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
              {/* Add more active filter badges as needed */}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedCompanyFilters;
