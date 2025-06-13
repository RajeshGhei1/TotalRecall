
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, TrendingUp, Globe, Hash } from 'lucide-react';
import { useCompanies } from '@/hooks/useCompanies';

const CompanyMetricsDashboard: React.FC = () => {
  const { companies, isLoading } = useCompanies();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalCompanies = companies?.length || 0;
  const companiesWithTrId = companies?.filter(c => c.tr_id)?.length || 0;
  const companiesWithWebsite = companies?.filter(c => c.website)?.length || 0;
  const companiesWithCin = companies?.filter(c => c.cin)?.length || 0;

  // Industry distribution
  const industryDistribution = companies?.reduce((acc, company) => {
    if (company.industry1) {
      acc[company.industry1] = (acc[company.industry1] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>) || {};

  const topIndustries = Object.entries(industryDistribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompanies}</div>
            <p className="text-xs text-muted-foreground">
              Companies in database
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TR ID Coverage</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companiesWithTrId}</div>
            <p className="text-xs text-muted-foreground">
              {totalCompanies > 0 ? `${Math.round((companiesWithTrId / totalCompanies) * 100)}%` : '0%'} with TR ID
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Website</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companiesWithWebsite}</div>
            <p className="text-xs text-muted-foreground">
              {totalCompanies > 0 ? `${Math.round((companiesWithWebsite / totalCompanies) * 100)}%` : '0%'} have websites
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With CIN</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companiesWithCin}</div>
            <p className="text-xs text-muted-foreground">
              {totalCompanies > 0 ? `${Math.round((companiesWithCin / totalCompanies) * 100)}%` : '0%'} have CIN
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Industries */}
      <Card>
        <CardHeader>
          <CardTitle>Top Industries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topIndustries.length > 0 ? (
              topIndustries.map(([industry, count]) => (
                <div key={industry} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{industry}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{count}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {Math.round((count / totalCompanies) * 100)}%
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No industry data available</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {companies?.slice(0, 5).map((company) => (
              <div key={company.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{company.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {company.tr_id && (
                      <Badge variant="outline" className="text-xs font-mono">
                        {company.tr_id}
                      </Badge>
                    )}
                    {company.industry1 && (
                      <Badge variant="secondary" className="text-xs">
                        {company.industry1}
                      </Badge>
                    )}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(company.created_at).toLocaleDateString()}
                </span>
              </div>
            )) || (
              <p className="text-sm text-muted-foreground">No companies found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyMetricsDashboard;
