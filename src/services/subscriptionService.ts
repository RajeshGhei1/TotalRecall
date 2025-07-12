
import { supabase } from '@/integrations/supabase/client';
import { ResolvedSubscription, UserSubscription, TenantSubscription } from '@/types/subscription-types';

export class SubscriptionService {
  /**
   * Resolves the active subscription for a user in a tenant
   * User-level subscriptions take priority over tenant-level subscriptions
   */
  static async resolveUserSubscription(userId: string, tenantId: string): Promise<ResolvedSubscription | null> {
    try {
      const { data, error } = await supabase.rpc('resolve_user_subscription', {
        p_user_id: userId,
        p_tenant_id: tenantId
      });

      if (error) throw error;
      if (!data || data.length === 0) return null;

      return data[0] as ResolvedSubscription;
    } catch (error) {
      console.error('Error resolving user subscription:', error);
      return null;
    }
  }

  /**
   * Get all user subscriptions for a tenant with user profile information
   */
  static async getUserSubscriptionsForTenant(tenantId: string): Promise<UserSubscription[]> {
    try {
      const { data, error } = await (supabase as unknown)
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans(*),
          profiles!user_subscriptions_user_id_fkey(id, email, full_name)
        `)
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user subscriptions:', error);
      return [];
    }
  }

  /**
   * Create a user subscription
   */
  static async createUserSubscription(subscription: Omit<UserSubscription, 'id' | 'created_at' | 'updated_at'>): Promise<UserSubscription | null> {
    try {
      const { data, error } = await (supabase as unknown)
        .from('user_subscriptions')
        .insert([subscription])
        .select(`
          *,
          subscription_plans(*),
          profiles!user_subscriptions_user_id_fkey(id, email, full_name)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating user subscription:', error);
      return null;
    }
  }

  /**
   * Update a user subscription
   */
  static async updateUserSubscription(id: string, updates: Partial<UserSubscription>): Promise<UserSubscription | null> {
    try {
      const { data, error } = await (supabase as unknown)
        .from('user_subscriptions')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          subscription_plans(*),
          profiles!user_subscriptions_user_id_fkey(id, email, full_name)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user subscription:', error);
      return null;
    }
  }

  /**
   * Delete a user subscription
   */
  static async deleteUserSubscription(id: string): Promise<boolean> {
    try {
      const { error } = await (supabase as unknown)
        .from('user_subscriptions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting user subscription:', error);
      return false;
    }
  }

  /**
   * Get subscription overview for a tenant showing mixed scenarios
   */
  static async getTenantSubscriptionOverview(tenantId: string) {
    try {
      // Get tenant subscription
      const { data: tenantSub, error: tenantError } = await (supabase as unknown)
        .from('tenant_subscriptions')
        .select(`
          *,
          subscription_plans(*)
        `)
        .eq('tenant_id', tenantId)
        .eq('status', 'active')
        .single();

      if (tenantError && tenantError.code !== 'PGRST116') throw tenantError;

      // Get all user subscriptions for the tenant
      const userSubscriptions = await this.getUserSubscriptionsForTenant(tenantId);

      // Get all users in the tenant - fix the ambiguous relationship
      const { data: tenantUsers, error: usersError } = await (supabase as unknown)
        .from('user_tenants')
        .select(`
          user_id,
          profiles!user_tenants_user_id_fkey(id, email, full_name)
        `)
        .eq('tenant_id', tenantId);

      if (usersError) throw usersError;

      return {
        tenantSubscription: tenantSub as TenantSubscription,
        userSubscriptions,
        tenantUsers: tenantUsers || [],
        totalUsers: (tenantUsers || []).length,
        usersWithIndividualPlans: userSubscriptions.filter(sub => sub.status === 'active').length
      };
    } catch (error) {
      console.error('Error getting tenant subscription overview:', error);
      return null;
    }
  }
}
