import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompanies } from '@/hooks/useCompanies';
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

const CompanyMetricsDashboard: React.FC = () => {
  const { companies = [], isLoading } = useCompanies();
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
  const { data: relationshipStats = { company_count: 0, people_count: 0, relationship_count: 0 }, 
          isLoading: isStatsLoading } = useQuery({
    queryKey: ['company_people_stats'],
    queryFn: async () => {
      // Count companies with relationships - using select count instead of distinct
      const { data: companyRelationships, error: companyError } = await supabase
        .from('company_relationships')
        .select('company_id', { count: 'exact', head: false });

      // Count people with relationships - using select count instead of distinct
      const { data: peopleRelationships, error: peopleError } = await supabase
        .from('company_relationships')
        .select('person_id', { count: 'exact', head: false });

      // Count unique companies with relationships
      const uniqueCompanies = companyRelationships ? 
        Array.from(new Set(companyRelationships.map(rel => rel.company_id))).length : 0;

      // Count unique people with relationships
      const uniquePeople = peopleRelationships ? 
        Array.from(new Set(peopleRelationships.map(rel => rel.person_id))).length : 0;

      // Count total relationships
      const { count: relationshipCount, error: countError } = await supabase
        .from('company_relationships')
        .select('*', { count: 'exact', head: true });

      if (companyError || peopleError || countError) {
        console.error("Error fetching relationship stats:", { companyError, peopleError, countError });
        return { company_count: 0, people_count: 0, relationship_count: 0 };
      }

      return {
        company_count: uniqueCompanies,
        people_count: uniquePeople,
        relationship_count: relationshipCount || 0
      };
    }
  });

  // Filter companies based on active filters
  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      // Search filter
      if (filters.searchTerm && !company.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }

      // Industry filter
      if (filters.industry && company.industry !== filters.industry) {
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
  }, [companies, filters]);

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    return {
      industries: Array.from(new Set(companies.map(c => c.industry).filter(Boolean))).sort(),
      locations: Array.from(new Set(companies.map(c => c.location).filter(Boolean))).sort(),
      sizes: Array.from(new Set(companies.map(c => c.size).filter(Boolean))).sort(),
    };
  }, [companies]);

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
            Comprehensive company metrics and insights {totalCompanies !== companies.length && `(${totalCompanies} filtered)`}
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
              {totalCompanies !== companies.length && `of ${companies.length} total`}
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
            <p className="text-xs text-muted-foreground">{Math.round((withWebsite / totalCompanies) * 100) || 0}% have website info</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Description</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{withDescription}</div>
            <p className="text-xs text-muted-foreground">{Math.round((withDescription / totalCompanies) * 100) || 0}% have description</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected People</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{relationshipStats.people_count}</div>
            <p className="text-xs text-muted-foreground">{relationshipStats.relationship_count} total relationships</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Analytics Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <CompanyGrowthChart />
        <GeographicDistributionChart />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <IndustrySectorChart />
        <HierarchyAnalysisChart />
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <DataCompletenessChart />
      </div>

      {/* Legacy Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <CompanyIndustryChart />
        <CompanyLocationChart />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <CompanyPeopleChart />
        <CompanySizeChart />
      </div>

      {/* Export Dialog */}
      <AnalyticsExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
      />
    </div>
  );
};

export default CompanyMetricsDashboard;
