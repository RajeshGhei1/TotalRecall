import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Company, CompanyScope } from '@/hooks/useCompanies';
import { useCurrentTenant } from '@/hooks/useCurrentTenant';
import { useTenantContext } from '@/contexts/TenantContext';
import { useGlobalSettings } from '@/hooks/global-settings/useGlobalSettings';
import { Building, Users, Download, Settings } from 'lucide-react';

// Import new analytics components
import CompanyGrowthChart from './analytics/CompanyGrowthChart';
import GeographicDistributionChart from './analytics/GeographicDistributionChart';
import IndustrySectorChart from './analytics/IndustrySectorChart';
import DataCompletenessChart from './analytics/DataCompletenessChart';
import HierarchyAnalysisChart from './analytics/HierarchyAnalysisChart';
import AnalyticsExportDialog from './analytics/AnalyticsExportDialog';
import DashboardFilters from './analytics/DashboardFilters';

// Keep existing chart imports
import CompanyIndustryChart from './charts/CompanyIndustryChart';
import CompanySizeChart from './charts/CompanySizeChart';
import CompanyLocationChart from './charts/CompanyLocationChart';
import CompanyPeopleChart from './charts/CompanyPeopleChart';

// Interface for company-person relationship summary
interface CompanyPeopleStats {
  company_count: number;
  people_count: number;
  relationship_count: number;
}

// Interface for filter state
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

interface CompanyMetricsDashboardProps {
  scopeFilter?: CompanyScope;
  companiesForExport?: Company[];
}

interface DistributionItem {
  name: string;
  count: number;
}

interface PeopleStats {
  companyCount: number;
  peopleCount: number;
  relationshipCount: number;
  topCompanies: Array<{ id: string; name: string; count: number }>;
}

