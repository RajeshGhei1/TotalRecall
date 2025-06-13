
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Building, Calendar, MapPin, Globe, Hash, Filter } from 'lucide-react';
import { useCompanies } from '@/hooks/useCompanies';
import TrIdSearchDialog from './TrIdSearchDialog';
import EnhancedCompanyFilters from './filters/EnhancedCompanyFilters';
import { useCompanyFilters } from './hooks/useCompanyFilters';

const CompanyEnhancedListContainer: React.FC = () => {
  const { companies, isLoading } = useCompanies();
  const [isTrIdSearchOpen, setIsTrIdSearchOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const {
    filters,
    setFilters,
    filteredCompanies,
    resetFilters,
  } = useCompanyFilters(companies || []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies by name, TR ID, CIN, email, or location..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsTrIdSearchOpen(true)}
              className="whitespace-nowrap"
            >
              <Hash className="h-4 w-4 mr-2" />
              Search by TR ID
            </Button>
            <Button
              variant={showAdvancedFilters ? "default" : "outline"}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="whitespace-nowrap"
            >
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </div>
        
        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredCompanies.length} of {companies?.length || 0} companies
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <EnhancedCompanyFilters
          filters={filters}
          onFiltersChange={setFilters}
          onReset={resetFilters}
          companies={companies || []}
        />
      )}

      {/* Companies List */}
      <div className="space-y-4">
        {filteredCompanies.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No companies found</h3>
              <p className="text-muted-foreground">
                {filters.search || Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f) 
                  ? 'Try adjusting your search criteria or filters' 
                  : 'No companies have been added yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredCompanies.map((company) => (
            <Card key={company.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{company.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-mono text-xs">
                        {company.tr_id || 'No TR ID'}
                      </Badge>
                      {company.cin && (
                        <Badge variant="outline" className="text-xs">
                          CIN: {company.cin}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {company.industry1 && (
                      <Badge variant="default">{company.industry1}</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  {company.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{company.location}</span>
                    </div>
                  )}
                  {company.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate"
                      >
                        {company.website}
                      </a>
                    </div>
                  )}
                  {company.founded && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Founded {company.founded}</span>
                    </div>
                  )}
                  {company.size && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{company.size}</span>
                    </div>
                  )}
                  {company.email && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Email:</span>
                      <a
                        href={`mailto:${company.email}`}
                        className="text-blue-600 hover:underline truncate"
                      >
                        {company.email}
                      </a>
                    </div>
                  )}
                  {company.phone && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Phone:</span>
                      <span>{company.phone}</span>
                    </div>
                  )}
                </div>
                
                {company.description && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {company.description}
                    </p>
                  </div>
                )}
                
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Created: {new Date(company.created_at).toLocaleDateString()}</span>
                  <span>Updated: {new Date(company.updated_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* TR ID Search Dialog */}
      <TrIdSearchDialog
        isOpen={isTrIdSearchOpen}
        onClose={() => setIsTrIdSearchOpen(false)}
      />
    </div>
  );
};

export default CompanyEnhancedListContainer;
