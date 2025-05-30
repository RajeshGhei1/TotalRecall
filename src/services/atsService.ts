
import { supabase } from '@/integrations/supabase/client';
import { Job, Candidate, Application, Interview, CandidateTag, ATSFilters } from '@/types/ats';

class ATSService {
  // Helper function to safely convert Json to string array
  private jsonToStringArray(json: any): string[] {
    if (Array.isArray(json)) {
      return json.filter(item => typeof item === 'string');
    }
    if (typeof json === 'string') {
      try {
        const parsed = JSON.parse(json);
        return Array.isArray(parsed) ? parsed.filter(item => typeof item === 'string') : [];
      } catch {
        return [];
      }
    }
    return [];
  }

  // Helper function to convert database job to Job interface
  private convertDbJobToJob(dbJob: any): Job {
    return {
      ...dbJob,
      requirements: this.jsonToStringArray(dbJob.requirements)
    };
  }

  // Helper function to convert database candidate to Candidate interface
  private convertDbCandidateToCandidate(dbCandidate: any): Candidate {
    return {
      ...dbCandidate,
      skills: this.jsonToStringArray(dbCandidate.skills),
      tags: this.jsonToStringArray(dbCandidate.tags)
    };
  }

  // Helper function to convert database application to Application interface
  private convertDbApplicationToApplication(dbApplication: any): Application {
    return {
      ...dbApplication,
      ai_match_reasons: this.jsonToStringArray(dbApplication.ai_match_reasons),
      interview_feedback: Array.isArray(dbApplication.interview_feedback) ? dbApplication.interview_feedback : [],
      job: dbApplication.job ? this.convertDbJobToJob(dbApplication.job) : undefined,
      candidate: dbApplication.candidate ? this.convertDbCandidateToCandidate(dbApplication.candidate) : undefined
    };
  }

  // Jobs
  async getJobs(tenantId?: string): Promise<Job[]> {
    let query = supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(job => this.convertDbJobToJob(job));
  }

  async createJob(job: Partial<Job>): Promise<Job> {
    const jobData = {
      title: job.title || '',
      description: job.description,
      requirements: JSON.stringify(job.requirements || []),
      location: job.location,
      department: job.department,
      employment_type: job.employment_type || 'full-time',
      salary_min: job.salary_min,
      salary_max: job.salary_max,
      status: job.status || 'draft',
      priority: job.priority || 'medium',
      hiring_manager_id: job.hiring_manager_id,
      created_by: job.created_by,
      closes_at: job.closes_at,
      tenant_id: job.tenant_id
    };

    const { data, error } = await supabase
      .from('jobs')
      .insert([jobData])
      .select()
      .single();

    if (error) throw error;
    return this.convertDbJobToJob(data);
  }

