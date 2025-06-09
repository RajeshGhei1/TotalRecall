
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Save, Search, Trash2, Star } from 'lucide-react';
import { CompanyFilters } from './CompanyAdvancedFilters';
import { toast } from 'sonner';

interface SavedSearch {
  id: string;
  name: string;
  filters: CompanyFilters;
  createdAt: Date;
  isFavorite: boolean;
}

interface SavedSearchManagerProps {
  currentFilters: CompanyFilters;
  onLoadSearch: (filters: CompanyFilters) => void;
}

const SavedSearchManager: React.FC<SavedSearchManagerProps> = ({
  currentFilters,
  onLoadSearch,
}) => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchName, setSearchName] = useState('');

  // Load saved searches from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('company-saved-searches');
    if (saved) {
      try {
        const searches = JSON.parse(saved).map((search: any) => ({
          ...search,
          createdAt: new Date(search.createdAt),
        }));
        setSavedSearches(searches);
      } catch (error) {
        console.error('Error loading saved searches:', error);
      }
    }
  }, []);

  // Save searches to localStorage whenever the state changes
  useEffect(() => {
    localStorage.setItem('company-saved-searches', JSON.stringify(savedSearches));
  }, [savedSearches]);

  const saveCurrentSearch = () => {
    if (!searchName.trim()) {
      toast.error('Please enter a name for the search');
      return;
    }

    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: searchName.trim(),
      filters: currentFilters,
      createdAt: new Date(),
      isFavorite: false,
    };

    setSavedSearches(prev => [newSearch, ...prev]);
    setSearchName('');
    setIsDialogOpen(false);
    toast.success('Search saved successfully');
  };

  const deleteSearch = (searchId: string) => {
    setSavedSearches(prev => prev.filter(search => search.id !== searchId));
    toast.success('Search deleted');
  };

  const toggleFavorite = (searchId: string) => {
    setSavedSearches(prev =>
      prev.map(search =>
        search.id === searchId
          ? { ...search, isFavorite: !search.isFavorite }
          : search
      )
    );
  };

  const loadSearch = (search: SavedSearch) => {
    onLoadSearch(search.filters);
    toast.success(`Loaded search: ${search.name}`);
  };

  const getFilterSummary = (filters: CompanyFilters) => {
    const summary = [];
    if (filters.search) summary.push(`Search: "${filters.search}"`);
    if (filters.industries?.length) summary.push(`${filters.industries.length} industries`);
    if (filters.sizes?.length) summary.push(`${filters.sizes.length} sizes`);
    if (filters.locations?.length) summary.push(`${filters.locations.length} locations`);
    if (filters.foundedFrom || filters.foundedTo) summary.push('Founded date range');
    if (filters.registrationFrom || filters.registrationTo) summary.push('Registration date range');
    if (filters.companyTypes?.length) summary.push(`${filters.companyTypes.length} types`);
    if (filters.sectors?.length) summary.push(`${filters.sectors.length} sectors`);
    
    return summary.length > 0 ? summary.join(', ') : 'No filters applied';
  };

  const hasActiveFilters = () => {
    return (
      currentFilters.search ||
      (currentFilters.industries && currentFilters.industries.length > 0) ||
      (currentFilters.sizes && currentFilters.sizes.length > 0) ||
      (currentFilters.locations && currentFilters.locations.length > 0) ||
      currentFilters.foundedFrom ||
      currentFilters.foundedTo ||
      currentFilters.registrationFrom ||
      currentFilters.registrationTo ||
      (currentFilters.companyTypes && currentFilters.companyTypes.length > 0) ||
      (currentFilters.sectors && currentFilters.sectors.length > 0)
    );
  };

  const favoriteSearches = savedSearches.filter(search => search.isFavorite);
  const regularSearches = savedSearches.filter(search => !search.isFavorite);

  return (
    <div className="space-y-4">
      {/* Quick Actions */}
      <div className="flex items-center gap-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              disabled={!hasActiveFilters()}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Current Search
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Search</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="search-name">Search Name</Label>
                <Input
                  id="search-name"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="Enter a name for this search"
                />
              </div>
              <div>
                <Label>Current Filters</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {getFilterSummary(currentFilters)}
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={saveCurrentSearch}>
                  Save Search
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Favorite Searches */}
      {favoriteSearches.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-yellow-500" />
              Favorite Searches
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {favoriteSearches.map(search => (
              <div
                key={search.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{search.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {search.createdAt.toLocaleDateString()}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {getFilterSummary(search.filters)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => loadSearch(search)}
                    className="h-8 w-8 p-0"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(search.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSearch(search.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Regular Saved Searches */}
      {regularSearches.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Saved Searches</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {regularSearches.map(search => (
              <div
                key={search.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{search.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {search.createdAt.toLocaleDateString()}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {getFilterSummary(search.filters)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => loadSearch(search)}
                    className="h-8 w-8 p-0"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(search.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSearch(search.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {savedSearches.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No saved searches yet. Apply some filters and save your search to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SavedSearchManager;
