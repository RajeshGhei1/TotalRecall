
# Total Recall - API Reference

## Overview

This document provides comprehensive API reference for Total Recall's backend services, including REST endpoints, real-time subscriptions, security considerations, and integration patterns.

## Base URL and Authentication

### Base URL
```
Production: https://your-project.supabase.co
Development: http://localhost:54321
```

### Authentication
All API requests require authentication via JWT tokens obtained through Supabase Auth.

```typescript
// Authentication header
Headers: {
  'Authorization': 'Bearer <jwt_token>',
  'Content-Type': 'application/json',
  'apikey': '<supabase_anon_key>'
}
```

## Core API Endpoints

### User Management API

#### Get Current User Profile
```http
GET /rest/v1/profiles?id=eq.{user_id}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "avatar_url": "https://...",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### Update User Profile
```http
PATCH /rest/v1/profiles?id=eq.{user_id}
Content-Type: application/json

{
  "full_name": "Updated Name",
  "avatar_url": "https://new-avatar.com"
}
```

#### Get User Tenants
```http
GET /rest/v1/user_tenants?user_id=eq.{user_id}&select=*,tenants(*)
```

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "tenant_id": "uuid",
    "role": "admin",
    "tenants": {
      "id": "uuid",
      "name": "Company Name",
      "domain": "company.com"
    }
  }
]
```

### People Management API

#### List People
```http
GET /rest/v1/people?select=*,company_relationships(*)&limit=50&offset=0
```

**Query Parameters:**
- `limit`: Number of records (default: 50, max: 100)
- `offset`: Pagination offset
- `search`: Search term for name or email
- `company_id`: Filter by company
- `skills`: Filter by skills array

**Response:**
```json
[
  {
    "id": "uuid",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "current_company": "Tech Corp",
    "current_title": "Software Engineer",
    "skills": ["JavaScript", "React", "Node.js"],
    "experience_years": 5,
    "created_at": "2024-01-01T00:00:00Z",
    "company_relationships": [...]
  }
]
```

#### Create Person
```http
POST /rest/v1/people
Content-Type: application/json

{
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane.smith@example.com",
  "phone": "+1987654321",
  "current_company": "Innovation Inc",
  "current_title": "Product Manager",
  "skills": ["Product Management", "Strategy"],
  "experience_years": 8
}
```

#### Update Person
```http
PATCH /rest/v1/people?id=eq.{person_id}
Content-Type: application/json

{
  "current_title": "Senior Product Manager",
  "experience_years": 9
}
```

#### Delete Person
```http
DELETE /rest/v1/people?id=eq.{person_id}
```

### Company Management API

#### List Companies
```http
GET /rest/v1/companies?select=*&limit=50&offset=0
```

**Query Parameters:**
- `limit`: Number of records
- `offset`: Pagination offset
- `industry`: Filter by industry
- `size`: Filter by company size
- `location`: Filter by location

#### Create Company
```http
POST /rest/v1/companies
Content-Type: application/json

{
  "name": "New Company",
  "domain": "newcompany.com",
  "industry": "Technology",
  "size": "51-200",
  "location": "San Francisco, CA",
  "description": "Innovative tech company"
}
```

#### Get Company Relationships
```http
GET /rest/v1/company_relationships_advanced?parent_company_id=eq.{company_id}&select=*,child_company:companies!child_company_id(*),relationship_type:company_relationship_types(*)
```

### Forms System API

#### List Form Definitions
```http
GET /rest/v1/form_definitions?select=*,form_sections(*,custom_fields(*))&is_active=eq.true
```

#### Create Form Definition
```http
POST /rest/v1/form_definitions
Content-Type: application/json

{
  "name": "Customer Feedback Form",
  "description": "Collect customer feedback",
  "slug": "customer-feedback",
  "settings": {
    "allow_multiple_submissions": false,
    "require_authentication": true
  }
}
```

#### Submit Form Response
```http
POST /rest/v1/form_responses
Content-Type: application/json

{
  "form_id": "uuid",
  "response_data": {
    "customer_name": "John Doe",
    "feedback": "Great service!",
    "rating": 5
  },
  "placement_id": "uuid"
}
```

#### Get Form Analytics
```http
GET /rest/v1/form_response_analytics?form_id=eq.{form_id}&select=*
```

## Version Control API

#### Get Entity Versions
```http
GET /rest/v1/entity_versions?entity_type=eq.form&entity_id=eq.{entity_id}&select=*,profiles(full_name,email)&order=version_number.desc
```

#### Create New Version
```http
POST /rest/v1/entity_versions
Content-Type: application/json

{
  "entity_type": "form",
  "entity_id": "uuid",
  "data_snapshot": { ... },
  "change_summary": "Updated form fields",
  "approval_status": "draft"
}
```

#### Publish Version
```http
POST /rest/v1/rpc/publish_version
Content-Type: application/json

{
  "p_version_id": "uuid"
}
```

