
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobId, candidateIds, tenantId } = await req.json();
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch job details
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobError) throw jobError;

    // Fetch candidate details
    const { data: candidates, error: candidatesError } = await supabase
      .from('candidates')
      .select('*')
      .in('id', candidateIds);

    if (candidatesError) throw candidatesError;

    const matchResults = [];

    for (const candidate of candidates) {
      const prompt = `
        Analyze the match between this job and candidate:

        JOB:
        Title: ${job.title}
        Description: ${job.description}
        Requirements: ${JSON.stringify(job.requirements)}
        Location: ${job.location}
        Department: ${job.department}
        Employment Type: ${job.employment_type}
        Salary Range: ${job.salary_min ? `$${job.salary_min} - $${job.salary_max}` : 'Not specified'}

        CANDIDATE:
        Name: ${candidate.first_name} ${candidate.last_name}
        Current Title: ${candidate.current_title}
        Current Company: ${candidate.current_company}
        Location: ${candidate.location}
        Experience: ${candidate.experience_years} years
        Skills: ${JSON.stringify(candidate.skills)}
        Resume Summary: ${candidate.ai_summary || 'Not available'}
        Desired Salary: ${candidate.desired_salary ? `$${candidate.desired_salary}` : 'Not specified'}

        Provide a detailed match analysis including:
        1. Overall match score (0-100)
        2. Skill alignment analysis
        3. Experience level match
        4. Location compatibility
        5. Salary expectations alignment
        6. Key strengths for this role
        7. Potential concerns or gaps
        8. Specific recommendations

        Format your response as JSON with this structure:
        {
          "matchScore": number,
          "skillAlignment": {
            "score": number,
            "matchingSkills": string[],
            "missingSkills": string[],
            "analysis": string
          },
          "experienceMatch": {
            "score": number,
            "analysis": string
          },
          "locationCompatibility": {
            "score": number,
            "analysis": string
          },
          "salaryAlignment": {
            "score": number,
            "analysis": string
          },
          "strengths": string[],
          "concerns": string[],
          "recommendations": string[],
          "summary": string
        }
      `;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are an expert talent acquisition specialist with deep knowledge of skills assessment, job matching, and recruitment best practices. Provide detailed, actionable insights.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
        }),
      });

      const aiData = await response.json();
      const matchAnalysis = JSON.parse(aiData.choices[0].message.content);

      matchResults.push({
        candidateId: candidate.id,
        candidate: {
          name: `${candidate.first_name} ${candidate.last_name}`,
          currentTitle: candidate.current_title,
          currentCompany: candidate.current_company,
          location: candidate.location,
          experienceYears: candidate.experience_years
        },
        matchAnalysis
      });
    }

    // Sort by match score descending
    matchResults.sort((a, b) => b.matchAnalysis.matchScore - a.matchAnalysis.matchScore);

    return new Response(JSON.stringify({ 
      jobId,
      jobTitle: job.title,
      matchResults,
      generatedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in smart-talent-matching function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
