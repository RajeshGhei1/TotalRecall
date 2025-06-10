
import React from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Edit, Trash, ExternalLink } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Company } from '@/hooks/useCompanies';

interface CompanyTableProps {
  companies: Company[];
  onEdit: (companyId: string) => void;
  onDelete: (company: Company) => void;
  onViewDetails: (companyId: string) => void;
  isLoading?: boolean;
}

const CompanyTable: React.FC<CompanyTableProps> = ({ 
  companies, 
  onEdit, 
  onDelete, 
  onViewDetails,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="border rounded-md">
          <div className="h-12 border-b px-4 flex items-center bg-muted/50">
            <Skeleton className="h-4 w-[30%]" />
          </div>
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-16 border-b px-4 flex items-center">
              <div className="flex flex-col gap-2 w-full">
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-3 w-[50%]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Company Name</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No companies found. Add a company to get started.
              </TableCell>
            </TableRow>
          ) : (
            companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">
                  <div>{company.name}</div>
                  {company.website && (
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mt-1"
                    >
                      <span className="truncate max-w-[250px]">{company.website}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {company.industry1 && (
                      <Badge variant="secondary" className="text-xs w-fit">
                        {company.industry1}
                      </Badge>
                    )}
                    {company.industry2 && (
                      <Badge variant="outline" className="text-xs w-fit">
                        {company.industry2}
                      </Badge>
                    )}
                  </div>
                  {!company.industry1 && !company.industry2 && '-'}
                </TableCell>
                <TableCell>{company.location || '-'}</TableCell>
                <TableCell>{company.size || '-'}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewDetails(company.id)}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(company.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onDelete(company)} 
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompanyTable;
