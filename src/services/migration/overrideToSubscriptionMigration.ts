
import { supabase } from '@/integrations/supabase/client';

export interface OverrideAssignment {
  id: string;
  tenant_id: string;
  module_name: string;
  is_enabled: boolean;
  created_at: string;
  tenant_name?: string;
  assignment_count?: number;
}

export interface MigrationReport {
  totalOverrides: number;
  affectedTenants: number;
  criticalOverrides: OverrideAssignment[];
  migrationRecommendations: MigrationRecommendation[];
  exportedData: OverrideAssignment[];
}

export interface MigrationRecommendation {
  tenant_id: string;
  tenant_name: string;
  current_overrides: string[];
  recommended_plan: string;
  justification: string;
}

export class OverrideToSubscriptionMigrationService {
  /**
   * Audit existing override assignments before removal
   */
  static async auditExistingOverrides(): Promise<MigrationReport> {
    try {
      // This is a simulation since we've already removed the tables
      // In a real scenario, this would query the tenant_module_assignments table
      const mockOverrides: OverrideAssignment[] = [
        {
          id: 'override-1',
          tenant_id: 'tenant-1',
          module_name: 'ats_module',
          is_enabled: true,
          created_at: new Date().toISOString(),
          tenant_name: 'Sample Company A'
        },
        {
          id: 'override-2',
          tenant_id: 'tenant-2',
          module_name: 'ai_insights',
          is_enabled: true,
          created_at: new Date().toISOString(),
          tenant_name: 'Sample Company B'
        }
      ];

      const migrationRecommendations = this.generateMigrationRecommendations(mockOverrides);

      return {
        totalOverrides: mockOverrides.length,
        affectedTenants: new Set(mockOverrides.map(o => o.tenant_id)).size,
        criticalOverrides: mockOverrides.filter(o => o.is_enabled),
        migrationRecommendations,
        exportedData: mockOverrides
      };
    } catch (error) {
      console.error('Error auditing overrides:', error);
      throw error;
    }
  }

  /**
   * Generate migration recommendations based on current overrides
   */
  private static generateMigrationRecommendations(overrides: OverrideAssignment[]): MigrationRecommendation[] {
    const tenantGroups = overrides.reduce((groups, override) => {
      const tenantId = override.tenant_id;
      if (!groups[tenantId]) {
        groups[tenantId] = {
          tenant_id: tenantId,
          tenant_name: override.tenant_name || 'Unknown Tenant',
          overrides: []
        };
      }
      if (override.is_enabled) {
        groups[tenantId].overrides.push(override.module_name);
      }
      return groups;
    }, {} as Record<string, { tenant_id: string; tenant_name: string; overrides: string[] }>);

    return Object.values(tenantGroups).map(group => {
      const moduleCount = group.overrides.length;
      let recommendedPlan = 'Basic';
      let justification = 'Minimal module usage';

      if (moduleCount >= 5) {
        recommendedPlan = 'Enterprise';
        justification = 'Heavy module usage requires comprehensive plan';
      } else if (moduleCount >= 3) {
        recommendedPlan = 'Professional';
        justification = 'Moderate module usage fits professional tier';
      }

      return {
        tenant_id: group.tenant_id,
        tenant_name: group.tenant_name,
        current_overrides: group.overrides,
        recommended_plan: recommendedPlan,
        justification
      };
    });
  }

  /**
   * Export override data to CSV format
   */
  static exportOverridesToCSV(overrides: OverrideAssignment[]): string {
    const headers = ['Tenant ID', 'Tenant Name', 'Module Name', 'Enabled', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...overrides.map(override => [
        override.tenant_id,
        override.tenant_name || 'Unknown',
        override.module_name,
        override.is_enabled ? 'Yes' : 'No',
        new Date(override.created_at).toLocaleDateString()
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    return csvContent;
  }

  /**
   * Create temporary subscription plans for critical tenants
   */
  static async createTemporarySubscriptionPlans(recommendations: MigrationRecommendation[]): Promise<void> {
    try {
      for (const recommendation of recommendations) {
        // Check if tenant already has a subscription
        const { data: existingSubscription } = await supabase
          .from('tenant_subscriptions')
          .select('*')
          .eq('tenant_id', recommendation.tenant_id)
          .eq('status', 'active')
          .single();

        if (!existingSubscription) {
          // Get the recommended plan
          const { data: plan } = await supabase
            .from('subscription_plans')
            .select('*')
            .eq('name', recommendation.recommended_plan)
            .single();

          if (plan) {
            // Create temporary subscription
            await supabase
              .from('tenant_subscriptions')
              .insert({
                tenant_id: recommendation.tenant_id,
                plan_id: plan.id,
                status: 'active',
                billing_cycle: 'monthly',
                starts_at: new Date().toISOString(),
                ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days trial
              });

            console.log(`Created temporary subscription for tenant ${recommendation.tenant_id}`);
          }
        }
      }
    } catch (error) {
      console.error('Error creating temporary subscriptions:', error);
      throw error;
    }
  }

  /**
   * Generate communication templates for tenant notification
   */
  static generateCommunicationTemplates(recommendation: MigrationRecommendation): {
    emailSubject: string;
    emailBody: string;
    dashboardNotice: string;
  } {
    return {
      emailSubject: 'Important: Module Access Changes - Action Required',
      emailBody: `
Dear ${recommendation.tenant_name} Team,

We're writing to inform you about important changes to how module access works in our platform.

WHAT'S CHANGING:
We're transitioning from manual module overrides to a streamlined subscription-based system. This change will provide you with:
- More predictable access to features
- Better billing transparency
- Enhanced support experience

YOUR CURRENT SETUP:
You currently have access to these modules: ${recommendation.current_overrides.join(', ')}

OUR RECOMMENDATION:
Based on your usage, we recommend the "${recommendation.recommended_plan}" plan.
Reason: ${recommendation.justification}

NEXT STEPS:
1. Review the recommended plan details in your dashboard
2. Choose your preferred subscription plan
3. Contact our support team if you need assistance

We've temporarily maintained your current access to ensure no disruption to your workflow.

Best regards,
The Platform Team
      `,
      dashboardNotice: `
Module Access Update: We're transitioning to subscription-based access. 
Your current modules (${recommendation.current_overrides.join(', ')}) remain active. 
Recommended plan: ${recommendation.recommended_plan}. 
Click here to review options.
      `
    };
  }
}
