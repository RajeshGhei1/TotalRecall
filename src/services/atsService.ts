
import { supabase } from '@/integrations/supabase/client';
import { Job, Candidate, Application, Interview, CandidateTag, ATSFilters } from '@/types/ats';

class ATSService {
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
    return data || [];
  }

  async createJob(job: Partial<Job>): Promise<Job> {
    const { data, error } = await supabase
      .from('jobs')
      .insert([job])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateJob(id: string, updates: Partial<Job>): Promise<Job> {
    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
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
    return data || [];
  }

  async createCandidate(candidate: Partial<Candidate>): Promise<Candidate> {
    const { data, error } = await supabase
      .from('candidates')
      .insert([candidate])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateCandidate(id: string, updates: Partial<Candidate>): Promise<Candidate> {
    const { data, error } = await supabase
      .from('candidates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
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
      query = query.in('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async createApplication(application: Partial<Application>): Promise<Application> {
    const { data, error } = await supabase
      .from('applications')
      .insert([application])
      .select(`
        *,
        job:jobs(*),
        candidate:candidates(*)
      `)
      .single();

    if (error) throw error;
    return data;
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
    return data;
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

      // Simple matching algorithm (can be enhanced with AI)
      const candidate = candidateData.data;
      const job = jobData.data;
      
      let score = 0;
      const factors = [];

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
      factors.push(`Skills match: ${skillMatches.length}/${jobRequirements.length} (${skillScore.toFixed(1)} points)`);

      // Experience matching
      if (candidate.experience_years && candidate.experience_years >= 1) {
        const expScore = Math.min(candidate.experience_years * 3, 30);
        score += expScore;
        factors.push(`Experience: ${candidate.experience_years} years (${expScore.toFixed(1)} points)`);
      }

      // Location matching
      if (candidate.location && job.location && 
          candidate.location.toLowerCase().includes(job.location.toLowerCase())) {
        score += 20;
        factors.push('Location match (+20 points)');
      }

      // Title relevance
      if (candidate.current_title && job.title &&
          candidate.current_title.toLowerCase().includes(job.title.toLowerCase().split(' ')[0])) {
        score += 10;
        factors.push('Title relevance (+10 points)');
      }

      return Math.min(Math.round(score), 100);
    } catch (error) {
      console.error('Error calculating match score:', error);
      return 0;
    }
  }
}

export const atsService = new ATSService();
