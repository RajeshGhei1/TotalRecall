
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skill, TalentSkill } from '@/types/talent';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface AddSkillDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSkillSaved: () => void;
  talentId: string;
  existingSkill: TalentSkill | null;
  availableSkills: Skill[];
}

const proficiencyLevels = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
  { value: 'Expert', label: 'Expert' }
];

const AddSkillDialog: React.FC<AddSkillDialogProps> = ({
  isOpen,
  onClose,
  onSkillSaved,
  talentId,
  existingSkill,
  availableSkills
}) => {
  const [selectedSkillId, setSelectedSkillId] = useState<string>('');
  const [proficiencyLevel, setProficiencyLevel] = useState<string>('');
  const [yearsOfExperience, setYearsOfExperience] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset form when dialog opens/closes or when existing skill changes
  useEffect(() => {
    if (isOpen) {
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
    }
  }, [isOpen, existingSkill]);

  // Handle save skill mutation
  const saveSkillMutation = useMutation({
    mutationFn: async (data: {
      id?: string;
      talent_id: string;
      skill_id: string;
      proficiency_level?: string;
      years_of_experience?: number;
    }) => {
      if (existingSkill) {
        // Update existing skill
        const { error } = await supabase
          .from('talent_skills')
          .update({
            proficiency_level: data.proficiency_level,
            years_of_experience: data.years_of_experience
          })
          .eq('id', existingSkill.id);
          
        if (error) throw error;
        return existingSkill.id;
      } else {
        // Create new skill - use person_id as the talent_id
        const { data: newSkill, error } = await supabase
          .from('talent_skills')
          .insert({
            talent_id: data.talent_id,
            skill_id: data.skill_id,
            proficiency_level: data.proficiency_level,
            years_of_experience: data.years_of_experience
          })
          .select()
          .single();
          
        if (error) throw error;
        return newSkill.id;
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
    
    saveSkillMutation.mutate({
      talent_id: talentId,
      skill_id: selectedSkillId,
      proficiency_level: proficiencyLevel || undefined,
      years_of_experience: yearsOfExperience ? parseFloat(yearsOfExperience) : undefined
    });
  };

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
          <div className="space-y-2">
            <Label htmlFor="skill">Skill</Label>
            <Select 
              value={selectedSkillId} 
              onValueChange={setSelectedSkillId}
              disabled={!!existingSkill}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a skill" />
              </SelectTrigger>
              <SelectContent>
                {getFilteredSkills().map((skill) => (
                  <SelectItem key={skill.id} value={skill.id}>
                    {skill.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="proficiency">Proficiency Level</Label>
            <Select 
              value={proficiencyLevel} 
              onValueChange={setProficiencyLevel}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select proficiency level" />
              </SelectTrigger>
              <SelectContent>
                {proficiencyLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="years">Years of Experience</Label>
            <Input 
              id="years"
              type="number"
              step="0.5"
              min="0"
              placeholder="Years of experience with this skill"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedSkillId}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {existingSkill ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                existingSkill ? 'Update Skill' : 'Add Skill'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSkillDialog;
