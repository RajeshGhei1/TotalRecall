
import { supabase } from '@/integrations/supabase/client';

// Utility function to ensure only one direct assignment per module/tenant
export const validateDirectAssignment = async (
  moduleId: string,
  tenantId: string | null,
  excludeId?: string
): Promise<boolean> => {
  let query = supabase
    .from('module_ai_assignments')
    .select('id')
    .eq('module_id', moduleId)
    .eq('assignment_type', 'direct')
    .eq('is_active', true);

  if (tenantId) {
    query = query.eq('tenant_id', tenantId);
  } else {
    query = query.is('tenant_id', null);
  }

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error validating direct assignment:', error);
    return false;
  }

  return (data?.length || 0) === 0;
};

// Utility function to get the next priority for preferred assignments
export const getNextPreferredPriority = async (
  moduleId: string,
  tenantId: string | null
): Promise<number> => {
  let query = supabase
    .from('module_ai_assignments')
    .select('priority')
    .eq('module_id', moduleId)
    .eq('assignment_type', 'preferred')
    .eq('is_active', true)
    .order('priority', { ascending: false })
    .limit(1);

  if (tenantId) {
    query = query.eq('tenant_id', tenantId);
  } else {
    query = query.is('tenant_id', null);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error getting next priority:', error);
    return 1;
  }

  return (data?.[0]?.priority || 0) + 1;
};
