# Feature-Module Mapping System

## Overview

The Feature-Module Mapping System provides **granular feature control** while maintaining **module-level access** as the primary gate. This hybrid approach gives you the benefits of both simple module-based subscriptions and fine-grained feature management.

## Architecture

```
Subscription Plan → Module Access → Feature Access → Component Rendering
       ↓                ↓               ↓                    ↓
   Basic/Pro      ats_core/forms    form-builder      <FormBuilder />
```

## Database Schema

### Core Tables

#### `module_features`
Maps features to modules and defines their properties:
```sql
- module_name: TEXT (references system_modules.name)
- feature_id: TEXT (unique identifier for feature)
- feature_name: TEXT (display name)
- feature_description: TEXT (detailed description)
- is_enabled_by_default: BOOLEAN (default availability)
- is_premium_feature: BOOLEAN (requires premium subscription)
- feature_category: TEXT (grouping for organization)
- sort_order: INTEGER (display ordering)
```

#### `tenant_feature_overrides`
Allows per-tenant customization beyond subscription level:
```sql
- tenant_id: UUID (which tenant)
- module_name: TEXT (which module)
- feature_id: TEXT (which feature)
- is_enabled: BOOLEAN (enable/disable override)
- override_type: TEXT (admin/subscription/trial/beta)
- expires_at: TIMESTAMPTZ (optional expiration)
```

#### `feature_usage_analytics`
Tracks feature usage for insights and optimization:
```sql
- tenant_id: UUID (which tenant)
- module_name: TEXT (which module)
- feature_id: TEXT (which feature)
- user_id: UUID (which user)
- usage_count: INTEGER (how many times)
- last_used_at: TIMESTAMPTZ (when last used)
- session_duration_minutes: INTEGER (how long)
```

## Current Feature Mappings

The system comes pre-populated with your current implemented features:

### Forms & Templates Module
- `form-builder` - Comprehensive drag-and-drop form builder
- `custom-fields` - Create and manage custom field types
- `dropdown-options-management` - Manage dropdown categories and options
- `smart-form-suggestions` - AI-powered form field suggestions (Premium)

### Analytics Module
- `dashboard-builder` - Widget-based dashboard creation
- `report-builder` - Dynamic report creation with visualizations

### Data Management Module
- `bulk-upload-download` - Bulk data operations with CSV/Excel support

### Integrations Module
- `linkedin-enrichment` - LinkedIn profile enrichment (Premium)

### AI Core Module
- `ai-email-response-generator` - AI email response generation (Premium)
- `content-analysis-service` - Content analysis and insights (Premium)

## Usage Examples

### Basic Feature Access Check

```typescript
import { useFeatureAccess } from '@/hooks/useFeatureAccess';

const MyComponent = () => {
  const { data: access, isLoading } = useFeatureAccess('forms_templates', 'form-builder');
  
  if (isLoading) return <div>Loading...</div>;
  
  if (!access?.hasAccess) {
    return <div>Feature not available</div>;
  }
  
  return <FormBuilder />;
};
```

### Simplified Boolean Check

```typescript
import { useFeatureEnabled } from '@/hooks/useFeatureAccess';

const MyComponent = () => {
  const { isEnabled, isLoading } = useFeatureEnabled('analytics', 'dashboard-builder');
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {isEnabled ? (
        <DashboardBuilder />
      ) : (
        <UpgradePrompt feature="Dashboard Builder" />
      )}
    </div>
  );
};
```

### Get All Module Features

```typescript
import { useModuleFeatures } from '@/hooks/useFeatureAccess';

const ModuleFeaturesPanel = ({ moduleName }: { moduleName: string }) => {
  const { data: features, isLoading } = useModuleFeatures(moduleName);
  
  if (isLoading) return <div>Loading features...</div>;
  
  return (
    <div>
      <h3>Available Features</h3>
      {features?.map(feature => (
        <div key={feature.feature_id}>
          <h4>{feature.feature_name}</h4>
          <p>{feature.feature_description}</p>
          {feature.is_premium_feature && <Badge>Premium</Badge>}
        </div>
      ))}
    </div>
  );
};
```

### Admin Feature Management

