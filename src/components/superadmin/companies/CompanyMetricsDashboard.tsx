
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompanies } from '@/hooks/useCompanies';
import CompanyIndustryChart from './charts/CompanyIndustryChart';
import CompanySizeChart from './charts/CompanySizeChart';
import CompanyLocationChart from './charts/CompanyLocationChart';
import { Building, Users } from 'lucide-react';

// Interface for company-person relationship summary
interface CompanyPeopleStats {
  company_count: number;
  people_count: number;
  relationship_count: number;
}

const CompanyMetricsDashboard: React.FC = () => {
  const { companies = [], isLoading } = useCompanies();

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

  const totalCompanies = companies?.length || 0;
  const withWebsite = companies?.filter(c => c.domain || c.website).length || 0;
  const withDescription = companies?.filter(c => c.description).length || 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompanies}</div>
            <p className="text-xs text-muted-foreground">Registered companies</p>
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

      <div className="grid gap-4 md:grid-cols-2">
        <CompanyIndustryChart />
        <CompanyLocationChart />
      </div>

      <div className="grid gap-4">
        <CompanySizeChart />
      </div>
    </div>
  );
};

export default CompanyMetricsDashboard;