const CompanyMetricsDashboard: React.FC<CompanyMetricsDashboardProps> = ({
  scopeFilter = 'all',
  companiesForExport = [],
}) => {
  const { data: currentTenant } = useCurrentTenant();
  const { selectedTenantId } = useTenantContext();
  const effectiveTenantId = selectedTenantId ?? currentTenant?.tenant_id ?? null;
  const { data: performanceSettings } = useGlobalSettings('performance');
  const cacheTtlSeconds = Number(
    performanceSettings?.find((setting) => setting.setting_key === 'cache_ttl_default')?.setting_value
  ) || 300;
  const cacheTtlMs = cacheTtlSeconds * 1000;
  const [showFilters, setShowFilters] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    dateRange: { from: null, to: null },
    industry: '',
    location: '',
    size: '',
    hierarchyLevel: '',
    searchTerm: ''
  });

  // Get company-people relationship statistics
  const filterPayload = useMemo(() => ({
    searchTerm: filters.searchTerm || '',
    industry: filters.industry || '',
    location: filters.location || '',
    size: filters.size || '',
    hierarchyLevel: filters.hierarchyLevel || '',
    dateRange: {
      from: filters.dateRange.from ? filters.dateRange.from.toISOString() : '',
      to: filters.dateRange.to ? filters.dateRange.to.toISOString() : '',
    }
  }), [filters]);

  const { data: summaryData, isLoading: isSummaryLoading } = useQuery({
    queryKey: ['companies-summary', scopeFilter, effectiveTenantId, filterPayload],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_companies_summary', {
        p_scope: scopeFilter,
        p_tenant_id: effectiveTenantId,
        p_filters: filterPayload
      });
      if (error) throw error;
      return data as { total: number; withWebsite: number; withDescription: number };
    },
    staleTime: cacheTtlMs
  });

  const { data: industryDistribution = [], isLoading: isIndustryLoading } = useQuery({
    queryKey: ['companies-distribution', 'industry1', scopeFilter, effectiveTenantId, filterPayload],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_companies_distribution', {
        p_scope: scopeFilter,
        p_tenant_id: effectiveTenantId,
        p_dimension: 'industry1',
        p_filters: filterPayload,
        p_top: 50
      });
      if (error) throw error;
      return (data || []) as DistributionItem[];
    },
    staleTime: cacheTtlMs
  });

  const { data: locationDistribution = [], isLoading: isLocationLoading } = useQuery({
    queryKey: ['companies-distribution', 'location', scopeFilter, effectiveTenantId, filterPayload],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_companies_distribution', {
        p_scope: scopeFilter,
        p_tenant_id: effectiveTenantId,
        p_dimension: 'location',
        p_filters: filterPayload,
        p_top: 50
      });
      if (error) throw error;
      return (data || []) as DistributionItem[];
    },
    staleTime: cacheTtlMs
  });

  const { data: sizeDistribution = [], isLoading: isSizeLoading } = useQuery({
    queryKey: ['companies-distribution', 'size', scopeFilter, effectiveTenantId, filterPayload],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_companies_distribution', {
        p_scope: scopeFilter,
        p_tenant_id: effectiveTenantId,
        p_dimension: 'size',
        p_filters: filterPayload,
        p_top: 50
      });
      if (error) throw error;
      return (data || []) as DistributionItem[];
    },
    staleTime: cacheTtlMs
  });

  const { data: peopleStats, isLoading: isPeopleLoading } = useQuery({
    queryKey: ['companies-people-stats', scopeFilter, effectiveTenantId, filterPayload],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_companies_people_stats', {
        p_scope: scopeFilter,
        p_tenant_id: effectiveTenantId,
        p_filters: filterPayload,
        p_top: 10
      });
      if (error) throw error;
      return data as PeopleStats;
    },
    staleTime: cacheTtlMs
  });

  // Filter companies based on active filters
  const filterOptions = useMemo(() => ({
    industries: industryDistribution.map(item => item.name).sort(),
    locations: locationDistribution.map(item => item.name).sort(),
    sizes: sizeDistribution.map(item => item.name).sort(),
  }), [industryDistribution, locationDistribution, sizeDistribution]);

  const totalCompanies = summaryData?.total || 0;
  const withWebsite = summaryData?.withWebsite || 0;
  const withDescription = summaryData?.withDescription || 0;
  const relationshipStats = {
    company_count: peopleStats?.companyCount || 0,
    people_count: peopleStats?.peopleCount || 0,
    relationship_count: peopleStats?.relationshipCount || 0
  };

  const isLoading = isSummaryLoading || isIndustryLoading || isLocationLoading || isSizeLoading || isPeopleLoading;

  const filtersActive = Boolean(
    filters.searchTerm ||
    filters.industry ||
    filters.location ||
    filters.size ||
    filters.hierarchyLevel ||
    filters.dateRange.from ||
    filters.dateRange.to
  );

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive company metrics and insights {filtersActive && `(${totalCompanies} filtered)`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
          >
            <Settings className="mr-2 h-4 w-4" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowExportDialog(true)}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <DashboardFilters
          filters={filters}
          onFiltersChange={setFilters}
          industries={filterOptions.industries}
          locations={filterOptions.locations}
          sizes={filterOptions.sizes}
        />
      )}

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompanies}</div>
            <p className="text-xs text-muted-foreground">
              {filtersActive ? 'Filtered view' : 'All scoped companies'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Website</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{withWebsite}</div>
            <p className="text-xs text-muted-foreground">
              {totalCompanies > 0 && `${Math.round((withWebsite / totalCompanies) * 100)}% coverage`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Description</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{withDescription}</div>
            <p className="text-xs text-muted-foreground">
              {totalCompanies > 0 && `${Math.round((withDescription / totalCompanies) * 100)}% coverage`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">People Relationships</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{relationshipStats.relationship_count}</div>
            <p className="text-xs text-muted-foreground">
              {relationshipStats.company_count} companies, {relationshipStats.people_count} people
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <CompanyIndustryChart data={industryDistribution.slice(0, 10)} isLoading={isLoading} />
        <CompanySizeChart data={sizeDistribution.slice(0, 10)} isLoading={isLoading} />
        <CompanyLocationChart data={locationDistribution.slice(0, 10)} isLoading={isLoading} />
        <CompanyPeopleChart data={peopleStats?.topCompanies || []} isLoading={isLoading} />
      </div>

      {/* Enhanced Analytics Section - Remove companies prop from these components */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Advanced Analytics</h3>
        
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <CompanyGrowthChart
            scopeFilter={scopeFilter}
            tenantId={effectiveTenantId}
            filters={filterPayload}
            cacheTtlMs={cacheTtlMs}
            isLoading={isLoading}
          />
          <GeographicDistributionChart
            scopeFilter={scopeFilter}
            tenantId={effectiveTenantId}
            filters={filterPayload}
            cacheTtlMs={cacheTtlMs}
            isLoading={isLoading}
          />
          <IndustrySectorChart
            scopeFilter={scopeFilter}
            tenantId={effectiveTenantId}
            filters={filterPayload}
            cacheTtlMs={cacheTtlMs}
            isLoading={isLoading}
          />
          <DataCompletenessChart
            scopeFilter={scopeFilter}
            tenantId={effectiveTenantId}
            filters={filterPayload}
            cacheTtlMs={cacheTtlMs}
            isLoading={isLoading}
          />
        </div>

        <HierarchyAnalysisChart
          scopeFilter={scopeFilter}
          tenantId={effectiveTenantId}
          filters={filterPayload}
          cacheTtlMs={cacheTtlMs}
          isLoading={isLoading}
        />
      </div>

      {/* Export Dialog */}
      <AnalyticsExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        companies={companiesForExport}
        currentFilters={[
          scopeFilter !== 'all' ? `scope: ${scopeFilter}` : null,
          ...Object.entries(filters)
            .filter(([_, value]) => value && value !== '')
            .map(([key, value]) => `${key}: ${value}`)
        ]
          .filter(Boolean)
          .join(', ')}
      />
    </div>
  );
};

export default CompanyMetricsDashboard;
