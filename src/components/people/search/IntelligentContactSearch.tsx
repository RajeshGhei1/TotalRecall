
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, X, Building, MapPin, Calendar, Briefcase } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SearchFilters {
  query: string;
  companies: string[];
  locations: string[];
  roles: string[];
  dateRange: 'all' | '30d' | '90d' | '1y';
}

interface IntelligentContactSearchProps {
  onResultsChange: (results: any[]) => void;
  onFiltersChange: (filters: SearchFilters) => void;
}

const IntelligentContactSearch: React.FC<IntelligentContactSearchProps> = ({
  onResultsChange,
  onFiltersChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    companies: [],
    locations: [],
    roles: [],
    dateRange: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  // Debounced search to avoid too many API calls
  const debouncedSearch = useDebouncedCallback((query: string) => {
    setFilters(prev => ({ ...prev, query }));
  }, 300);

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  // Get search suggestions
  const { data: suggestions } = useQuery({
    queryKey: ['contact-search-suggestions'],
    queryFn: async () => {
      const [companiesRes, locationsRes, rolesRes] = await Promise.all([
        supabase
          .from('companies')
          .select('name')
          .limit(20),
        supabase
          .from('people')
          .select('location')
          .eq('type', 'contact')
          .not('location', 'is', null)
          .limit(20),
        supabase
          .from('company_relationships')
          .select('role')
          .not('role', 'is', null)
          .limit(20)
      ]);

      return {
        companies: Array.from(new Set(companiesRes.data?.map(c => c.name) || [])),
        locations: Array.from(new Set(locationsRes.data?.map(p => p.location) || [])),
        roles: Array.from(new Set(rolesRes.data?.map(r => r.role) || []))
      };
    },
  });

  // Perform intelligent search
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['intelligent-contact-search', filters],
    queryFn: async () => {
      let query = supabase
        .from('people')
        .select(`
          *,
          company_relationships!left (
            role,
            companies (name, id)
          )
        `)
        .eq('type', 'contact');

      // Text search across multiple fields
      if (filters.query) {
        query = query.or(`full_name.ilike.%${filters.query}%,email.ilike.%${filters.query}%,location.ilike.%${filters.query}%`);
      }

      // Date range filter
      if (filters.dateRange !== 'all') {
        const days = filters.dateRange === '30d' ? 30 : filters.dateRange === '90d' ? 90 : 365;
        const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
        query = query.gte('created_at', cutoffDate);
      }

      const { data, error } = await query.order('full_name');
      
      if (error) throw error;

      // Post-process for complex filters
      let filteredData = data || [];

      if (filters.companies.length > 0) {
        filteredData = filteredData.filter(person => 
          person.company_relationships?.some((rel: any) => 
            filters.companies.includes(rel.companies?.name)
          )
        );
      }

      if (filters.locations.length > 0) {
        filteredData = filteredData.filter(person =>
          person.location && filters.locations.some(loc => 
            person.location.toLowerCase().includes(loc.toLowerCase())
          )
        );
      }

      if (filters.roles.length > 0) {
        filteredData = filteredData.filter(person =>
          person.company_relationships?.some((rel: any) =>
            filters.roles.includes(rel.role)
          )
        );
      }

      return filteredData;
    },
    enabled: true
  });

  useEffect(() => {
    if (searchResults) {
      onResultsChange(searchResults);
    }
  }, [searchResults, onResultsChange]);

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const addFilter = (type: keyof SearchFilters, value: string) => {
    if (type === 'dateRange') {
      setFilters(prev => ({ ...prev, [type]: value }));
    } else if (Array.isArray(filters[type])) {
      const currentArray = filters[type] as string[];
      if (!currentArray.includes(value)) {
        setFilters(prev => ({
          ...prev,
          [type]: [...currentArray, value]
        }));
      }
    }
  };

  const removeFilter = (type: keyof SearchFilters, value: string) => {
    if (Array.isArray(filters[type])) {
      setFilters(prev => ({
        ...prev,
        [type]: (prev[type] as string[]).filter(item => item !== value)
      }));
    }
  };

  const clearAllFilters = () => {
    setFilters({
      query: searchQuery,
      companies: [],
      locations: [],
      roles: [],
      dateRange: 'all'
    });
  };

  const hasActiveFilters = filters.companies.length > 0 || 
                          filters.locations.length > 0 || 
                          filters.roles.length > 0 || 
                          filters.dateRange !== 'all';

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search contacts by name, email, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={hasActiveFilters ? 'bg-blue-50 border-blue-200' : ''}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {filters.companies.length + filters.locations.length + filters.roles.length + (filters.dateRange !== 'all' ? 1 : 0)}
            </Badge>
          )}
        </Button>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600">Active filters:</span>
          
          {filters.companies.map(company => (
            <Badge key={company} variant="secondary" className="flex items-center gap-1">
              <Building className="h-3 w-3" />
              {company}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-red-600" 
                onClick={() => removeFilter('companies', company)}
              />
            </Badge>
          ))}
          
          {filters.locations.map(location => (
            <Badge key={location} variant="secondary" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {location}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-red-600" 
                onClick={() => removeFilter('locations', location)}
              />
            </Badge>
          ))}
          
          {filters.roles.map(role => (
            <Badge key={role} variant="secondary" className="flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              {role}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-red-600" 
                onClick={() => removeFilter('roles', role)}
              />
            </Badge>
          ))}
          
          {filters.dateRange !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Last {filters.dateRange}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-red-600" 
                onClick={() => setFilters(prev => ({ ...prev, dateRange: 'all' }))}
              />
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-red-600 hover:text-red-700"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Filter Suggestions Panel */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <h4 className="font-medium mb-2">Companies</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {suggestions?.companies.map(company => (
                    <Button
                      key={company}
                      variant="ghost"
                      size="sm"
                      className="justify-start w-full text-left p-2 h-auto"
                      onClick={() => addFilter('companies', company)}
                      disabled={filters.companies.includes(company)}
                    >
                      <Building className="h-3 w-3 mr-2" />
                      {company}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Locations</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {suggestions?.locations.map(location => (
                    <Button
                      key={location}
                      variant="ghost"
                      size="sm"
                      className="justify-start w-full text-left p-2 h-auto"
                      onClick={() => addFilter('locations', location)}
                      disabled={filters.locations.includes(location)}
                    >
                      <MapPin className="h-3 w-3 mr-2" />
                      {location}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Roles</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {suggestions?.roles.map(role => (
                    <Button
                      key={role}
                      variant="ghost"
                      size="sm"
                      className="justify-start w-full text-left p-2 h-auto"
                      onClick={() => addFilter('roles', role)}
                      disabled={filters.roles.includes(role)}
                    >
                      <Briefcase className="h-3 w-3 mr-2" />
                      {role}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Date Range</h4>
                <div className="space-y-1">
                  {[
                    { value: '30d', label: 'Last 30 days' },
                    { value: '90d', label: 'Last 90 days' },
                    { value: '1y', label: 'Last year' },
                    { value: 'all', label: 'All time' }
                  ].map(option => (
                    <Button
                      key={option.value}
                      variant={filters.dateRange === option.value ? 'default' : 'ghost'}
                      size="sm"
                      className="justify-start w-full text-left p-2 h-auto"
                      onClick={() => addFilter('dateRange', option.value)}
                    >
                      <Calendar className="h-3 w-3 mr-2" />
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          {isLoading ? 'Searching...' : `${searchResults?.length || 0} contacts found`}
        </span>
        {filters.query && (
          <span>for "{filters.query}"</span>
        )}
      </div>
    </div>
  );
};

export default IntelligentContactSearch;
