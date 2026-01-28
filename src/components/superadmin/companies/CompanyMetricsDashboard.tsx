import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CompanyScope, useCompanies } from '@/hooks/useCompanies';
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
}

const CompanyMetricsDashboard: React.FC<CompanyMetricsDashboardProps> = ({
  scopeFilter = 'all',
}) => {
  const { companies = [], isLoading } = useCompanies({ ownerScope: scopeFilter });
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
  const scopeCompanies = useMemo(() => {
    if (scopeFilter === 'all') return companies;
    return companies.filter(company => company.owner_type === scopeFilter);
  }, [companies, scopeFilter]);

  const { data: relationshipStats = { company_count: 0, people_count: 0, relationship_count: 0 } } = useQuery({
    queryKey: ['company_people_stats', scopeFilter, scopeCompanies.map(c => c.id)],
    queryFn: async () => {
      const companyIds = scopeCompanies.map(company => company.id);
      if (companyIds.length === 0) {
        return { company_count: 0, people_count: 0, relationship_count: 0 };
      }

      const uniqueCompanies = new Set<string>();
      const uniquePeople = new Set<string>();
      let relationshipCount = 0;

      const chunkSize = 1000;
      for (let i = 0; i < companyIds.length; i += chunkSize) {
        const chunk = companyIds.slice(i, i + chunkSize);
        const { data, error, count } = await supabase
          .from('company_relationships')
          .select('company_id, person_id', { count: 'exact', head: false })
          .in('company_id', chunk);

        if (error) {
          console.error("Error fetching relationship stats:", error);
          continue;
        }

        (data || []).forEach((row) => {
          if (row.company_id) uniqueCompanies.add(row.company_id);
          if (row.person_id) uniquePeople.add(row.person_id);
        });

        relationshipCount += count || 0;
      }

      return {
        company_count: uniqueCompanies.size,
        people_count: uniquePeople.size,
        relationship_count: relationshipCount
      };
    }
  });

  // Filter companies based on active filters
  const filteredCompanies = useMemo(() => {
    return scopeCompanies.filter(company => {
      // Search filter
      if (filters.searchTerm && !company.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }

      // Industry filter - check all industry fields
      if (filters.industry && 
          company.industry1 !== filters.industry && 
          company.industry2 !== filters.industry && 
          company.industry3 !== filters.industry) {
        return false;
      }

      // Location filter
      if (filters.location && company.location !== filters.location) {
        return false;
      }

      // Size filter
      if (filters.size && company.size !== filters.size) {
        return false;
      }

      // Hierarchy level filter
      if (filters.hierarchyLevel && company.hierarchy_level?.toString() !== filters.hierarchyLevel) {
        return false;
      }

      // Date range filter
      if (filters.dateRange.from || filters.dateRange.to) {
        const companyDate = new Date(company.created_at);
        if (filters.dateRange.from && companyDate < filters.dateRange.from) {
          return false;
        }
        if (filters.dateRange.to && companyDate > filters.dateRange.to) {
          return false;
        }
      }

      return true;
    });
  }, [scopeCompanies, filters]);

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const allIndustries = new Set<string>();
    scopeCompanies.forEach(c => {
      if (c.industry1) allIndustries.add(c.industry1);
      if (c.industry2) allIndustries.add(c.industry2);
      if (c.industry3) allIndustries.add(c.industry3);
    });

    return {
      industries: Array.from(allIndustries).sort(),
      locations: Array.from(new Set(scopeCompanies.map(c => c.location).filter(Boolean))).sort(),
      sizes: Array.from(new Set(scopeCompanies.map(c => c.size).filter(Boolean))).sort(),
    };
  }, [scopeCompanies]);

  const totalCompanies = filteredCompanies?.length || 0;
  const withWebsite = filteredCompanies?.filter(c => c.domain || c.website).length || 0;
  const withDescription = filteredCompanies?.filter(c => c.description).length || 0;

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive company metrics and insights {totalCompanies !== scopeCompanies.length && `(${totalCompanies} filtered)`}
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
              {totalCompanies !== scopeCompanies.length && `of ${scopeCompanies.length} total`}
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
        <CompanyIndustryChart companies={filteredCompanies} isLoading={isLoading} />
        <CompanySizeChart companies={filteredCompanies} isLoading={isLoading} />
        <CompanyLocationChart companies={filteredCompanies} isLoading={isLoading} />
        <CompanyPeopleChart companies={filteredCompanies} isLoading={isLoading} />
      </div>

      {/* Enhanced Analytics Section - Remove companies prop from these components */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Advanced Analytics</h3>
        
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <CompanyGrowthChart companies={filteredCompanies} isLoading={isLoading} />
          <GeographicDistributionChart companies={filteredCompanies} isLoading={isLoading} />
          <IndustrySectorChart companies={filteredCompanies} isLoading={isLoading} />
          <DataCompletenessChart companies={filteredCompanies} isLoading={isLoading} />
        </div>

        <HierarchyAnalysisChart companies={filteredCompanies} isLoading={isLoading} />
      </div>

      {/* Export Dialog */}
      <AnalyticsExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        companies={filteredCompanies}
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
