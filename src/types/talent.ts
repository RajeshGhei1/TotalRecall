
export interface Talent {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  location?: string | null;
  years_of_experience?: number | null;
  current_salary?: number | null;
  desired_salary?: number | null;
  availability_status?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category?: string | null;
  created_at: string;
}

export interface TalentSkill {
  id: string;
  talent_id: string;
  skill_id: string;
  proficiency_level?: string | null;
  years_of_experience?: number | null;
  created_at: string;
  skill?: Skill;
}
