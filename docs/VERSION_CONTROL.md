
# Total Recall - Version Control System

## Overview

Total Recall implements a comprehensive version control system that provides complete versioning capabilities for all entities, approval workflows, content lifecycle management, and audit trails. This system ensures data integrity while enabling collaborative content development.

## Version Control Architecture

### Versioning Framework
```
Version Control Engine
    ├── Entity Version Management
    ├── Approval Workflow System
    ├── Content Lifecycle Management
    └── Change Tracking & Audit
    ↓
Database Version Storage
    ├── Immutable Version Records
    ├── Delta Change Tracking
    ├── Metadata Management
    └── Relationship Preservation
    ↓
Integration Layer
    ├── Real-time Collaboration
    ├── Conflict Resolution
    ├── Notification System
    └── External Integrations
```

### Core Components
- **Version Storage**: Immutable version records with complete snapshots
- **Change Tracking**: Delta-based change tracking with attribution
- **Approval System**: Multi-stage approval workflows with escalation
- **Lifecycle Management**: Draft, review, approval, and publication states
- **Audit Trail**: Comprehensive change history and user attribution

## Entity Versioning

### Version Data Model
```typescript
interface EntityVersion {
  id: string;
  entity_type: 'form' | 'report' | 'document' | 'workflow';
  entity_id: string;
  version_number: number;
  data_snapshot: Record<string, any>;
  created_at: string;
  created_by: string;
  change_summary?: string;
  is_published: boolean;
  approval_status: 'draft' | 'pending_approval' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  approval_notes?: string;
  metadata: {
    file_size: number;
    checksum: string;
    change_count: number;
    collaboration_session: string;
    merge_parent?: string;
    branch_point?: string;
  };
  profiles?: {
    id: string;
    email: string;
    full_name?: string;
  };
}
```

### Version Creation
```typescript
const useVersionControl = () => {
  const createVersion = async (entityData: {
    entity_type: string;
    entity_id: string;
    data_snapshot: Record<string, any>;
    change_summary?: string;
    auto_publish?: boolean;
  }) => {
    // Get next version number
    const nextVersion = await getNextVersionNumber(
      entityData.entity_type, 
      entityData.entity_id
    );
    
    // Create version record
    const version = await supabase
      .from('entity_versions')
      .insert({
        ...entityData,
        version_number: nextVersion,
        created_by: user.id,
        approval_status: entityData.auto_publish ? 'approved' : 'draft',
        is_published: entityData.auto_publish || false,
        metadata: {
          file_size: JSON.stringify(entityData.data_snapshot).length,
          checksum: generateChecksum(entityData.data_snapshot),
          change_count: calculateChangeCount(entityData.data_snapshot),
          collaboration_session: getCurrentSessionId()
        }
      })
      .select()
      .single();
    
    // Trigger notifications
    if (!entityData.auto_publish) {
      await notifyStakeholders('version_created', version);
    }
    
    return version;
  };
  
  return { createVersion };
};
```

### Version Comparison
```typescript
interface VersionComparison {
  version_from: EntityVersion;
  version_to: EntityVersion;
  changes: Change[];
  summary: ChangeSummary;
  compatibility: CompatibilityCheck;
}

interface Change {
  type: 'added' | 'modified' | 'deleted' | 'moved';
  path: string;
  old_value?: any;
  new_value?: any;
  metadata: {
    user_id: string;
    timestamp: string;
    confidence: number;
    impact_level: 'low' | 'medium' | 'high';
  };
}

const compareVersions = async (fromId: string, toId: string): Promise<VersionComparison> => {
  const [fromVersion, toVersion] = await Promise.all([
    getVersion(fromId),
    getVersion(toId)
  ]);
  
  const changes = generateDiff(fromVersion.data_snapshot, toVersion.data_snapshot);
  const summary = generateChangeSummary(changes);
  const compatibility = checkCompatibility(fromVersion, toVersion);
  
  return {
    version_from: fromVersion,
    version_to: toVersion,
    changes,
    summary,
    compatibility
  };
};
```

## Approval Workflow System

