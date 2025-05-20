
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fetchTalentSkills } from '@/services/talentService';
import { Skeleton } from '@/components/ui/skeleton';

interface TalentSkillsSectionProps {
  talentId: string;
}

const TalentSkillsSection: React.FC<TalentSkillsSectionProps> = ({ talentId }) => {
  const { data: talentSkills, isLoading } = useQuery({
    queryKey: ['talentSkills', talentId],
    queryFn: () => fetchTalentSkills(talentId),
    enabled: !!talentId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Skills</h3>
          <div className="space-y-3">
            <Skeleton className="h-6 w-1/4" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!talentSkills || talentSkills.length === 0) {
    return null;
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
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {talentSkills.map((skill) => (
            <div key={skill.id} className="flex items-center space-x-1">
              <Badge 
                variant="outline" 
                className={`${getProficiencyColor(skill.proficiency_level)} flex items-center gap-1`}
              >
                <span>{skill.skill?.name}</span>
                {skill.proficiency_level && (
                  <span className="text-xs opacity-80">• {skill.proficiency_level}</span>
                )}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TalentSkillsSection;
