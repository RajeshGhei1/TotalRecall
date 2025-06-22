
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BarChart3, 
  Search, 
  Settings, 
  Download,
  Plus,
  Filter
} from 'lucide-react';
import ContactTypeManager from '../contact-types/ContactTypeManager';
import ContactAnalyticsDashboard from '../analytics/ContactAnalyticsDashboard';
import IntelligentContactSearch from '../search/IntelligentContactSearch';
import PeopleList from '../PeopleList';
import { usePeoplePerformance } from '@/hooks/people/usePeoplePerformance';
import { exportPeopleData, downloadExportedFile } from '@/utils/people/dataExport';
import { toast } from '@/hooks/use-toast';

interface EnhancedPeopleManagerProps {
  personType: 'talent' | 'contact';
  onLinkToCompany: (id: string) => void;
  onAddPerson: () => void;
}

const EnhancedPeopleManager: React.FC<EnhancedPeopleManagerProps> = ({
  personType,
  onLinkToCompany,
  onAddPerson
}) => {
  const [activeTab, setActiveTab] = useState('contacts');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchFilters, setSearchFilters] = useState<any>({});
  const [isExporting, setIsExporting] = useState(false);

  const { processedData, isLoading } = usePeoplePerformance();

  const handleExport = async (format: 'csv' | 'xlsx' | 'json') => {
    setIsExporting(true);
    try {
      const exportResult = await exportPeopleData({
        format,
        includeCompanyInfo: true,
        includeLinkedInData: true,
        filters: searchFilters
      });
      
      downloadExportedFile(exportResult);
      toast({
        title: 'Export completed',
        description: `Contacts exported as ${format.toUpperCase()}`
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export contacts',
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Contacts</p>
                <p className="text-2xl font-bold">
                  {isLoading ? '...' : processedData?.totalContacts || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">With Companies</p>
                <p className="text-2xl font-bold">
                  {isLoading ? '...' : processedData?.contactsWithCompanies || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Plus className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Added Recently</p>
                <p className="text-2xl font-bold">
                  {isLoading ? '...' : processedData?.recentContacts || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Filter className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Search Results</p>
                <p className="text-2xl font-bold">{searchResults.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList className="grid grid-cols-4 w-auto">
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Advanced Search
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button onClick={onAddPerson}>
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleExport('xlsx')}
              disabled={isExporting}
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        </div>

        <TabsContent value="contacts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Contacts</CardTitle>
              <CardDescription>
                Manage your business contacts and company relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PeopleList
                personType={personType}
                onLinkToCompany={onLinkToCompany}
                searchQuery=""
                companyFilter="all"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Intelligent Contact Search</CardTitle>
              <CardDescription>
                Use advanced filters and search across multiple fields
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IntelligentContactSearch
                onResultsChange={setSearchResults}
                onFiltersChange={setSearchFilters}
              />
            </CardContent>
          </Card>

          {searchResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Search Results ({searchResults.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {searchResults.map((person) => (
                    <div key={person.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{person.full_name}</h4>
                        <p className="text-sm text-muted-foreground">{person.email}</p>
                        {person.location && (
                          <p className="text-sm text-muted-foreground">{person.location}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onLinkToCompany(person.id)}
                        >
                          Link to Company
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <ContactAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Types</CardTitle>
                <CardDescription>
                  Manage contact categories and classifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContactTypeManager />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
                <CardDescription>
                  Download your contact data in various formats
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleExport('csv')}
                    disabled={isExporting}
                    className="w-full"
                  >
                    CSV
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleExport('xlsx')}
                    disabled={isExporting}
                    className="w-full"
                  >
                    Excel
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleExport('json')}
                    disabled={isExporting}
                    className="w-full"
                  >
                    JSON
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>• CSV: Basic contact information in comma-separated format</p>
                  <p>• Excel: Full contact data with company relationships</p>
                  <p>• JSON: Complete data structure for system integration</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedPeopleManager;
