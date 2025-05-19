
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Talent } from "@/types/talent";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import TalentSearch from "./TalentSearch";
import TalentTable from "./TalentTable";
import TalentDeleteDialog from "./TalentDeleteDialog";

const TalentListContainer: React.FC = () => {
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

  const handleEdit = (talentId: string) => {
    navigate(`/tenant-admin/talent/edit/${talentId}`);
  };

  const handleViewDetails = (talentId: string) => {
    navigate(`/tenant-admin/talent/view/${talentId}`);
  };

  const handleAddTalent = () => {
    navigate('/tenant-admin/talent/add');
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
      <TalentSearch 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        onAddTalent={handleAddTalent}
      />

      <TalentTable 
        talents={filteredTalents} 
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewDetails={handleViewDetails}
      />

      <TalentDeleteDialog
        talent={talentToDelete}
        onClose={() => setTalentToDelete(null)}
        onConfirm={() => {
          queryClient.invalidateQueries({ queryKey: ['talents'] });
          setTalentToDelete(null);
        }}
      />
    </>
  );
};

export default TalentListContainer;
