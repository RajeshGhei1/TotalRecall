
import React, { useState } from 'react';
import { Loader2, Download } from 'lucide-react';
import { useCompanies } from '@/hooks/useCompanies';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import CompanySearch from './CompanySearch';
import CompanyTable from './CompanyTable';
import CompanyDeleteDialog from './CompanyDeleteDialog';
import CreateCompanyDialog from './CreateCompanyDialog';
import CompanyAdvancedFilters, { CompanyFilters } from './filters/CompanyAdvancedFilters';
import SavedSearchManager from './filters/SavedSearchManager';
import { useCompanyFilters } from './hooks/useCompanyFilters';
import { useCompanyActions } from './hooks/useCompanyActions';
import { exportCompaniesToCSV } from './utils/exportUtils';

const CompanyEnhancedListContainer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  
  const [filters, setFilters] = useState<CompanyFilters>({
    search: '',
    industries: [],
    sizes: [],
    locations: [],
    companyTypes: [],
    sectors: [],
  });
  
  const { companies, isLoading, refetch, createCompany } = useCompanies();
  const { filteredCompanies } = useCompanyFilters(companies, filters, searchTerm);
  
  const {
    companyToDelete,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    setCompanyToDelete,
    handleAddCompany,
    handleEdit,
    handleViewDetails,
    handleDelete,
    handleConfirmDelete,
    handleCreateCompany,
  } = useCompanyActions(refetch, createCompany);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      industries: [],
      sizes: [],
      locations: [],
      companyTypes: [],
      sectors: [],
    });
    setSearchTerm('');
  };

  const handleExportCurrent = () => {
    exportCompaniesToCSV(filteredCompanies);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {filteredCompanies.length} of {companies?.length || 0} companies
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCurrent}>
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Companies List</TabsTrigger>
          <TabsTrigger value="saved-searches">Saved Searches</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-6">
          {/* Enhanced Search */}
          <CompanySearch 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onAddCompany={handleAddCompany}
          />

          {/* Advanced Filters */}
          <CompanyAdvancedFilters
            filters={filters}
            onFiltersChange={setFilters}
            onReset={handleResetFilters}
            companies={companies || []}
          />
          
          {/* Companies Table */}
          <CompanyTable 
            companies={filteredCompanies}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
          />
        </TabsContent>
        
        <TabsContent value="saved-searches">
          <SavedSearchManager
            currentFilters={{ ...filters, search: searchTerm }}
            onLoadSearch={(loadedFilters) => {
              setFilters(loadedFilters);
              setSearchTerm(loadedFilters.search || '');
              setActiveTab('list');
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CompanyDeleteDialog
        company={companyToDelete}
        companyName={companyToDelete?.name || ''}
        isOpen={!!companyToDelete}
        onClose={() => setCompanyToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      <CreateCompanyDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateCompany}
        isSubmitting={createCompany.isPending}
      />
    </div>
  );
};

export default CompanyEnhancedListContainer;