### Workflow Configuration
```typescript
interface WorkflowApproval {
  id: string;
  entity_type: 'form' | 'report' | 'document';
  entity_id: string;
  version_id: string;
  requested_by: string;
  requested_at: string;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  reviewed_by?: string;
  reviewed_at?: string;
  review_notes?: string;
  workflow_config: WorkflowConfiguration;
  escalation_history: EscalationEvent[];
  created_at: string;
  updated_at: string;
}

interface WorkflowConfiguration {
  approval_stages: ApprovalStage[];
  escalation_rules: EscalationRule[];
  parallel_approval: boolean;
  consensus_required: boolean;
  auto_approve_conditions: AutoApproveCondition[];
  notification_settings: NotificationSettings;
}

interface ApprovalStage {
  stage_order: number;
  required_approvers: string[];
  required_roles: string[];
  minimum_approvals: number;
  timeout_hours: number;
  can_delegate: boolean;
  skip_conditions: SkipCondition[];
}
```

### Approval Process
```typescript
const useApprovalWorkflow = () => {
  const requestApproval = async (versionId: string, workflowType?: string) => {
    const version = await getVersion(versionId);
    const workflow = await getWorkflowConfiguration(version.entity_type, workflowType);
    
    // Create approval request
    const approvalRequest = await supabase
      .from('workflow_approvals')
      .insert({
        entity_type: version.entity_type,
        entity_id: version.entity_id,
        version_id: versionId,
        requested_by: user.id,
        status: 'pending',
        workflow_config: workflow
      })
      .select()
      .single();
    
    // Update version status
    await supabase
      .from('entity_versions')
      .update({ approval_status: 'pending_approval' })
      .eq('id', versionId);
    
    // Notify approvers
    await notifyApprovers(approvalRequest);
    
    return approvalRequest;
  };
  
  const reviewApproval = async (approvalId: string, decision: {
    action: 'approve' | 'reject';
    notes?: string;
    shouldPublish?: boolean;
  }) => {
    const approval = await getApproval(approvalId);
    
    // Update approval record
    await supabase
      .from('workflow_approvals')
      .update({
        status: decision.action === 'approve' ? 'approved' : 'rejected',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        review_notes: decision.notes
      })
      .eq('id', approvalId);
    
    // Update version status
    const newStatus = decision.action === 'approve' ? 'approved' : 'rejected';
    await supabase
      .from('entity_versions')
      .update({
        approval_status: newStatus,
        approved_by: decision.action === 'approve' ? user.id : null,
        approved_at: decision.action === 'approve' ? new Date().toISOString() : null,
        approval_notes: decision.notes,
        is_published: decision.shouldPublish || false
      })
      .eq('id', approval.version_id);
    
    // Handle publication
    if (decision.action === 'approve' && decision.shouldPublish) {
      await publishVersion(approval.version_id);
    }
    
    // Notify stakeholders
    await notifyApprovalDecision(approval, decision);
    
    return approval;
  };
  
  return { requestApproval, reviewApproval };
};
```

### Escalation Management
```typescript
interface EscalationRule {
  trigger_condition: 'timeout' | 'rejection' | 'inactivity';
  timeout_hours: number;
  escalation_target: 'manager' | 'admin' | 'role' | 'user';
  escalation_recipients: string[];
  escalation_message: string;
  auto_approve_after_escalation: boolean;
}

const handleEscalation = async (approvalId: string, rule: EscalationRule) => {
  const approval = await getApproval(approvalId);
  
  // Record escalation event
  const escalationEvent = {
    escalation_id: generateId(),
    approval_id: approvalId,
    rule_triggered: rule.trigger_condition,
    escalated_to: rule.escalation_recipients,
    escalated_at: new Date().toISOString(),
    auto_resolved: false
  };
  
  // Update approval with escalation
  await supabase
    .from('workflow_approvals')
    .update({
      escalation_history: [...(approval.escalation_history || []), escalationEvent]
    })
    .eq('id', approvalId);
  
  // Notify escalation recipients
  await notifyEscalation(approval, rule, escalationEvent);
  
  // Auto-approve if configured
  if (rule.auto_approve_after_escalation) {
    await autoApproveAfterEscalation(approvalId, escalationEvent);
  }
};
```

## Content Lifecycle Management

### Publication System
```typescript
interface PublicationProcess {
  version_id: string;
  publication_type: 'immediate' | 'scheduled' | 'conditional';
  scheduled_time?: string;
  conditions?: PublicationCondition[];
  rollback_plan: RollbackPlan;
  validation_rules: ValidationRule[];
  post_publication_actions: PostPublicationAction[];
}

const publishVersion = async (versionId: string, options?: PublicationOptions) => {
  const version = await getVersion(versionId);
  
  // Validate publication readiness
  await validateForPublication(version);
  
  // Run pre-publication hooks
  await runPrePublicationHooks(version);
  
  // Unpublish previous versions
  await supabase
    .from('entity_versions')
    .update({ is_published: false })
    .eq('entity_type', version.entity_type)
    .eq('entity_id', version.entity_id)
    .eq('is_published', true);
  
  // Publish new version
  await supabase
    .from('entity_versions')
    .update({
      is_published: true,
      approval_status: 'approved',
      approved_by: user.id,
      approved_at: new Date().toISOString()
    })
    .eq('id', versionId);
  
  // Run post-publication hooks
  await runPostPublicationHooks(version);
  
  // Notify stakeholders
  await notifyPublication(version);
  
  return version;
};
```