#### Get Version History
```http
GET /rest/v1/entity_versions?entity_type=eq.{type}&entity_id=eq.{id}&select=*,profiles(full_name,email)&order=created_at.desc
```

## Collaboration API

#### Get Active Sessions
```http
GET /rest/v1/real_time_sessions?entity_type=eq.{type}&entity_id=eq.{id}&select=*,profiles(full_name,email)
```

#### Update User Presence
```http
POST /rest/v1/real_time_sessions
Content-Type: application/json

{
  "entity_type": "form",
  "entity_id": "uuid",
  "status": "editing",
  "current_section": "contact_info",
  "cursor_position": { "x": 100, "y": 200 }
}
```

#### Get Notifications
```http
GET /rest/v1/real_time_notifications?recipient_id=eq.{user_id}&is_read=eq.false&order=created_at.desc
```

#### Mark Notification as Read
```http
PATCH /rest/v1/real_time_notifications?id=eq.{notification_id}
Content-Type: application/json

{
  "is_read": true
}
```

## Approval Workflow API

#### Get Pending Approvals
```http
GET /rest/v1/workflow_approvals?status=eq.pending&select=*,entity_versions(*),profiles!requested_by(full_name,email)
```

#### Submit Approval Request
```http
POST /rest/v1/workflow_approvals
Content-Type: application/json

{
  "entity_type": "form",
  "entity_id": "uuid",
  "version_id": "uuid",
  "workflow_config": {
    "approval_stages": [...]
  }
}
```

#### Review Approval
```http
PATCH /rest/v1/workflow_approvals?id=eq.{approval_id}
Content-Type: application/json

{
  "status": "approved",
  "review_notes": "Approved with minor suggestions",
  "reviewed_by": "uuid",
  "reviewed_at": "2024-01-01T00:00:00Z"
}
```

## AI Services API (Beta)

#### Get AI Agents
```http
GET /rest/v1/ai_agents?is_active=eq.true&select=*
```

#### Create AI Decision
```http
POST /rest/v1/ai_decisions
Content-Type: application/json

{
  "agent_id": "uuid",
  "context": {
    "user_id": "uuid",
    "entity_type": "form",
    "action": "suggestion"
  },
  "decision": {
    "suggestion": "Add email validation",
    "confidence": 0.85
  },
  "confidence_score": 0.85
}
```

#### Get AI Insights
```http
GET /rest/v1/ai_insights?tenant_id=eq.{tenant_id}&is_active=eq.true&select=*
```

## Real-time Subscriptions

### WebSocket Connection
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, anonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});
```

### User Presence Subscription
```typescript
const presenceChannel = supabase
  .channel(`entity-${entityType}-${entityId}`)
  .on('presence', { event: 'sync' }, () => {
    const state = presenceChannel.presenceState();
    console.log('Sync', state);
  })
  .on('presence', { event: 'join' }, ({ key, newPresences }) => {
    console.log('Join', key, newPresences);
  })
  .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
    console.log('Leave', key, leftPresences);
  })
  .subscribe();

// Track presence
presenceChannel.track({
  user_id: userId,
  status: 'active',
  timestamp: new Date().toISOString()
});
```

### Database Changes Subscription
```typescript
const subscription = supabase
  .channel('schema-db-changes')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'real_time_notifications',
      filter: `recipient_id=eq.${userId}`
    },
    (payload) => {
      console.log('New notification:', payload.new);
    }
  )
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'entity_versions',
      filter: `entity_id=eq.${entityId}`
    },
    (payload) => {
      console.log('Version updated:', payload.new);
    }
  )
  .subscribe();
```

### Collaboration Events
```typescript
const collaborationChannel = supabase
  .channel(`collaboration-${entityId}`)
  .on('broadcast', { event: 'cursor_move' }, (payload) => {
    console.log('Cursor moved:', payload);
  })
  .on('broadcast', { event: 'content_change' }, (payload) => {
    console.log('Content changed:', payload);
  })
  .subscribe();

// Broadcast events
collaborationChannel.send({
  type: 'broadcast',
  event: 'cursor_move',
  payload: { user_id: userId, x: 100, y: 200 }
});
```

## Database Functions (RPC)

### Version Control Functions
```sql
-- Get next version number
SELECT public.get_next_version_number('form', 'uuid');

-- Publish version
SELECT public.publish_version('version_uuid');

-- Cleanup old sessions
SELECT public.cleanup_old_sessions();
```

### Security Functions
```sql
-- Check entity access
SELECT public.can_access_entity('form', 'entity_uuid');

-- Check user permissions
SELECT public.check_user_permissions('user_uuid', 'read', 'entity_uuid');

