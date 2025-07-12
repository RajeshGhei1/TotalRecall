
export interface Job {
  id: string;
  title: string;
  description?: string;
  requirements: string[];
  location?: string;
  department?: string;
  employment_type: string;
  salary_min?: number;
  salary_max?: number;
  status: 'draft' | 'active' | 'paused' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  hiring_manager_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  closes_at?: string;
  tenant_id?: string;
}

export interface Candidate {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  resume_url?: string;
  resume_text?: string;
  skills: string[];
  experience_years?: number;
  current_title?: string;
  current_company?: string;
  desired_salary?: number;
  availability_date?: string;
  notes?: string;
  tags: string[];
  ai_summary?: string;
  created_at: string;
  updated_at: string;
  tenant_id?: string;
}

export interface Application {
  id: string;
  job_id: string;
  candidate_id: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  applied_at: string;
  cover_letter?: string;
  ai_match_score?: number;
  ai_match_reasons: string[];
  recruiter_notes?: string;
  interview_feedback: Record<string, unknown>[];
  next_action?: string;
  next_action_date?: string;
  created_at: string;
  updated_at: string;
  tenant_id?: string;
  // Relations
  job?: Job;
  candidate?: Candidate;
}

export interface Interview {
  id: string;
  application_id: string;
  interviewer_id?: string;
  type: 'phone' | 'video' | 'onsite' | 'technical';
  scheduled_at: string;
  duration_minutes: number;
  location?: string;
  meeting_link?: string;
  notes?: string;
  feedback: Record<string, unknown>;
  score?: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CandidateTag {
  id: string;
  name: string;
  color: string;
  description?: string;
  created_at: string;
}

export interface ATSFilters {
  search?: string;
  status?: string[];
  location?: string[];
  experience?: string;
  skills?: string[];
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}
