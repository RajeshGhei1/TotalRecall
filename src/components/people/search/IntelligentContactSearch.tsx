
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { useDebounce } from 'use-debounce';

interface SearchFilters {
  query: string;
  companies: string[];
  locations: string[];
  roles: string[];
  dateRange: string;
}

interface IntelligentContactSearchProps {
  onResultsChange: (results: unknown[]) => void;
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

  const [debouncedQuery] = useDebounce(searchQuery, 300);

  const handleSearch = () => {
    const updatedFilters: SearchFilters = {
      ...filters,
      query: debouncedQuery
    };
    
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
    
    // Mock search results for now
    const mockResults = [
      {
        id: '1',
        full_name: 'John Doe',
        email: 'john@example.com',
        location: 'New York',
        role: 'Manager'
      }
    ];
    
    onResultsChange(debouncedQuery ? mockResults : []);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Contacts</CardTitle>
        <CardDescription>
          Search through your contact database with advanced filters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
            placeholder="Search contacts by name, email, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntelligentContactSearch;