### Draft Management
```typescript
interface DraftManagement {
  auto_save_interval: number; // seconds
  draft_retention_days: number;
  conflict_resolution: 'last_write_wins' | 'merge' | 'manual';
  collaboration_enabled: boolean;
  change_tracking: boolean;
}

const useDraftManagement = () => {
  const [draftContent, setDraftContent] = useState<Record<string, any>>({});
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  
  // Auto-save functionality
  useEffect(() => {
    if (!isDirty) return;
    
    const autoSaveTimer = setTimeout(async () => {
      await saveDraft(draftContent);
      setLastSaved(new Date());
      setIsDirty(false);
    }, AUTO_SAVE_INTERVAL);
    
    return () => clearTimeout(autoSaveTimer);
  }, [draftContent, isDirty]);
  
  const saveDraft = async (content: Record<string, any>) => {
    await supabase
      .from('draft_versions')
      .upsert({
        entity_type: entityType,
        entity_id: entityId,
        user_id: user.id,
        content,
        updated_at: new Date().toISOString()
      });
  };
  
  return {
    draftContent,
    setDraftContent: (content: Record<string, any>) => {
      setDraftContent(content);
      setIsDirty(true);
    },
    lastSaved,
    isDirty,
    saveDraft: () => saveDraft(draftContent)
  };
};
```

## Version Restoration & Rollback

### Restoration Process
```typescript
interface RestorationProcess {
  source_version_id: string;
  target_entity_id: string;
  restoration_type: 'full_restore' | 'selective_restore' | 'merge_restore';
  selected_fields?: string[];
  conflict_resolution: ConflictResolutionStrategy;
  backup_current: boolean;
  approval_required: boolean;
}

const restoreFromVersion = async (process: RestorationProcess) => {
  const sourceVersion = await getVersion(process.source_version_id);
  const currentVersion = await getCurrentVersion(process.target_entity_id);
  
  // Create backup of current version if requested
  if (process.backup_current && currentVersion) {
    await createBackupVersion(currentVersion);
  }
  
  // Prepare restoration data
  let restorationData: Record<string, any>;
  
  switch (process.restoration_type) {
    case 'full_restore':
      restorationData = sourceVersion.data_snapshot;
      break;
    case 'selective_restore':
      restorationData = selectiveRestore(
        currentVersion?.data_snapshot || {},
        sourceVersion.data_snapshot,
        process.selected_fields || []
      );
      break;
    case 'merge_restore':
      restorationData = await mergeVersions(
        currentVersion?.data_snapshot || {},
        sourceVersion.data_snapshot,
        process.conflict_resolution
      );
      break;
  }
  
  // Create new version with restored data
  const restoredVersion = await createVersion({
    entity_type: sourceVersion.entity_type,
    entity_id: process.target_entity_id,
    data_snapshot: restorationData,
    change_summary: `Restored from version ${sourceVersion.version_number}`,
    auto_publish: !process.approval_required
  });
  
  // Log restoration activity
  await logRestorationActivity(process, sourceVersion, restoredVersion);
  
  return restoredVersion;
};
```

### Rollback Capabilities
```typescript
interface RollbackPlan {
  triggers: RollbackTrigger[];
  rollback_target: 'previous_version' | 'last_stable' | 'specific_version';
  target_version_id?: string;
  automatic_rollback: boolean;
  validation_checks: ValidationCheck[];
  notification_recipients: string[];
}

const executeRollback = async (plan: RollbackPlan, reason: string) => {
  // Determine target version
  const targetVersion = await determineRollbackTarget(plan);
  
  // Validate rollback safety
  await validateRollbackSafety(targetVersion);
  
  // Execute rollback
  const rollbackVersion = await restoreFromVersion({
    source_version_id: targetVersion.id,
    target_entity_id: targetVersion.entity_id,
    restoration_type: 'full_restore',
    conflict_resolution: 'overwrite',
    backup_current: true,
    approval_required: false
  });
  
  // Update rollback status
  await updateRollbackStatus(plan, rollbackVersion, reason);
  
  // Notify stakeholders
  await notifyRollback(rollbackVersion, reason);
  
  return rollbackVersion;
};
```

