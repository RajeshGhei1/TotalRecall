# AI Agent Backend Integration

## Overview

The AI Agent system has been fully integrated with the backend database and services, providing complete CRUD operations, activity logging, and performance tracking.

## Database Schema

### Tables Created

#### `ai_agents`
- **Purpose**: Store AI agent configurations and metadata
- **Key Fields**:
  - `id`: Unique identifier
  - `name`: Agent name (unique per tenant)
  - `description`: Agent description
  - `agent_type`: Type of agent (cognitive, predictive, automation, etc.)
  - `capabilities`: JSON array of agent capabilities
  - `model_config`: JSON object with AI model configuration
  - `status`: Agent status (active, inactive, error, maintenance)
  - `performance_metrics`: JSON object with performance data
  - `tenant_id`: Associated tenant (null for global agents)
  - `created_by`: User who created the agent

#### `ai_agent_activity_logs`
- **Purpose**: Track all agent interactions and executions
- **Key Fields**:
  - `agent_id`: Reference to the agent
  - `user_id`: User who triggered the action
  - `tenant_id`: Associated tenant
  - `action`: Type of action performed
  - `request_data`: Input data sent to agent
  - `response_data`: Output data from agent
  - `duration_ms`: Execution time
  - `tokens_used`: AI model tokens consumed
  - `cost_usd`: Cost of the operation
  - `status`: Success/error status

#### `ai_agent_configurations`
- **Purpose**: Tenant-specific agent configurations
- **Key Fields**:
  - `agent_id`: Reference to the agent
  - `tenant_id`: Associated tenant
  - `configuration`: JSON object with tenant-specific settings
  - `is_active`: Whether configuration is active

## Backend Services

### AIAgentService Class

Located in `src/services/ai/aiAgentService.ts`

#### Key Methods:
- `getAgents(tenantId?)`: Fetch all agents for a tenant
- `getAgent(agentId)`: Get specific agent details
- `createAgent(agentData, tenantId?)`: Create new agent
- `updateAgent(agentId, updates)`: Update existing agent
- `deleteAgent(agentId)`: Delete agent
- `logActivity(activityData)`: Log agent activity
- `getAgentActivityLogs(agentId)`: Get activity history
- `getAgentPerformanceMetrics(agentId)`: Get performance analytics
- `executeAgent(agentId, input)`: Execute agent (placeholder for AI integration)

## React Hooks

### useAIAgents Hook

Located in `src/hooks/ai/useAIAgents.ts`

#### Features:
- **Data Fetching**: Automatic loading of agents for current tenant
- **CRUD Operations**: Create, update, delete agents
- **Cache Management**: React Query integration for efficient caching
- **Error Handling**: Toast notifications for success/error states
- **Loading States**: Loading indicators for all operations

#### Usage:
```typescript
const { 
  agents, 
  isLoading, 
  createAgent, 
  updateAgent, 
  deleteAgent 
} = useAIAgents();
```

### useAIAgent Hook

For individual agent management:
```typescript
const { 
  agent, 
  activityLogs, 
  performanceMetrics 
} = useAIAgent(agentId);
```

## Frontend Integration

### AI Orchestration Module Updates

The `src/modules/ai-orchestration/index.tsx` has been updated to:

1. **Use Backend Service**: Replace local state with database operations
2. **Real-time Updates**: Agents list updates automatically after creation
3. **Loading States**: Show loading indicators during operations
4. **Error Handling**: Display error messages for failed operations
5. **Empty States**: Show helpful messages when no agents exist

### Agent Creation Modal

Enhanced with:
- **Form Validation**: Ensure all required fields are filled
- **Model Selection**: Choose from available AI models
- **Capability Selection**: Multi-select agent capabilities
- **API Key Configuration**: Optional per-agent API keys
- **Loading States**: Disable form during submission

## Security & Access Control

### Row Level Security (RLS)

All tables have RLS policies:

- **Super Admins**: Full access to all agents and logs
- **Tenant Admins**: Manage their tenant's agents
- **Users**: View their tenant's agents, create new ones
- **Activity Logs**: Users can only see their own activity

### Data Validation

- **Agent Names**: Unique per tenant
- **Model Configuration**: Validated temperature and token limits
- **Capabilities**: Predefined list of valid capabilities
- **Status Values**: Enumerated status options

## Performance Features

### Activity Logging
- **Automatic Logging**: All agent interactions are logged
- **Performance Metrics**: Track response times, token usage, costs
- **Error Tracking**: Capture and log execution errors
- **Audit Trail**: Complete history of agent usage

### Analytics
- **Success Rates**: Track successful vs failed executions
- **Cost Analysis**: Monitor AI model usage costs
- **Performance Trends**: Historical performance data
- **Usage Patterns**: User and tenant usage analytics

## Migration File

The database schema is defined in:
`supabase/migrations/20250628000000-create-ai-agents-table.sql`

To apply the migration:
```bash
# If using local Supabase
npx supabase db push

# If using remote Supabase
npx supabase db push --project-ref YOUR_PROJECT_REF
```

## Next Steps

### Immediate
1. **Run Migration**: Apply the database schema
2. **Test Integration**: Verify CRUD operations work
3. **Add Real AI Execution**: Implement actual AI model calls

### Future Enhancements
1. **Agent Templates**: Pre-built agent configurations
2. **Agent Marketplace**: Share and discover agents
3. **Advanced Analytics**: Detailed performance dashboards
4. **Agent Chaining**: Connect multiple agents in workflows
5. **Cost Optimization**: Smart model selection based on cost/performance

## Testing

The implementation includes:
- **Type Safety**: Full TypeScript support
- **Error Boundaries**: Graceful error handling
- **Loading States**: User feedback during operations
- **Validation**: Form and data validation
- **Toast Notifications**: Success/error feedback

## API Endpoints

The service uses Supabase's auto-generated REST API:
- `GET /ai_agents` - List agents
- `POST /ai_agents` - Create agent
- `PUT /ai_agents/{id}` - Update agent
- `DELETE /ai_agents/{id}` - Delete agent
- `GET /ai_agent_activity_logs` - Get activity logs
- `POST /ai_agent_activity_logs` - Log activity 