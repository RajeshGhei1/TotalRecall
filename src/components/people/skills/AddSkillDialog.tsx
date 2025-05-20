
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skill, TalentSkill } from '@/types/talent';
import { useSkillForm } from '@/hooks/skills/useSkillForm';
import SkillForm from './SkillForm';
import SkillDialogFooter from './SkillDialogFooter';

interface AddSkillDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSkillSaved: () => void;
  talentId: string;
  existingSkill: TalentSkill | null;
  availableSkills: Skill[];
}

const AddSkillDialog: React.FC<AddSkillDialogProps> = ({
  isOpen,
  onClose,
  onSkillSaved,
  talentId,
  existingSkill,
  availableSkills
}) => {
  const {
    selectedSkillId,
    setSelectedSkillId,
    proficiencyLevel,
    setProficiencyLevel,
    yearsOfExperience,
    setYearsOfExperience,
    isSubmitting,
    handleSubmit
  } = useSkillForm({
    talentId,
    existingSkill,
    onSkillSaved
  });

  // Filter out skills that the talent already has (for new skills only)
  const getFilteredSkills = () => {
    if (existingSkill) return availableSkills;
    
    // This would require passing in the current talent skills to filter,
    // but for simplicity we'll just return all skills for now
    return availableSkills;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{existingSkill ? 'Edit Skill' : 'Add Skill'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <SkillForm 
            selectedSkillId={selectedSkillId}
            onSkillChange={setSelectedSkillId}
            proficiencyLevel={proficiencyLevel}
            onProficiencyChange={setProficiencyLevel}
            yearsOfExperience={yearsOfExperience}
            onYearsChange={setYearsOfExperience}
            availableSkills={getFilteredSkills()}
            existingSkill={!!existingSkill}
          />
          
          <SkillDialogFooter 
            onClose={onClose}
            isSubmitting={isSubmitting}
            isEditMode={!!existingSkill}
            isFormValid={!!selectedSkillId}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSkillDialog;