## Change Tracking & Attribution

### Change Detection
```typescript
interface ChangeDetection {
  field_level_tracking: boolean;
  attribution_tracking: boolean;
  timestamp_precision: 'second' | 'millisecond';
  merge_detection: boolean;
  conflict_prediction: boolean;
}

const trackChanges = (originalData: any, newData: any, context: ChangeContext) => {
  const changes: FieldChange[] = [];
  
  // Deep comparison for change detection
  const detectFieldChanges = (original: any, current: any, path: string = '') => {
    Object.keys({ ...original, ...current }).forEach(key => {
      const currentPath = path ? `${path}.${key}` : key;
      const originalValue = original?.[key];
      const currentValue = current?.[key];
      
      if (originalValue !== currentValue) {
        changes.push({
          field_path: currentPath,
          old_value: originalValue,
          new_value: currentValue,
          change_type: determineChangeType(originalValue, currentValue),
          user_id: context.user_id,
          timestamp: new Date().toISOString(),
          session_id: context.session_id,
          confidence: calculateChangeConfidence(originalValue, currentValue)
        });
      }
      
      // Recursive check for nested objects
      if (typeof originalValue === 'object' && typeof currentValue === 'object') {
        detectFieldChanges(originalValue, currentValue, currentPath);
      }
    });
  };
  
  detectFieldChanges(originalData, newData);
  return changes;
};
```

### Attribution System
```typescript
interface ChangeAttribution {
  user_id: string;
  session_id: string;
  timestamp: string;
  ip_address: string;
  user_agent: string;
  collaboration_context?: {
    collaborative_session: string;
    concurrent_editors: string[];
    merge_resolution: boolean;
  };
  ai_assistance?: {
    ai_suggested: boolean;
    ai_confidence: number;
    ai_model: string;
  };
}

const attributeChange = async (change: FieldChange, context: ChangeContext) => {
  const attribution: ChangeAttribution = {
    user_id: context.user_id,
    session_id: context.session_id,
    timestamp: new Date().toISOString(),
    ip_address: context.ip_address,
    user_agent: context.user_agent
  };
  
  // Add collaboration context if applicable
  if (context.collaboration_session) {
    attribution.collaboration_context = {
      collaborative_session: context.collaboration_session,
      concurrent_editors: await getConcurrentEditors(context.collaboration_session),
      merge_resolution: context.is_merge_resolution || false
    };
  }
  
  // Add AI assistance context if applicable
  if (context.ai_assistance) {
    attribution.ai_assistance = {
      ai_suggested: context.ai_assistance.suggested,
      ai_confidence: context.ai_assistance.confidence,
      ai_model: context.ai_assistance.model
    };
  }
  
  return attribution;
};
```

## Version Control UI Components

### Version History Panel
```typescript
const VersionHistoryPanel = ({ entityType, entityId }: VersionHistoryProps) => {
  const { versions, isLoading } = useVersionHistory(entityType, entityId);
  const { compareVersions, restoreVersion } = useVersionControl();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Version History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          {versions?.map((version) => (
            <VersionCard 
              key={version.id}
              version={version}
              onCompare={compareVersions}
              onRestore={restoreVersion}
              showApprovalStatus={true}
              showCollaborators={true}
            />
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
```

### Approval Workflow Manager
```typescript
const ApprovalWorkflowManager = ({ entityType }: ApprovalWorkflowProps) => {
  const { pendingApprovals, reviewApproval } = useApprovalWorkflow();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Approvals</CardTitle>
      </CardHeader>
      <CardContent>
        {pendingApprovals?.map((approval) => (
          <ApprovalCard
            key={approval.id}
            approval={approval}
            onApprove={(notes) => reviewApproval(approval.id, { 
              action: 'approve', 
              notes,
              shouldPublish: true 
            })}
            onReject={(notes) => reviewApproval(approval.id, { 
              action: 'reject', 
              notes 
            })}
            showWorkflowStage={true}
            showEscalationStatus={true}
          />
        ))}
      </CardContent>
    </Card>
  );
};
```

## Performance Optimization

### Version Storage Optimization
- **Delta Compression**: Store only changes between versions
- **Lazy Loading**: Load version content on demand
- **Caching Strategy**: Cache frequently accessed versions
- **Compression**: Compress large version snapshots
- **Indexing**: Optimize queries for version retrieval

