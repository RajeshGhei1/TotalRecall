
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Crown, ArrowRight } from 'lucide-react';
import { useUnifiedModuleAccess } from '@/hooks/subscriptions/useUnifiedModuleAccess';
import UnifiedModuleAccessGuard from './UnifiedModuleAccessGuard';

interface ModuleAccessGuardProps {
  children: React.ReactNode;
  moduleName: string;
  tenantId: string | null;
  fallback?: React.ReactNode;
}

/**
 * @deprecated Use UnifiedModuleAccessGuard instead for better access control
 */
const ModuleAccessGuard: React.FC<ModuleAccessGuardProps> = (props) => {
  // For backward compatibility, redirect to the new unified component
  return <UnifiedModuleAccessGuard {...props} />;
};

export default ModuleAccessGuard;
