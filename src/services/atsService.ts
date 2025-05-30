
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
    const { data, error } = await supabase
      .from('jobs')
      .insert([{
        ...job,
        requirements: JSON.stringify(job.requirements || [])
      }])
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
    const { data, error } = await supabase
      .from('candidates')
      .insert([{
        ...candidate,
        skills: JSON.stringify(candidate.skills || []),
        tags: JSON.stringify(candidate.tags || [])
      }])
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
    const { data, error } = await supabase
      .from('applications')
      .insert([{
        ...application,
        ai_match_reasons: JSON.stringify(application.ai_match_reasons || []),
        interview_feedback: JSON.stringify(application.interview_feedback || [])
      }])
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
    const { data, error } = await supabase
      .from('interviews')
      .insert([interview])
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
