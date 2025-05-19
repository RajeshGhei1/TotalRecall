
import React from "react";
import { Talent } from "@/types/talent";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TalentTableProps {
  talents: Talent[];
  onEdit: (talentId: string) => void;
  onDelete: (talent: Talent) => void;
  onViewDetails: (talentId: string) => void;
}

const TalentTable: React.FC<TalentTableProps> = ({ 
  talents, 
  onEdit, 
  onDelete,
  onViewDetails 
}) => {
  if (talents.length === 0) {
    return (
      <div className="text-center py-10 border rounded-md">
        <p className="text-muted-foreground">
          No talents found matching your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {talents.map((talent) => (
            <TableRow key={talent.id} className="cursor-pointer hover:bg-muted/50">
              <TableCell 
                className="font-medium" 
                onClick={() => onViewDetails(talent.id)}
              >
                {talent.full_name}
              </TableCell>
              <TableCell onClick={() => onViewDetails(talent.id)}>
                {talent.email}
              </TableCell>
              <TableCell onClick={() => onViewDetails(talent.id)}>
                {talent.location || "—"}
              </TableCell>
              <TableCell onClick={() => onViewDetails(talent.id)}>
                {talent.years_of_experience ? 
                  `${talent.years_of_experience} years` : "—"}
              </TableCell>
              <TableCell onClick={() => onViewDetails(talent.id)}>
                <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                  talent.availability_status === 'available' ? 'bg-green-100 text-green-800' :
                  talent.availability_status === 'hired' ? 'bg-blue-100 text-blue-800' :
                  talent.availability_status === 'not available' ? 'bg-red-100 text-red-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {talent.availability_status || "Available"}
                </span>
              </TableCell>
              <TableCell className="text-right space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(talent.id);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(talent);
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TalentTable;
