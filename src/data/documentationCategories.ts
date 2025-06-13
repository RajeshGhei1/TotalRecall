
import { Zap, Shield, Building, Code, Users, Brain, Settings, Database, FileText } from 'lucide-react';
import type { DocumentCategory, PriorityLevel } from './documentationData';

export const documentCategories: DocumentCategory[] = [
  { id: 'all', label: 'All Categories', count: 18 },
  { id: 'ats', label: 'ATS Training', count: 5, icon: Users },
  { id: 'ai', label: 'AI & Intelligence', count: 4, icon: Zap },
  { id: 'architecture', label: 'System Architecture', count: 3, icon: Code },
  { id: 'modules', label: 'Module System', count: 2, icon: Settings },
  { id: 'security', label: 'Security & Compliance', count: 1, icon: Shield },
  { id: 'api', label: 'API & Integration', count: 1, icon: Database },
  { id: 'enterprise', label: 'Enterprise Features', count: 1, icon: Building },
  { id: 'workflow', label: 'Workflow & Automation', count: 1, icon: Users }
];

export const priorityLevels: PriorityLevel[] = [
  { id: 'all', label: 'All Levels' },
  { id: 'critical', label: 'Critical', count: 9 },
  { id: 'high', label: 'High', count: 6 },
  { id: 'medium', label: 'Medium', count: 3 }
];

export const documentTypes = [
  { id: 'all', label: 'All Types' },
  { id: 'guide', label: 'User Guide', count: 4 },
  { id: 'reference', label: 'Reference', count: 5 },
  { id: 'tutorial', label: 'Tutorial', count: 3 },
  { id: 'api', label: 'API Documentation', count: 6 }
];

export const difficultyLevels = [
  { id: 'all', label: 'All Levels' },
  { id: 'beginner', label: 'Beginner', count: 6 },
  { id: 'intermediate', label: 'Intermediate', count: 8 },
  { id: 'advanced', label: 'Advanced', count: 4 }
];
