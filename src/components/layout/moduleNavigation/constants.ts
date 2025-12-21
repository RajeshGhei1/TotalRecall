
import { 
  Briefcase,
  Users,
  BarChart3,
  MessageSquare,
  Brain,
  Settings,
  Zap,
  Shield,
  Building,
  DollarSign,
  Package,
  ShoppingCart,
  Headphones,
  FolderOpen,
  Truck,
  Target,
  TrendingUp,
  CheckCircle,
  GitBranch,
  BookOpen,
  Megaphone
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
  },
  
  // New Business Categories
  'sales': {
    name: 'Sales',
    icon: Target,
  },
  'marketing': {
    name: 'Marketing',
    icon: Megaphone,
  },
  'operations': {
    name: 'Operations',
    icon: Package,
  },
  'finance': {
    name: 'Finance',
    icon: DollarSign,
  },
  'commerce': {
    name: 'Commerce',
    icon: ShoppingCart,
  },
  'project_management': {
    name: 'Project Management',
    icon: FolderOpen,
  },
  'support': {
    name: 'Support',
    icon: Headphones,
  },
  'compliance': {
    name: 'Compliance',
    icon: CheckCircle,
  },
  'integration': {
    name: 'Integration',
    icon: GitBranch,
  },
  'knowledge': {
    name: 'Knowledge',
    icon: BookOpen,
  }
};

// Type configuration for module grouping by type
export const TYPE_CONFIG = {
  'super_admin': {
    name: 'Super Admin Apps',
    icon: Shield,
    description: 'System administration and platform management apps'
  },
  'foundation': {
    name: 'Foundation Apps',
    icon: Settings,
    description: 'Core platform apps that provide foundational capabilities'
  },
  'business': {
    name: 'Business Apps',
    icon: Building,
    description: 'Business functionality and specialized feature apps'
  }
};

// Module sub-components mapping - using normalized keys
export const MODULE_SUB_COMPONENTS = {
  'ats_core': [
    { name: 'Dashboard', path: '/superadmin/ats/dashboard' },
    { name: 'Jobs', path: '/superadmin/ats/jobs' },
    { name: 'Candidates', path: '/superadmin/ats/candidates' },
    { name: 'Pipeline', path: '/superadmin/ats/pipeline' },
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
