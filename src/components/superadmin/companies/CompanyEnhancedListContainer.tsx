
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreHorizontal, Building, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCompanies } from '@/hooks/useCompanies';
import { useNavigate } from 'react-router-dom';
import { EditCompanyDialog } from './EditCompanyDialog';
import CompanyDeleteDialog from './CompanyDeleteDialog';
import EnhancedCompanyFilters from './filters/EnhancedCompanyFilters';
import { useCompanyFilters, CompanyFilters } from './hooks/useCompanyFilters';
import { Company } from '@/hooks/useCompanies';
import { toast } from 'sonner';

const CompanyEnhancedListContainer: React.FC = () => {
  const navigate = useNavigate();
  const { companies, isLoading, updateCompany, deleteCompany } = useCompanies();
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [deletingCompany, setDeletingCompany] = useState<Company | null>(null);
  
  // Pagination state
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  // Bulk selection state
  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(new Set());
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  // Enhanced filter state
  const [filters, setFilters] = useState<CompanyFilters>({
    search: '',
    industry1: [],
    industry2: [],
    industry3: [],
    industries: [],
    sizes: [],
    locations: [],
    countries: [],
    globalRegions: [],
    regions: [],
    hoLocations: [],
    companyTypes: [],
    entityTypes: [],
    sectors: [],
    statuses: [],
    employeeSegments: [],
    turnoverSegments: [],
    capitalSegments: [],
    turnoverYears: [],
    specializations: [],
    serviceLines: [],
    verticals: [],
    companyGroups: [],
    hasParent: [],
    hasEmail: [],
    hasPhone: [],
    hasWebsite: [],
    hasLinkedin: [],
    hasTwitter: [],
    hasFacebook: [],
  });

  // Use the enhanced filtering hook
  const { filteredCompanies } = useCompanyFilters(companies || [], filters, filters.search);

  // Pagination logic - ensure we have safe defaults
  const totalItems = filteredCompanies?.length || 0;
  const showAll = itemsPerPage === -1;
  const paginatedCompanies = showAll ? (filteredCompanies || []) : (filteredCompanies || []).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = showAll ? 1 : Math.ceil(totalItems / itemsPerPage);

  // Reset current page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Reset selection when pagination changes
  React.useEffect(() => {
    setSelectedCompanies(new Set());
  }, [currentPage, itemsPerPage]);

  const handleEditSubmit = (data: any) => {
    if (editingCompany) {
      updateCompany.mutate(
        { id: editingCompany.id, companyData: data },
        {
          onSuccess: () => {
            setEditingCompany(null);
          }
        }
      );
    }
  };

  const handleFiltersChange = (newFilters: CompanyFilters) => {
    setFilters(newFilters);
  };

  const handleFiltersReset = () => {
    setFilters({
      search: '',
      industry1: [],
      industry2: [],
      industry3: [],
      industries: [],
      sizes: [],
      locations: [],
      countries: [],
      globalRegions: [],
      regions: [],
      hoLocations: [],
      companyTypes: [],
      entityTypes: [],
      sectors: [],
      statuses: [],
      employeeSegments: [],
      turnoverSegments: [],
      capitalSegments: [],
      turnoverYears: [],
      specializations: [],
      serviceLines: [],
      verticals: [],
      companyGroups: [],
      hasParent: [],
      hasEmail: [],
      hasPhone: [],
      hasWebsite: [],
      hasLinkedin: [],
      hasTwitter: [],
      hasFacebook: [],
    });
  };

  // Selection handlers with safe null checks
  const handleSelectAll = (checked: boolean) => {
    if (checked && paginatedCompanies && paginatedCompanies.length > 0) {
      const currentPageIds = new Set(paginatedCompanies.map(company => company.id));
      setSelectedCompanies(currentPageIds);
    } else {
      setSelectedCompanies(new Set());
    }
  };

  const handleSelectCompany = (companyId: string, checked: boolean) => {
    const newSelection = new Set(selectedCompanies);
    if (checked) {
      newSelection.add(companyId);
    } else {
      newSelection.delete(companyId);
    }
    setSelectedCompanies(newSelection);
  };

  // Safe checks for selection state
  const isAllSelected = paginatedCompanies && paginatedCompanies.length > 0 && paginatedCompanies.every(company => selectedCompanies.has(company.id));
  const isIndeterminate = selectedCompanies.size > 0 && !isAllSelected;

  // Bulk delete handler
  const handleBulkDelete = async () => {
    try {
      const deletePromises = Array.from(selectedCompanies).map(companyId => 
        deleteCompany.mutateAsync(companyId)
      );
      await Promise.all(deletePromises);
      setSelectedCompanies(new Set());
      setShowBulkDeleteDialog(false);
      toast.success(`Successfully deleted ${selectedCompanies.size} companies`);
    } catch (error) {
      toast.error('Failed to delete some companies');
      console.error('Bulk delete error:', error);
    }
  };

  // Pagination handlers
  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = value === 'all' ? -1 : parseInt(value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading companies...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Filters */}
      <EnhancedCompanyFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleFiltersReset}
        companies={companies || []}
      />

      {/* Companies Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Companies ({totalItems} total)
            </CardTitle>
            <div className="flex items-center gap-4">
              {/* Bulk Actions */}
              {selectedCompanies.size > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {selectedCompanies.size} selected
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowBulkDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Selected
                  </Button>
                </div>
              )}
              
              {/* Items per page selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show:</span>
                <Select value={itemsPerPage === -1 ? 'all' : itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all companies"
                    className={isIndeterminate ? "data-[state=checked]:bg-primary" : ""}
                  />
                </TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Level</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCompanies && paginatedCompanies.map((company) => (
                <TableRow key={company.id} className={selectedCompanies.has(company.id) ? 'bg-muted/50' : ''}>
                  <TableCell>
                    <Checkbox
                      checked={selectedCompanies.has(company.id)}
                      onCheckedChange={(checked) => handleSelectCompany(company.id, checked as boolean)}
                      aria-label={`Select ${company.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{company.name}</div>
                      {company.website && (
                        <div className="text-sm text-gray-500">{company.website}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {company.industry1 && (
                        <Badge variant="secondary" className="text-xs">{company.industry1}</Badge>
                      )}
                      {company.industry2 && (
                        <Badge variant="outline" className="text-xs">{company.industry2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{company.location || '-'}</TableCell>
                  <TableCell>{company.size || '-'}</TableCell>
                  <TableCell>{company.company_group_name || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      Level {company.hierarchy_level || 0}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => navigate(`/superadmin/companies/${company.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setEditingCompany(company)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Company
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => setDeletingCompany(company)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Company
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {(!paginatedCompanies || paginatedCompanies.length === 0) && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No companies found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Pagination Controls */}
          {!showAll && totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} companies
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Company Dialog */}
      {editingCompany && (
        <EditCompanyDialog
          isOpen={!!editingCompany}
          onClose={() => setEditingCompany(null)}
          company={editingCompany}
          onSubmit={handleEditSubmit}
          isSubmitting={updateCompany.isPending}
        />
      )}

      {/* Delete Company Dialog */}
      <CompanyDeleteDialog
        isOpen={!!deletingCompany}
        onClose={() => setDeletingCompany(null)}
        company={deletingCompany}
        allCompanies={companies || []}
      />

      {/* Bulk Delete Dialog */}
      <CompanyDeleteDialog
        isOpen={showBulkDeleteDialog}
        onClose={() => setShowBulkDeleteDialog(false)}
        company={null}
        allCompanies={companies || []}
        bulkDeleteIds={Array.from(selectedCompanies)}
        onBulkDelete={handleBulkDelete}
      />
    </div>
  );
};

export default CompanyEnhancedListContainer;
