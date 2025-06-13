
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Building, Calendar, MapPin, Globe, Hash } from 'lucide-react';
import { useCompanies } from '@/hooks/useCompanies';
import TrIdSearchDialog from './TrIdSearchDialog';

const CompanyEnhancedListContainer: React.FC = () => {
  const { companies, isLoading } = useCompanies();
  const [searchTerm, setSearchTerm] = useState('');
  const [isTrIdSearchOpen, setIsTrIdSearchOpen] = useState(false);

  // Filter companies based on search term
  const filteredCompanies = companies?.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.tr_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.cin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.location?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies by name, TR ID, CIN, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setIsTrIdSearchOpen(true)}
          className="whitespace-nowrap"
        >
          <Hash className="h-4 w-4 mr-2" />
          Search by TR ID
        </Button>
      </div>

      {/* Companies List */}
      <div className="space-y-4">
        {filteredCompanies.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No companies found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search criteria' : 'No companies have been added yet'}
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