-- Validate data classification
SELECT public.validate_data_classification('confidential', 'user_uuid');
```

## Error Handling

### Standard Error Responses
```json
{
  "error": {
    "code": "PGRST116", 
    "message": "The result contains 0 rows",
    "details": "Results contain 0 rows, application/vnd.pgrst.object+json returns empty",
    "hint": null
  }
}
```

### Common Error Codes
| Code | Description | Resolution |
|------|-------------|------------|
| `PGRST116` | No rows returned | Check query parameters |
| `42501` | Insufficient privilege | Verify user permissions |
| `23505` | Unique violation | Check for duplicate data |
| `23503` | Foreign key violation | Verify referenced records exist |
| `22001` | String too long | Reduce input length |

### Authentication Errors
```json
{
  "error": {
    "code": "401",
    "message": "Invalid JWT token",
    "details": "Token has expired or is malformed"
  }
}
```

## Rate Limiting

### Default Limits
- **Authenticated requests**: 1000 requests per minute per user
- **Anonymous requests**: 100 requests per minute per IP
- **Real-time connections**: 100 concurrent connections per user
- **File uploads**: 10 files per minute per user

### Rate Limit Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Pagination

### Standard Pagination
```http
GET /rest/v1/people?limit=50&offset=100
```

### Cursor-based Pagination
```http
GET /rest/v1/people?limit=50&order=created_at.desc&created_at=lt.2024-01-01T00:00:00Z
```

### Response Headers
```http
Content-Range: 100-149/500
Link: <https://api.example.com/people?offset=150&limit=50>; rel="next"
```

## Data Filtering

### Operators
| Operator | Description | Example |
|----------|-------------|---------|
| `eq` | Equals | `status=eq.active` |
| `neq` | Not equals | `status=neq.inactive` |
| `gt` | Greater than | `age=gt.18` |
| `gte` | Greater than or equal | `age=gte.21` |
| `lt` | Less than | `age=lt.65` |
| `lte` | Less than or equal | `age=lte.64` |
| `like` | Pattern matching | `name=like.*John*` |
| `ilike` | Case insensitive like | `name=ilike.*john*` |
| `is` | Is null/not null | `deleted_at=is.null` |
| `in` | In list | `status=in.(active,pending)` |
| `cs` | Contains | `skills=cs.{JavaScript}` |
| `cd` | Contained in | `tags=cd.{tech,startup}` |

### Complex Filters
```http
GET /rest/v1/people?and=(age.gte.18,age.lte.65,status.eq.active)
GET /rest/v1/people?or=(email.like.*@company.com,email.like.*@startup.io)
```

## Security Considerations

### Row Level Security (RLS)
All tables have RLS enabled with policies that ensure:
- Users can only access data within their tenant
- Proper role-based access control
- Audit logging for all operations

### Data Validation
- Input sanitization for all user data
- SQL injection prevention through parameterized queries
- XSS protection through output encoding
- CSRF protection via token validation

### API Security Headers
```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
```

## SDK Examples

### JavaScript/TypeScript
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Query with TypeScript types
const { data: people, error } = await supabase
  .from('people')
  .select('*, company_relationships(*)')
  .eq('status', 'active')
  .limit(10);

// Real-time subscription
supabase
  .channel('people_changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'people' },
    (payload) => console.log(payload)
  )
  .subscribe();
```

### Python
```python
from supabase import create_client, Client

supabase: Client = create_client(supabase_url, supabase_key)

# Query data
result = supabase.table('people').select('*').eq('status', 'active').execute()

# Insert data
data = supabase.table('people').insert({
    'first_name': 'John',
    'last_name': 'Doe',
    'email': 'john@example.com'
}).execute()
```

### cURL Examples
```bash
# Get people with authentication
curl -X GET \
  'https://your-project.supabase.co/rest/v1/people?select=*&limit=10' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'apikey: YOUR_SUPABASE_ANON_KEY'

# Create a new person
curl -X POST \
  'https://your-project.supabase.co/rest/v1/people' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'apikey: YOUR_SUPABASE_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane@example.com"
  }'
```

## Testing and Development

### Test Environment
```
Base URL: https://your-project.supabase.co
Test Database: Separate test instance with sample data
Authentication: Test user accounts with various roles
```

### API Testing Tools
- **Postman Collection**: Available for all endpoints
- **OpenAPI Spec**: Swagger documentation
- **SDK Tests**: Automated test suites for all SDKs

### Development Guidelines
1. Always use TypeScript types for API calls
2. Implement proper error handling
3. Use real-time subscriptions for live updates
4. Follow security best practices
5. Test with different user roles and permissions

## Support and Resources

### Documentation Links
- [Supabase Documentation](https://supabase.com/docs)
- [PostgREST API Reference](https://postgrest.org/en/stable/api.html)
- [Real-time Documentation](https://supabase.com/docs/guides/realtime)

### Community Resources
- GitHub Repository: Feature requests and bug reports
- Discord Community: Real-time support and discussions
- Stack Overflow: Technical questions and answers

### Contact Information
- Technical Support: support@totalrecall.com
- API Issues: api-support@totalrecall.com
- Security Concerns: security@totalrecall.com

This API reference provides comprehensive documentation for integrating with Total Recall's backend services. The API is designed to be RESTful, secure, and performant, with real-time capabilities that enable the advanced collaboration and version control features that make Total Recall unique in the enterprise space.