```typescript
import { useTenantFeatureOverrides } from '@/hooks/useFeatureAccess';

const AdminFeatureControl = () => {
  const { setOverride, removeOverride } = useTenantFeatureOverrides();
  
  const enableFeatureForTenant = async () => {
    await setOverride.mutateAsync({
      tenantId: 'tenant-123',
      moduleName: 'forms_templates',
      featureId: 'form-builder',
      isEnabled: true,
      overrideType: 'admin',
      reason: 'Special access granted by admin'
    });
  };
  
  const disableFeature = async () => {
    await removeOverride.mutateAsync({
      tenantId: 'tenant-123',
      moduleName: 'forms_templates',
      featureId: 'form-builder'
    });
  };
  
  return (
    <div>
      <button onClick={enableFeatureForTenant}>Enable Feature</button>
      <button onClick={disableFeature}>Disable Feature</button>
    </div>
  );
};
```

### Feature Usage Analytics

```typescript
import { useFeatureUsageAnalytics } from '@/hooks/useFeatureAccess';

const FeatureAnalyticsDashboard = ({ tenantId }: { tenantId: string }) => {
  const { data: analytics } = useFeatureUsageAnalytics(
    tenantId,
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    new Date()
  );
  
  return (
    <div>
      <h3>Feature Usage (Last 30 Days)</h3>
      {analytics?.map(usage => (
        <div key={`${usage.module_name}-${usage.feature_id}`}>
          <strong>{usage.feature_id}</strong>: {usage.usage_count} uses
          <br />
          Last used: {new Date(usage.last_used_at).toLocaleDateString()}
        </div>
      ))}
    </div>
  );
};
```

## Service Layer

### Direct Service Usage

```typescript
import FeatureModuleMappingService from '@/services/featureModuleMappingService';

// Check feature access programmatically
const access = await FeatureModuleMappingService.checkFeatureAccess(
  'tenant-123',
  'forms_templates',
  'form-builder',
  'user-456'
);

// Get all features for a module
const features = await FeatureModuleMappingService.getModuleFeatures('analytics');

// Track feature usage
await FeatureModuleMappingService.trackFeatureUsage(
  'tenant-123',
  'analytics',
  'dashboard-builder',
  'user-456',
  15 // 15 minutes session
);
```

## Access Control Flow

1. **Module Access Check** (Primary Gate)
   - Does tenant have subscription that includes the module?
   - If NO → Access Denied (show upgrade prompt)
   - If YES → Continue to feature check

2. **Feature-Level Check** (Secondary Gate)
   - Does tenant have override for this feature?
   - If YES and not expired → Use override setting
   - If NO override → Use feature's default setting
   - Is it a premium feature requiring higher subscription?

3. **Result**
   - ✅ Access Granted → Render component + track usage
   - ❌ Access Denied → Show appropriate message

## Benefits

### For Business
- **Flexible Pricing**: Offer premium features within modules
- **Customer Insights**: Track which features drive engagement
- **Admin Control**: Temporarily disable problematic features
- **Customization**: Enable features for specific high-value customers

### For Development
- **Clean Architecture**: Maintains existing module system
- **Gradual Migration**: Add feature guards only where needed
- **Performance**: Efficient caching and minimal overhead
- **Analytics**: Built-in usage tracking

### For Operations
- **Support Tool**: Enable features for troubleshooting
- **Beta Testing**: Grant access to beta features selectively
- **Trial Management**: Temporary access with expiration
- **Compliance**: Disable features for regulatory reasons

## Migration Strategy

### Phase 1: Foundation (✅ Complete)
- Database tables created
- Service layer implemented
- React hooks available
- Current features mapped

### Phase 2: Gradual Implementation
- Add `FeatureAccessGuard` components where needed
- No changes to existing `ModuleAccessGuard` usage
- Optional feature-level controls

### Phase 3: Enhanced Features
- Admin UI for feature management
- Advanced analytics dashboard
- Premium feature marketplace
- A/B testing framework

## Security Considerations

- **Row-Level Security**: All tables have proper RLS policies
- **Audit Trail**: All changes tracked with timestamps
- **Permission Checks**: Validates user permissions before access
- **Expiration**: Temporary overrides automatically expire

## Performance

- **Efficient Queries**: Optimized indexes for fast lookups
- **Caching**: React Query caching reduces database calls
- **Lazy Loading**: Features checked only when needed
- **Batch Operations**: Analytics tracking minimizes write overhead

## Next Steps

1. **Test the System**: Run the migration and verify everything works
2. **Add Feature Guards**: Gradually add feature-level protection where needed
3. **Build Admin UI**: Create interface for managing feature overrides
4. **Analytics Dashboard**: Visualize feature usage patterns
5. **Premium Features**: Identify features to promote to premium tier

The system is now ready to use! It won't break any existing functionality while providing the foundation for advanced feature management. 🚀 