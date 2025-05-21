
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreVertical, Pencil, Trash, Eye } from 'lucide-react';
import { Company } from '@/hooks/useCompanies';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface CompanyTableProps {
  companies: Company[];
  onDeleteCompany: (id: string) => void;
  onEditCompany: (company: Company) => void;
  isLoading?: boolean; // Added missing prop
  onEdit?: (id: string) => void; // Added missing prop
  onDelete?: (company: any) => void; // Added missing prop  
  onViewDetails?: (id: string) => void; // Added missing prop
}

const CompanyTable: React.FC<CompanyTableProps> = ({
  companies,
  onDeleteCompany,
  onEditCompany,
  onEdit,
  onDelete,
  onViewDetails
}) => {
  const navigate = useNavigate();

  const handleViewCompany = (id: string) => {
    if (onViewDetails) {
      onViewDetails(id);
    } else {
      navigate(`/superadmin/companies/${id}`);
    }
  };

  const handleEditCompany = (company: Company, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(company.id);
    } else {
      onEditCompany(company);
    }
  };

  const handleDeleteCompany = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete({id});
    } else {
      onDeleteCompany(id);
    }
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Website</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewCompany(company.id)}>
              <TableCell className="font-medium">{company.name}</TableCell>
              <TableCell>{company.industry || '-'}</TableCell>
              <TableCell>{company.location || '-'}</TableCell>
              <TableCell>
                {company.website ? (
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {company.website}
                  </a>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleViewCompany(company.id);
                    }}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => handleEditCompany(company, e)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={(e) => handleDeleteCompany(company.id, e)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompanyTable;
