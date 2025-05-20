
import React, { useState } from 'react';
import { Skill, TalentSkill } from '@/types/talent';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSkills, fetchTalentSkills } from '@/services/talentService';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import AddSkillDialog from './AddSkillDialog';

interface TalentSkillsManagerProps {
  personId: string;
}

const TalentSkillsManager: React.FC<TalentSkillsManagerProps> = ({ personId }) => {
  const [isAddSkillDialogOpen, setIsAddSkillDialogOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<TalentSkill | null>(null);
  
  const queryClient = useQueryClient();

  // Fetch all available skills
  const { data: allSkills, isLoading: loadingSkills } = useQuery({
    queryKey: ['skills'],
    queryFn: fetchSkills
  });

  // Fetch skills for this talent
  const { data: talentSkills, isLoading: loadingTalentSkills } = useQuery({
    queryKey: ['talentSkills', personId],
    queryFn: () => fetchTalentSkills(personId),
    enabled: !!personId
  });

  // Delete skill mutation
  const deleteSkillMutation = useMutation({
    mutationFn: async (skillId: string) => {
      const { error } = await supabase
        .from('talent_skills')
        .delete()
        .eq('id', skillId);
      
      if (error) throw error;
      return skillId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['talentSkills', personId] });
      toast.success('Skill removed successfully');
    },
    onError: (error) => {
      console.error('Error removing skill:', error);
      toast.error('Failed to remove skill');
    }
  });

  const handleAddSkill = () => {
    setSelectedSkill(null);
    setIsAddSkillDialogOpen(true);
  };

  const handleEditSkill = (skill: TalentSkill) => {
    setSelectedSkill(skill);
    setIsAddSkillDialogOpen(true);
  };

  const handleDeleteSkill = (skillId: string) => {
    if (confirm('Are you sure you want to remove this skill?')) {
      deleteSkillMutation.mutate(skillId);
    }
  };

  const handleSkillSaved = () => {
    setIsAddSkillDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ['talentSkills', personId] });
  };

  if (loadingTalentSkills) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-24" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    );
  }

  const getProficiencyColor = (level?: string | null) => {
    switch (level) {
      case 'Expert':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Advanced':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Intermediate':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Beginner':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Skills</h3>
        <Button size="sm" variant="outline" onClick={handleAddSkill}>
          <Plus className="h-4 w-4 mr-1" />
          Add Skill
        </Button>
      </div>
      
      {talentSkills && talentSkills.length > 0 ? (
        <div className="space-y-4">
          {talentSkills.map((skill) => (
            <div key={skill.id} className="flex items-center justify-between p-2 border rounded-md">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={getProficiencyColor(skill.proficiency_level)}>
                  {skill.proficiency_level || 'Not specified'}
                </Badge>
                <span className="font-medium">{skill.skill?.name}</span>
                {skill.years_of_experience && (
                  <span className="text-sm text-muted-foreground">
                    ({skill.years_of_experience} years)
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={() => handleEditSkill(skill)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDeleteSkill(skill.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-md bg-muted p-4 text-center">
          <p>No skills have been added yet.</p>
        </div>
      )}

      {/* Add Skill Dialog */}
      <AddSkillDialog 
        isOpen={isAddSkillDialogOpen}
        onClose={() => setIsAddSkillDialogOpen(false)}
        onSkillSaved={handleSkillSaved}
        talentId={personId}
        existingSkill={selectedSkill}
        availableSkills={allSkills || []}
      />
    </div>
  );
};

export default TalentSkillsManager;
