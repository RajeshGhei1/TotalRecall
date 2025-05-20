
import { supabase } from "@/integrations/supabase/client";
import { Talent, Skill, TalentSkill } from "@/types/talent";

export const fetchTalents = async (): Promise<Talent[]> => {
  const { data, error } = await supabase
    .from('talents')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const fetchTalentsByExperience = async () => {
  const { data, error } = await supabase
    .from('talents')
    .select('years_of_experience')
    .not('years_of_experience', 'is', null);
    
  if (error) throw error;

  // Group by experience level
  const groupedData = data.reduce((acc: Record<string, number>, item) => {
    const experienceLevel = getExperienceLevel(item.years_of_experience!);
    acc[experienceLevel] = (acc[experienceLevel] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(groupedData).map(([name, value]) => ({ name, value }));
};

export const fetchTalentsByLocation = async () => {
  const { data, error } = await supabase
    .from('talents')
    .select('location')
    .not('location', 'is', null);
    
  if (error) throw error;

  // Group by location
  const groupedData = data.reduce((acc: Record<string, number>, item) => {
    const location = item.location!;
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(groupedData).map(([name, value]) => ({ name, value }));
};

export const fetchTalentsBySalary = async () => {
  const { data, error } = await supabase
    .from('talents')
    .select('current_salary')
    .not('current_salary', 'is', null);
    
  if (error) throw error;

  // Group by salary bands
  const groupedData = data.reduce((acc: Record<string, number>, item) => {
    const salaryBand = getSalaryBand(item.current_salary!);
    acc[salaryBand] = (acc[salaryBand] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(groupedData).map(([name, value]) => ({ name, value }));
};

export const fetchTalentsBySkill = async () => {
  const { data, error } = await supabase
    .from('talent_skills')
    .select(`
      skill_id,
      skills:skill_id (
        name
      )
    `);
    
  if (error) throw error;

  // Group by skill
  const groupedData = data.reduce((acc: Record<string, number>, item) => {
    const skillName = item.skills?.name || 'Unknown';
    acc[skillName] = (acc[skillName] || 0) + 1;
    return acc;
  }, {});

  // Sort by count and take top skills
  return Object.entries(groupedData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, value]) => ({ name, value }));
};

export const fetchSkills = async (): Promise<Skill[]> => {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data || [];
};

export const fetchTalentSkills = async (personId: string): Promise<TalentSkill[]> => {
  const { data, error } = await supabase
    .from('talent_skills')
    .select(`
      *,
      skill:skill_id (*)
    `)
    .eq('talent_id', personId);
  
  if (error) throw error;
  return data || [];
};

// Helper functions

function getExperienceLevel(years: number): string {
  if (years < 2) return 'Junior (0-1 years)';
  if (years < 5) return 'Mid-level (2-4 years)';
  if (years < 8) return 'Senior (5-7 years)';
  if (years < 12) return 'Lead (8-11 years)';
  return 'Principal (12+ years)';
}

function getSalaryBand(salary: number): string {
  if (salary < 60000) return 'Under $60k';
  if (salary < 80000) return '$60k-$80k';
  if (salary < 100000) return '$80k-$100k';
  if (salary < 120000) return '$100k-$120k';
  if (salary < 150000) return '$120k-$150k';
  return '$150k+';
}
