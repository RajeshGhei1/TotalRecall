
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Talent } from "@/types/talent";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Edit, Trash, UserPlus } from "lucide-react";

const TalentList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [talentToDelete, setTalentToDelete] = useState<Talent | null>(null);

  // Fetch all talents
  const { data: talents = [], isLoading } = useQuery({
    queryKey: ['talents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('talents')
        .select('*')
        .order('full_name');
      
      if (error) throw error;
      return data as Talent[];
    },
  });

  // Delete talent mutation
  const deleteMutation = useMutation({
    mutationFn: async (talentId: string) => {
      const { error } = await supabase
        .from('talents')
        .delete()
        .eq('id', talentId);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['talents'] });
      setTalentToDelete(null);
      
      toast({
        title: "Talent Deleted",
        description: "The talent has been successfully removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete talent: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Filter talents based on search term
  const filteredTalents = talents.filter(talent => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      talent.full_name?.toLowerCase().includes(searchLower) ||
      talent.email?.toLowerCase().includes(searchLower) ||
      talent.location?.toLowerCase().includes(searchLower)
    );
  });

  const handleDelete = (talent: Talent) => {
    setTalentToDelete(talent);
  };

  const confirmDelete = () => {
    if (talentToDelete) {
      deleteMutation.mutate(talentToDelete.id);
    }
  };

  const handleEdit = (talentId: string) => {
    navigate(`/tenant-admin/talent/edit/${talentId}`);
  };

  const handleViewDetails = (talentId: string) => {
    navigate(`/tenant-admin/talent/view/${talentId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search talents..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => navigate('/tenant-admin/talent/add')}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Talent
        </Button>
      </div>

      {filteredTalents.length === 0 ? (
        <div className="text-center py-10 border rounded-md">
          <p className="text-muted-foreground">
            {searchTerm ? 
              "No talents found matching your search criteria." : 
              "No talents found. Add your first talent to get started."}
          </p>
        </div>
      ) : (
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
              {filteredTalents.map((talent) => (
                <TableRow key={talent.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell 
                    className="font-medium" 
                    onClick={() => handleViewDetails(talent.id)}
                  >
                    {talent.full_name}
                  </TableCell>
                  <TableCell onClick={() => handleViewDetails(talent.id)}>
                    {talent.email}
                  </TableCell>
                  <TableCell onClick={() => handleViewDetails(talent.id)}>
                    {talent.location || "—"}
                  </TableCell>
                  <TableCell onClick={() => handleViewDetails(talent.id)}>
                    {talent.years_of_experience ? 
                      `${talent.years_of_experience} years` : "—"}
                  </TableCell>
                  <TableCell onClick={() => handleViewDetails(talent.id)}>
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
                        handleEdit(talent.id);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(talent);
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
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={!!talentToDelete} onOpenChange={(open) => !open && setTalentToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {talentToDelete?.full_name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTalentToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TalentList;
