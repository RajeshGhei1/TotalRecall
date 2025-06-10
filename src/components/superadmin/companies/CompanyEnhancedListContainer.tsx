
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
import { MoreHorizontal, Building, Edit, Trash2, Eye } from 'lucide-react';
import { useCompanies } from '@/hooks/useCompanies';
import { useNavigate } from 'react-router-dom';
import { EditCompanyDialog } from './EditCompanyDialog';
import CompanyDeleteDialog from './CompanyDeleteDialog';
import EnhancedCompanyFilters from './filters/EnhancedCompanyFilters';
import { useCompanyFilters, CompanyFilters } from './hooks/useCompanyFilters';
import { Company } from '@/hooks/useCompanies';

const CompanyEnhancedListContainer: React.FC = () => {
  const navigate = useNavigate();
  const { companies, isLoading, updateCompany } = useCompanies();
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [deletingCompany, setDeletingCompany] = useState<Company | null>(null);

  // Enhanced filter state
  const [filters, setFilters] = useState<CompanyFilters>({
    search: '',
    industries: [],
    sizes: [],
    locations: [],
    countries: [],
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
  const { filteredCompanies } = useCompanyFilters(companies, filters, filters.search);

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
      industries: [],
      sizes: [],
      locations: [],
      countries: [],
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
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Companies ({filteredCompanies.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
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
              {filteredCompanies.map((company) => (
                <TableRow key={company.id}>
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
            </TableBody>
          </Table>
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
    </div>
  );
};

export default CompanyEnhancedListContainer;
