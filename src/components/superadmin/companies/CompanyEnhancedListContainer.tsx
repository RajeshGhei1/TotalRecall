
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Search, MoreHorizontal, Building, Users, Network, Edit, Trash2, Eye, ArrowUpDown } from 'lucide-react';
import { useCompanies, Company } from '@/hooks/useCompanies';
import { useCompanyCompleteness } from '@/hooks/useCompanyCompleteness';
import { useNavigate } from 'react-router-dom';
import { EditCompanyDialog } from './EditCompanyDialog';
import CompanyDeleteDialog from './CompanyDeleteDialog';
import CompletenessScore from './Completeness/CompletenessScore';

type SortField = 'name' | 'industry' | 'location' | 'completeness';
type SortDirection = 'asc' | 'desc';

const CompanyEnhancedListContainer: React.FC = () => {
  const navigate = useNavigate();
  const { companies, isLoading, updateCompany } = useCompanies();
  const { companiesWithCompleteness, stats } = useCompanyCompleteness(companies || []);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [deletingCompany, setDeletingCompany] = useState<Company | null>(null);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [completenessFilter, setCompletenessFilter] = useState<string>('all');

  // Filter and sort companies
  const filteredAndSortedCompanies = useMemo(() => {
    let filtered = companiesWithCompleteness.filter(company => {
      const matchesSearch = 
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.location?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCompleteness = 
        completenessFilter === 'all' ||
        (completenessFilter === 'high' && company.completeness.score >= 80) ||
        (completenessFilter === 'medium' && company.completeness.score >= 60 && company.completeness.score < 80) ||
        (completenessFilter === 'low' && company.completeness.score < 60);
      
      return matchesSearch && matchesCompleteness;
    });

    // Sort companies
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'completeness':
          aValue = a.completeness.score;
          bValue = b.completeness.score;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'industry':
          aValue = a.industry?.toLowerCase() || '';
          bValue = b.industry?.toLowerCase() || '';
          break;
        case 'location':
          aValue = a.location?.toLowerCase() || '';
          bValue = b.location?.toLowerCase() || '';
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [companiesWithCompleteness, searchTerm, completenessFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

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
      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search companies by name, industry, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={completenessFilter} onValueChange={setCompletenessFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by completeness" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            <SelectItem value="high">High Quality (≥80%)</SelectItem>
            <SelectItem value="medium">Medium Quality (60-79%)</SelectItem>
            <SelectItem value="low">Low Quality (<60%)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.totalCompanies}</div>
            <div className="text-sm text-muted-foreground">Total Companies</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
            <div className="text-sm text-muted-foreground">Average Completeness</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.companiesAbove80}</div>
            <div className="text-sm text-muted-foreground">High Quality Data</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.companiesBelow60}</div>
            <div className="text-sm text-muted-foreground">Need Attention</div>
          </CardContent>
        </Card>
      </div>

      {/* Companies Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Companies ({filteredAndSortedCompanies.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    className="h-auto p-0 font-medium"
                    onClick={() => handleSort('name')}
                  >
                    Company
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    className="h-auto p-0 font-medium"
                    onClick={() => handleSort('industry')}
                  >
                    Industry
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    className="h-auto p-0 font-medium"
                    onClick={() => handleSort('location')}
                  >
                    Location
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    className="h-auto p-0 font-medium"
                    onClick={() => handleSort('completeness')}
                  >
                    Data Score
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedCompanies.map((company) => (
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
                    {company.industry && (
                      <Badge variant="secondary">{company.industry}</Badge>
                    )}
                  </TableCell>
                  <TableCell>{company.location || '-'}</TableCell>
                  <TableCell>{company.size || '-'}</TableCell>
                  <TableCell>{company.company_group_name || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      Level {company.hierarchy_level || 0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <CompletenessScore completeness={company.completeness} />
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