### Query Optimization
```sql
-- Optimized version queries
CREATE INDEX idx_entity_versions_lookup ON entity_versions(entity_type, entity_id, version_number);
CREATE INDEX idx_entity_versions_published ON entity_versions(entity_type, entity_id, is_published) WHERE is_published = true;
CREATE INDEX idx_workflow_approvals_pending ON workflow_approvals(status, entity_type) WHERE status = 'pending';

-- Efficient version comparison query
WITH version_comparison AS (
  SELECT 
    v1.data_snapshot as version_from,
    v2.data_snapshot as version_to,
    v1.version_number as from_version,
    v2.version_number as to_version
  FROM entity_versions v1
  CROSS JOIN entity_versions v2
  WHERE v1.id = $1 AND v2.id = $2
)
SELECT * FROM version_comparison;
```

## Integration with Other Systems

### Collaboration Integration
```typescript
const useCollaborativeVersioning = () => {
  const { createVersion } = useVersionControl();
  const { resolveConflicts } = useCollaboration();
  
  const createCollaborativeVersion = async (changes: CollaborativeChange[]) => {
    // Resolve any pending conflicts
    const resolvedChanges = await resolveConflicts(changes);
    
    // Merge all collaborative changes
    const mergedContent = mergeCollaborativeChanges(resolvedChanges);
    
    // Create version with collaboration attribution
    return createVersion({
      data_snapshot: mergedContent,
      change_summary: generateCollaborativeSummary(resolvedChanges),
      collaboration_metadata: {
        contributors: resolvedChanges.map(c => c.user_id),
        session_id: getCurrentCollaborationSession(),
        conflict_resolutions: resolvedChanges.filter(c => c.had_conflicts)
      }
    });
  };
  
  return { createCollaborativeVersion };
};
```

### AI Integration (Planned)
```typescript
interface AIVersioningFeatures {
  intelligent_change_summary: boolean;
  auto_conflict_resolution: boolean;
  version_recommendation: boolean;
  impact_analysis: boolean;
  rollback_prediction: boolean;
}

// Planned AI features for version control
const useAIVersioning = () => {
  const generateSmartSummary = async (changes: Change[]) => {
    // AI-generated change summaries
    return await aiService.generateChangeSummary(changes);
  };
  
  const predictVersionImpact = async (version: EntityVersion) => {
    // AI-powered impact analysis
    return await aiService.analyzeVersionImpact(version);
  };
  
  const suggestRollbackTarget = async (issue: string) => {
    // AI-recommended rollback targets
    return await aiService.suggestRollbackTarget(issue);
  };
  
  return {
    generateSmartSummary,
    predictVersionImpact,
    suggestRollbackTarget
  };
};
```

## Best Practices

### Version Management
1. **Meaningful Summaries**: Provide clear change summaries for all versions
2. **Regular Checkpoints**: Create versions at logical milestones
3. **Approval Workflows**: Use appropriate approval processes for different content types
4. **Testing Before Publication**: Validate versions before publishing
5. **Rollback Planning**: Maintain rollback plans for critical publications

### Performance Considerations
1. **Version Cleanup**: Archive old versions to maintain performance
2. **Selective Loading**: Load only necessary version data
3. **Caching Strategy**: Cache frequently accessed versions
4. **Batch Operations**: Batch version operations where possible
5. **Monitor Performance**: Track version control performance metrics

### Security & Compliance
1. **Access Control**: Implement proper version access controls
2. **Audit Trails**: Maintain comprehensive audit logs
3. **Data Protection**: Protect sensitive data in versions
4. **Retention Policies**: Implement appropriate version retention
5. **Compliance Validation**: Validate compliance requirements

## Conclusion

Total Recall's version control system provides enterprise-grade versioning capabilities that ensure data integrity, enable collaborative development, and maintain comprehensive audit trails. The combination of entity versioning, approval workflows, content lifecycle management, and advanced restoration capabilities creates a robust foundation for managing complex content in enterprise environments.

Key benefits include:

1. **Complete Version History**: Immutable record of all changes with full attribution
2. **Flexible Approval Workflows**: Configurable approval processes for different content types
3. **Safe Restoration**: Reliable rollback and restoration capabilities
4. **Collaborative Versioning**: Integration with real-time collaboration features
5. **Audit Compliance**: Comprehensive audit trails for regulatory compliance

This version control system provides the foundation for future AI-enhanced versioning features while maintaining the security, reliability, and performance required for enterprise applications.