  async updateJob(id: string, updates: Partial<Job>): Promise<Job> {
    const updateData = {
      ...updates,
      requirements: updates.requirements ? JSON.stringify(updates.requirements) : undefined
    };

    const { data, error } = await supabase
      .from('jobs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.convertDbJobToJob(data);
  }

  // Candidates
  async getCandidates(filters?: ATSFilters, tenantId?: string): Promise<Candidate[]> {
    let query = supabase
      .from('candidates')
      .select('*')
      .order('created_at', { ascending: false });

    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    if (filters?.search) {
      query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    if (filters?.location?.length) {
      query = query.in('location', filters.location);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(candidate => this.convertDbCandidateToCandidate(candidate));
  }

  async createCandidate(candidate: Partial<Candidate>): Promise<Candidate> {
    const candidateData = {
      first_name: candidate.first_name || '',
      last_name: candidate.last_name || '',
      email: candidate.email || '',
      phone: candidate.phone,
      location: candidate.location,
      linkedin_url: candidate.linkedin_url,
      portfolio_url: candidate.portfolio_url,
      resume_url: candidate.resume_url,
      resume_text: candidate.resume_text,
      skills: JSON.stringify(candidate.skills || []),
      experience_years: candidate.experience_years,
      current_title: candidate.current_title,
      current_company: candidate.current_company,
      desired_salary: candidate.desired_salary,
      availability_date: candidate.availability_date,
      notes: candidate.notes,
      tags: JSON.stringify(candidate.tags || []),
      ai_summary: candidate.ai_summary,
      tenant_id: candidate.tenant_id
    };

    const { data, error } = await supabase
      .from('candidates')
      .insert([candidateData])
      .select()
      .single();

    if (error) throw error;
    return this.convertDbCandidateToCandidate(data);
  }

  async updateCandidate(id: string, updates: Partial<Candidate>): Promise<Candidate> {
    const updateData = {
      ...updates,
      skills: updates.skills ? JSON.stringify(updates.skills) : undefined,
      tags: updates.tags ? JSON.stringify(updates.tags) : undefined
    };

    const { data, error } = await supabase
      .from('candidates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.convertDbCandidateToCandidate(data);
  }

  // Applications
  async getApplications(filters?: ATSFilters, tenantId?: string): Promise<Application[]> {
    let query = supabase
      .from('applications')
      .select(`
        *,
        job:jobs(*),
        candidate:candidates(*)
      `)
      .order('applied_at', { ascending: false });

    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    if (filters?.status?.length) {
      // Type cast to ensure compatibility
      const statusFilters = filters.status as ("applied" | "screening" | "interview" | "offer" | "hired" | "rejected")[];
      query = query.in('status', statusFilters);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(application => this.convertDbApplicationToApplication(application));
  }

  async createApplication(application: Partial<Application>): Promise<Application> {
    const applicationData = {
      job_id: application.job_id || '',
      candidate_id: application.candidate_id || '',
      status: application.status || 'applied',
      applied_at: application.applied_at || new Date().toISOString(),
      cover_letter: application.cover_letter,
      ai_match_score: application.ai_match_score,
      ai_match_reasons: JSON.stringify(application.ai_match_reasons || []),
      recruiter_notes: application.recruiter_notes,
      interview_feedback: JSON.stringify(application.interview_feedback || []),
      next_action: application.next_action,
      next_action_date: application.next_action_date,
      tenant_id: application.tenant_id
    };

    const { data, error } = await supabase
      .from('applications')
      .insert([applicationData])
      .select(`
        *,
        job:jobs(*),
        candidate:candidates(*)
      `)
      .single();

    if (error) throw error;
    return this.convertDbApplicationToApplication(data);
  }

  async updateApplicationStatus(id: string, status: Application['status'], notes?: string): Promise<Application> {
    const updates: any = { status };
    if (notes) {
      updates.recruiter_notes = notes;
    }

    const { data, error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        job:jobs(*),
        candidate:candidates(*)
      `)
      .single();

    if (error) throw error;
    return this.convertDbApplicationToApplication(data);
  }

  // Interviews
  async getInterviews(applicationId?: string): Promise<Interview[]> {
    let query = supabase
      .from('interviews')
      .select('*')
      .order('scheduled_at', { ascending: true });

    if (applicationId) {
      query = query.eq('application_id', applicationId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async scheduleInterview(interview: Partial<Interview>): Promise<Interview> {
    const interviewData = {
      application_id: interview.application_id || '',
      interviewer_id: interview.interviewer_id,
      type: interview.type || 'phone',
      scheduled_at: interview.scheduled_at || new Date().toISOString(),
      duration_minutes: interview.duration_minutes || 60,
      location: interview.location,
      meeting_link: interview.meeting_link,
      notes: interview.notes,
      feedback: JSON.stringify(interview.feedback || {}),
      score: interview.score,
      status: interview.status || 'scheduled'
    };

    const { data, error } = await supabase
      .from('interviews')
      .insert([interviewData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Tags
  async getCandidateTags(): Promise<CandidateTag[]> {
    const { data, error } = await supabase
      .from('candidate_tags')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async createCandidateTag(tag: Partial<CandidateTag>): Promise<CandidateTag> {
    const { data, error } = await supabase
      .from('candidate_tags')
      .insert([tag])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // AI-powered matching
  async calculateMatchScore(candidateId: string, jobId: string): Promise<number> {
    try {
      // Get candidate and job data
      const [candidateData, jobData] = await Promise.all([
        supabase.from('candidates').select('*').eq('id', candidateId).single(),
        supabase.from('jobs').select('*').eq('id', jobId).single()
      ]);

      if (candidateData.error || jobData.error) {
        throw new Error('Failed to fetch candidate or job data');
      }

      // Convert database objects to proper types
      const candidate = this.convertDbCandidateToCandidate(candidateData.data);
      const job = this.convertDbJobToJob(jobData.data);
      
      let score = 0;

      // Skills matching
      const candidateSkills = candidate.skills || [];
      const jobRequirements = job.requirements || [];
      const skillMatches = candidateSkills.filter((skill: string) => 
        jobRequirements.some((req: string) => 
          req.toLowerCase().includes(skill.toLowerCase())
        )
      );
      const skillScore = (skillMatches.length / Math.max(jobRequirements.length, 1)) * 40;
      score += skillScore;

      // Experience matching
      if (candidate.experience_years && candidate.experience_years >= 1) {
        const expScore = Math.min(candidate.experience_years * 3, 30);
        score += expScore;
      }

      // Location matching
      if (candidate.location && job.location && 
          candidate.location.toLowerCase().includes(job.location.toLowerCase())) {
        score += 20;
      }

      // Title relevance
      if (candidate.current_title && job.title &&
          candidate.current_title.toLowerCase().includes(job.title.toLowerCase().split(' ')[0])) {
        score += 10;
      }

      return Math.min(Math.round(score), 100);
    } catch (error) {
      console.error('Error calculating match score:', error);
      return 0;
    }
  }
}

export const atsService = new ATSService();
