
import { 
  Briefcase,
  Users,
  BarChart3,
  MessageSquare,
  Brain,
  Settings,
  Zap
} from 'lucide-react';

// Category configuration with icons and no descriptions
export const CATEGORY_CONFIG = {
  'recruitment': {
    name: 'Recruitment',
    icon: Briefcase,
  },
  'business': {
    name: 'Business',
    icon: Users,
  },
  'analytics': {
    name: 'Analytics',
    icon: BarChart3,
  },
  'communication': {
    name: 'Communication',
    icon: MessageSquare,
  },
  'ai_tools': {
    name: 'AI Tools',
    icon: Brain,
  },
  'core_system': {
    name: 'Core System',
    icon: Settings,
  },
  'ai_analytics': {
    name: 'AI-Analytics',
    icon: Zap,
  },
  'ai_automation': {
    name: 'AI-Automation',
    icon: Zap,
  },
  'ai_cognitive': {
    name: 'AI-Cognitive',
    icon: Zap,
  },
  'ai_core': {
    name: 'AI-Core',
    icon: Zap,
  },
  'ai_knowledge': {
    name: 'AI-Knowledge',
    icon: Zap,
  }
};

// Module sub-components mapping - using normalized keys
export const MODULE_SUB_COMPONENTS = {
  'ats_core': [
    { name: 'Jobs', path: '/superadmin/ats/jobs' },
    { name: 'Candidates', path: '/superadmin/ats/candidates' },
    { name: 'Applications', path: '/superadmin/ats/applications' },
    { name: 'Analytics', path: '/superadmin/ats/analytics' }
  ],
  'companies': [
    { name: 'Company Database', path: '/superadmin/companies' },
    { name: 'Relationships', path: '/superadmin/companies/relationships' },
    { name: 'Analytics', path: '/superadmin/companies/analytics' }
  ],
  'people': [
    { name: 'People Database', path: '/superadmin/people' },
    { name: 'Skills Management', path: '/superadmin/people/skills' },
    { name: 'Reporting', path: '/superadmin/people/reporting' }
  ]
};
