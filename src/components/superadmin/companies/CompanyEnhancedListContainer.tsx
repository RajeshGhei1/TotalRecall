import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Download, Upload, FileText } from 'lucide-react';
import { useCompanies, Company } from '@/hooks/useCompanies';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import CompanySearch from './CompanySearch';
import CompanyTable from './CompanyTable';
import CompanyDeleteDialog from './CompanyDeleteDialog';
import CreateCompanyDialog from './CreateCompanyDialog';
import CompanyAdvancedFilters, { CompanyFilters } from './filters/CompanyAdvancedFilters';
import SavedSearchManager from './filters/SavedSearchManager';

const CompanyEnhancedListContainer: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
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
  
  // Apply all filters to companies
  const filteredCompanies = useMemo(() => {
    if (!companies) return [];
    
    return companies.filter(company => {
      // Text search filter
      if (filters.search || searchTerm) {
        const searchText = (filters.search || searchTerm).toLowerCase();
        const searchableText = [
          company.name,
          company.industry,
          company.location,
          company.description,
          company.website,
          company.email,
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (!searchableText.includes(searchText)) return false;
      }
      
      // Industry filter
      if (filters.industries?.length && company.industry) {
        if (!filters.industries.includes(company.industry)) return false;
      }
      
      // Size filter
      if (filters.sizes?.length && company.size) {
        if (!filters.sizes.includes(company.size)) return false;
      }
      
      // Location filter
      if (filters.locations?.length && company.location) {
        if (!filters.locations.includes(company.location)) return false;
      }
      
      // Company Type filter - fixed property name
      if (filters.companyTypes?.length && company.companyType) {
        if (!filters.companyTypes.includes(company.companyType)) return false;
      }
      
      // Sector filter - fixed property name
      if (filters.sectors?.length && company.companySector) {
        if (!filters.sectors.includes(company.companySector)) return false;
      }
      
      // Founded date range filter
      if (filters.foundedFrom || filters.foundedTo) {
        if (company.founded) {
          const foundedYear = company.founded;
          if (filters.foundedFrom && foundedYear < filters.foundedFrom.getFullYear()) return false;
          if (filters.foundedTo && foundedYear > filters.foundedTo.getFullYear()) return false;
        } else if (filters.foundedFrom || filters.foundedTo) {
          return false; // Company doesn't have founded date but filter is applied
        }
      }
      
      // Registration date range filter - fixed property name
      if (filters.registrationFrom || filters.registrationTo) {
        if (company.registrationDate) {
          const regDate = new Date(company.registrationDate);
          if (filters.registrationFrom && regDate < filters.registrationFrom) return false;
          if (filters.registrationTo && regDate > filters.registrationTo) return false;
        } else if (filters.registrationFrom || filters.registrationTo) {
          return false; // Company doesn't have registration date but filter is applied
        }
      }
      
      return true;
    });
  }, [companies, filters, searchTerm]);

  const handleAddCompany = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (companyId: string) => {
    navigate(`/superadmin/companies/${companyId}`);
  };

  const handleViewDetails = (companyId: string) => {
    navigate(`/superadmin/companies/${companyId}`);
  };

  const handleDelete = (company: Company) => {
    setCompanyToDelete(company);
  };

  const handleConfirmDelete = async () => {
    if (!companyToDelete) return;
    
    try {
      // Delete any company relationships first
      const { error: relationshipsError } = await supabase
        .from('company_relationships')
        .delete()
        .eq('company_id', companyToDelete.id);
        
      if (relationshipsError) throw relationshipsError;
      
      // Then delete the company
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', companyToDelete.id);
        
      if (error) throw error;
      
      toast.success(`${companyToDelete.name} deleted successfully`);
      refetch();
    } catch (error: any) {
      console.error('Error deleting company:', error);
      toast.error(`Failed to delete company: ${error.message}`);
    } finally {
      setCompanyToDelete(null);
    }
  };

  const handleCreateCompany = async (data: any) => {
    try {
      await createCompany.mutateAsync(data);
      setIsCreateDialogOpen(false);
      toast.success('Company created successfully');
      refetch();
    } catch (error: any) {
      console.error('Error creating company:', error);
      toast.error(`Failed to create company: ${error.message}`);
    }
  };

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
    if (filteredCompanies.length === 0) {
      toast.error('No companies to export');
      return;
    }

    // Create CSV content
    const headers = ['Name', 'Industry', 'Size', 'Location', 'Founded', 'Website', 'Email'];
    const csvContent = [
      headers.join(','),
      ...filteredCompanies.map(company => [
        `"${company.name || ''}"`,
        `"${company.industry || ''}"`,
        `"${company.size || ''}"`,
        `"${company.location || ''}"`,
        company.founded || '',
        `"${company.website || ''}"`,
        `"${company.email || ''}"`,
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `companies-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success(`Exported ${filteredCompanies.length} companies`);
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
