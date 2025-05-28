
export const AVAILABLE_MODULES = [
  {
    name: 'job_posting',
    label: 'Job Posting',
    description: 'Create and manage job postings',
    defaultLimits: { max_active_jobs: 10 }
  },
  {
    name: 'application_management',
    label: 'Application Management',
    description: 'Track and manage job applications',
    defaultLimits: { max_applications_per_job: 100 }
  },
  {
    name: 'advanced_analytics',
    label: 'Advanced Analytics',
    description: 'Detailed reporting and insights',
    defaultLimits: {}
  },
  {
    name: 'custom_fields',
    label: 'Custom Fields',
    description: 'Create custom data fields',
    defaultLimits: { max_custom_fields: 20 }
  },
  {
    name: 'api_access',
    label: 'API Access',
    description: 'Access to REST APIs',
    defaultLimits: { requests_per_hour: 1000 }
  },
  {
    name: 'integration_marketplace',
    label: 'Integration Marketplace',
    description: 'Third-party integrations',
    defaultLimits: { max_integrations: 5 }
  },
  {
    name: 'interview_scheduling',
    label: 'Interview Scheduling',
    description: 'Schedule and manage interviews',
    defaultLimits: {}
  },
  {
    name: 'candidate_sourcing',
    label: 'Candidate Sourcing',
    description: 'AI-powered candidate sourcing',
    defaultLimits: { sourcing_credits: 100 }
  }
];
