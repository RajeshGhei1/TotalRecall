
import React from 'react';
import { Skill } from '@/types/talent';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SkillFormProps {
  selectedSkillId: string;
  onSkillChange: (value: string) => void;
  proficiencyLevel: string;
  onProficiencyChange: (value: string) => void;
  yearsOfExperience: string;
  onYearsChange: (value: string) => void;
  availableSkills: Skill[];
  existingSkill: boolean;
}

export const proficiencyLevels = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
  { value: 'Expert', label: 'Expert' }
];

const SkillForm: React.FC<SkillFormProps> = ({
  selectedSkillId,
  onSkillChange,
  proficiencyLevel,
  onProficiencyChange,
  yearsOfExperience,
  onYearsChange,
  availableSkills,
  existingSkill
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="skill">Skill</Label>
        <Select 
          value={selectedSkillId} 
          onValueChange={onSkillChange}
          disabled={existingSkill}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a skill" />
          </SelectTrigger>
          <SelectContent>
            {availableSkills.map((skill) => (
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
          onValueChange={onProficiencyChange}
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
          onChange={(e) => onYearsChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SkillForm;
