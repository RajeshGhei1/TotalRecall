
import React from 'react';
import TalentList from '@/components/talent/TalentList';

interface TalentDatabaseProps {
  view?: 'search' | 'favorites' | 'recent' | 'analytics';
  showFilters?: boolean;
  allowAdd?: boolean;
}

const TalentDatabase: React.FC<TalentDatabaseProps> = (props) => {
  return <TalentList {...props} />;
};

// Module metadata for registration
(TalentDatabase as any).moduleMetadata = {
  id: 'talent-database',
  name: 'Talent Database',
  category: 'recruitment',
  version: '1.0.0',
  description: 'Comprehensive talent database with search, favorites, and analytics',
  author: 'System',
  requiredPermissions: ['read', 'write'],
  dependencies: ['ats-core'],
  props: {
    view: { type: 'string', options: ['search', 'favorites', 'recent', 'analytics'], default: 'search' },
    showFilters: { type: 'boolean', default: true },
    allowAdd: { type: 'boolean', default: true }
  }
};

export default TalentDatabase;
