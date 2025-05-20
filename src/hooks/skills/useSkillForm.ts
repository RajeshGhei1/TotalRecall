
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { TalentSkill } from '@/types/talent';
import { createTalentSkill, updateTalentSkill } from '@/services/talentService';

interface UseSkillFormProps {
  talentId: string;
  existingSkill: TalentSkill | null;
  onSkillSaved: () => void;
}

export const useSkillForm = ({ talentId, existingSkill, onSkillSaved }: UseSkillFormProps) => {
  const [selectedSkillId, setSelectedSkillId] = useState<string>('');
  const [proficiencyLevel, setProficiencyLevel] = useState<string>('');
  const [yearsOfExperience, setYearsOfExperience] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset form when dialog opens/closes or when existing skill changes
  useEffect(() => {
    if (existingSkill) {
      setSelectedSkillId(existingSkill.skill_id);
      setProficiencyLevel(existingSkill.proficiency_level || '');
      setYearsOfExperience(
        existingSkill.years_of_experience ? existingSkill.years_of_experience.toString() : ''
      );
    } else {
      setSelectedSkillId('');
      setProficiencyLevel('');
      setYearsOfExperience('');
    }
  }, [existingSkill]);

  // Handle save skill mutation
  const saveSkillMutation = useMutation({
    mutationFn: async () => {
      if (existingSkill) {
        // Update existing skill
        await updateTalentSkill(existingSkill.id, {
          proficiency_level: proficiencyLevel || undefined,
          years_of_experience: yearsOfExperience ? parseFloat(yearsOfExperience) : undefined
        });
        return existingSkill.id;
      } else {
        // Create new skill
        return await createTalentSkill(
          talentId,
          selectedSkillId,
          proficiencyLevel || undefined,
          yearsOfExperience ? parseFloat(yearsOfExperience) : undefined
        );
      }
    },
    onSuccess: () => {
      toast.success(existingSkill ? 'Skill updated successfully' : 'Skill added successfully');
      onSkillSaved();
    },
    onError: (error) => {
      console.error('Error saving skill:', error);
      toast.error('Failed to save skill');
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSkillId) {
      toast.error('Please select a skill');
      return;
    }
    
    setIsSubmitting(true);
    saveSkillMutation.mutate();
  };

  return {
    selectedSkillId,
    setSelectedSkillId,
    proficiencyLevel,
    setProficiencyLevel,
    yearsOfExperience,
    setYearsOfExperience,
    isSubmitting,
    handleSubmit
  };
};
