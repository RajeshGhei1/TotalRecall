
export interface DocumentItem {
  filePath: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  tags: string[];
  lastModified: string;
  estimatedReadTime: string;
  content: string;
}

export interface DocumentCategory {
  id: string;
  label: string;
  count: number;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface PriorityLevel {
  id: string;
  label: string;
  count?: number;
}

export const availableDocuments: DocumentItem[] = [
  {
    filePath: 'docs/current/AI_ORCHESTRATION.md',
    title: 'AI Orchestration & Agent Management',
    description: 'Complete guide to Total Recall\'s AI orchestration system, agent management, and intelligent workflow automation',
    category: 'ai',
    priority: 'critical',
    tags: ['current', 'ai-agents'],
    lastModified: '2025-06-12',
    estimatedReadTime: '15 min',
    content: `# AI Orchestration & Agent Management

## Overview
Total Recall's AI orchestration system provides intelligent agent management, behavioral tracking, and predictive insights across all modules.

## Key Features

### AI Agent Management
- **Multi-Agent Orchestration**: Deploy and manage multiple specialized AI agents
- **Intelligent Agent Selection**: Dynamic agent assignment based on context and performance
- **Performance Tracking**: Real-time metrics and optimization suggestions
- **Cost Management**: Token budget tracking and overage policies

### Behavioral Analytics
- **User Interaction Tracking**: Comprehensive behavioral pattern analysis
- **Predictive Insights**: AI-powered recommendations and workflow optimization
- **Real-time Decision Making**: Context-aware intelligent assistance
- **Pattern Recognition**: Advanced learning from user behaviors

### Module AI Configuration
- **Per-Module Settings**: Configure AI preferences for each system module
- **Budget Management**: Set token limits and overage policies per module
- **Performance Weights**: Customize AI optimization priorities
- **Direct Assignment**: Assign specific agents to modules for specialized tasks

## Implementation Status
✅ Core orchestration engine implemented
✅ Agent management system active
✅ Behavioral tracking operational
✅ Module configuration interface complete
🔄 Advanced pattern recognition in development
🔄 Cross-module learning optimization pending`
  },
  {
    filePath: 'docs/current/MODULE_SYSTEM.md',
    title: 'Total Recall Module System',
    description: 'Architecture and management of Total Recall\'s modular system including registry, access control, and tenant assignments',
    category: 'modules',
    priority: 'critical',
    tags: ['current', 'modules'],
    lastModified: '2025-06-12',
    estimatedReadTime: '12 min',
    content: `# Total Recall Module System

## System Architecture
Total Recall operates on a modular architecture enabling flexible enterprise deployment and customization.

## Core Modules

### People Management
- **Contact Management**: Comprehensive people database with relationship mapping
- **Company Linking**: Associate people with companies and track employment history
- **Reporting Relationships**: Hierarchical org chart management
- **Skills Tracking**: Talent skills management and analytics

### ATS (Applicant Tracking System)
- **Job Management**: Create and manage job postings
- **Candidate Tracking**: Full candidate lifecycle management
- **Application Processing**: Streamlined application workflow
- **Talent Pool Management**: Maintain searchable talent database

### Company Management
- **Enterprise Profiles**: Detailed company information and metrics
- **Relationship Mapping**: Inter-company relationship tracking
- **Branch Office Management**: Multi-location company structure
- **Industry Analytics**: Sector-based insights and reporting

### Form Builder & Management
- **Dynamic Form Creation**: No-code form builder with AI assistance
- **Smart Field Suggestions**: AI-powered form optimization
- **Workflow Integration**: Automated form processing and routing
- **Analytics Dashboard**: Form performance and completion metrics

### Custom Fields System
- **Flexible Data Models**: Extend any entity with custom attributes
- **Type-Safe Validation**: Comprehensive field validation and constraints
- **Cross-Module Integration**: Custom fields across all system modules
- **Drag-and-Drop Management**: Intuitive field ordering and organization

## Module Registry
- **Centralized Management**: Single interface for all module administration
- **Tenant Assignment**: Flexible module access control per tenant
- **Dependency Management**: Handle module interdependencies
- **Access Control**: Role-based module permissions

## Current Status
✅ Core module system operational
✅ Module registry and assignment system active
✅ Cross-module integration working
✅ Tenant-based access control implemented`
  },
  {
    filePath: 'docs/current/ENTERPRISE_ARCHITECTURE.md',
    title: 'Enterprise Architecture Overview',
    description: 'Total Recall\'s enterprise-grade architecture including multi-tenancy, security, and scalability features',
    category: 'architecture',
    priority: 'critical',
    tags: ['current', 'enterprise'],
    lastModified: '2025-06-12',
    estimatedReadTime: '18 min',
    content: `# Total Recall Enterprise Architecture

## Core Principles
- **Multi-Tenant by Design**: Complete tenant isolation and customization
- **Modular Architecture**: Scalable, maintainable component system
- **AI-First Approach**: Intelligence embedded at every layer
- **Enterprise Security**: Comprehensive security and compliance framework

## Technical Stack

### Frontend Architecture
- **React + TypeScript**: Type-safe, component-based UI
- **Tailwind CSS**: Utility-first styling with design system
- **Shadcn/UI**: Consistent, accessible component library
- **React Query**: Optimistic updates and caching
- **React Router**: Client-side routing and navigation

### Backend Infrastructure
- **Supabase**: PostgreSQL database with real-time capabilities
- **Row Level Security**: Tenant-based data isolation
- **Edge Functions**: Serverless backend processing
- **Real-time Subscriptions**: Live data synchronization

### AI Integration
- **Multi-Agent System**: Specialized AI agents for different domains
- **Behavioral Analytics**: User interaction tracking and optimization
- **Predictive Insights**: AI-powered recommendations and forecasting
- **Smart Automation**: Intelligent workflow optimization

## Multi-Tenancy Model
- **Complete Isolation**: Each tenant operates in isolated environment
- **Flexible Configuration**: Per-tenant module enablement and customization
- **Scalable Architecture**: Support for enterprise-scale deployments
- **Unified Administration**: SuperAdmin oversight across all tenants

## Security Framework
- **Authentication**: Secure user authentication with session management
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Encryption at rest and in transit
- **Audit Logging**: Comprehensive activity tracking and compliance
- **Compliance Ready**: GDPR, SOC2, and enterprise compliance support

## Performance & Scalability
- **Optimistic UI Updates**: Immediate user feedback with background sync
- **Intelligent Caching**: Multi-layer caching strategy
- **Real-time Sync**: Live collaboration and data synchronization
- **Horizontal Scaling**: Cloud-native scalability patterns`
  },
  {
    filePath: 'docs/current/SMART_WORKFLOWS.md',
    title: 'Smart Workflows & Automation',
    description: 'AI-powered workflow automation, form intelligence, and process optimization across Total Recall modules',
    category: 'workflow',
    priority: 'critical',
    tags: ['current', 'ai-workflows'],
    lastModified: '2025-06-12',
    estimatedReadTime: '10 min',
    content: `# Smart Workflows & Automation

## Overview
Total Recall's intelligent workflow system combines AI-powered automation with human oversight to optimize business processes.

## Smart Form System

### AI-Powered Form Builder
- **Intelligent Field Suggestions**: AI recommends optimal form fields based on context
- **Auto-completion**: Smart field population based on user patterns
- **Usability Scoring**: AI evaluates form design and suggests improvements
- **Dynamic Optimization**: Real-time form optimization based on completion rates

### Form Analytics & Intelligence
- **Completion Analysis**: Track form performance and identify bottlenecks
- **User Behavior Insights**: Understand how users interact with forms
- **A/B Testing**: Automated form variant testing and optimization
- **Predictive Completion**: Forecast form completion likelihood

## Workflow Automation

### Process Intelligence
- **Bottleneck Detection**: AI identifies workflow inefficiencies
- **Performance Optimization**: Automated process improvement suggestions
- **Resource Allocation**: Intelligent workload distribution
- **Predictive Scaling**: Anticipate workflow volume changes

### Automation Rules
- **Conditional Logic**: Complex rule-based automation
- **Event Triggers**: Automated responses to system events
- **Integration Workflows**: Cross-module process automation
- **Approval Routing**: Intelligent approval workflow management

## Current Capabilities
✅ Smart form builder with AI assistance
✅ Form analytics and optimization
✅ Basic workflow automation
✅ Process bottleneck detection
🔄 Advanced predictive workflow optimization
🔄 Cross-system integration workflows`
  },
  {
    filePath: 'docs/current/TALENT_ANALYTICS.md',
    title: 'Advanced Talent Analytics',
    description: 'AI-driven talent insights, predictive analytics, and smart matching for comprehensive talent management',
    category: 'ai',
    priority: 'critical',
    tags: ['current', 'talent-ai'],
    lastModified: '2025-06-12',
    estimatedReadTime: '14 min',
    content: `# Advanced Talent Analytics

## Smart Talent Management
Total Recall's talent analytics system provides AI-powered insights for strategic talent decisions.

## Core Features

### Predictive Analytics
- **Performance Forecasting**: Predict candidate success probability
- **Retention Analysis**: Identify flight risk and retention strategies
- **Skill Gap Analysis**: Automated skill requirement matching
- **Career Path Prediction**: AI-powered career development insights

### Intelligent Matching
- **Smart Candidate Matching**: Multi-dimensional talent matching algorithms
- **Cultural Fit Analysis**: Behavioral pattern matching for team dynamics
- **Experience Weighting**: Intelligent experience relevance scoring
- **Skill Evolution Tracking**: Monitor and predict skill development

### Talent Pool Intelligence
- **Market Analysis**: Real-time talent market insights
- **Compensation Intelligence**: AI-powered salary recommendations
- **Talent Pipeline**: Predictive talent pipeline management
- **Diversity Analytics**: Comprehensive diversity and inclusion metrics

### ATS Integration
- **Automated Screening**: AI-powered initial candidate screening
- **Interview Optimization**: Smart interview scheduling and preparation
- **Decision Support**: Data-driven hiring recommendations
- **Process Analytics**: Recruitment funnel optimization

## Implementation Status
✅ Core talent analytics engine
✅ Smart matching algorithms
✅ Predictive insights dashboard
✅ ATS integration framework
🔄 Advanced machine learning models
🔄 Real-time market intelligence`
  },
  {
    filePath: 'docs/current/BEHAVIORAL_INTELLIGENCE.md',
    title: 'Behavioral Intelligence System',
    description: 'Real-time user behavior tracking, pattern recognition, and AI-powered personalization across all modules',
    category: 'ai',
    priority: 'high',
    tags: ['current', 'behavioral-ai'],
    lastModified: '2025-06-12',
    estimatedReadTime: '12 min',
    content: `# Behavioral Intelligence System

## Overview
Total Recall's behavioral intelligence system provides real-time user interaction tracking and AI-powered personalization.

## Core Capabilities

### Real-Time Tracking
- **User Interaction Monitoring**: Comprehensive user action tracking
- **Pattern Recognition**: AI-powered behavior pattern identification
- **Context Awareness**: Situational understanding and adaptation
- **Performance Analytics**: User efficiency and productivity metrics

### Personalization Engine
- **Adaptive Interfaces**: UI that learns and adapts to user preferences
- **Smart Recommendations**: Contextual suggestions and guidance
- **Workflow Optimization**: Personalized process improvements
- **Content Prioritization**: Intelligent information ranking

### Learning & Adaptation
- **Continuous Learning**: System improves with every interaction
- **Cross-Module Insights**: Behavioral patterns across all modules
- **Predictive Assistance**: Anticipate user needs and provide proactive help
- **Feedback Loops**: Continuous improvement based on user feedback

## Implementation Features
✅ Real-time behavioral tracking active
✅ Pattern recognition engine operational
✅ Basic personalization implemented
✅ Cross-module data collection
🔄 Advanced predictive modeling
🔄 Autonomous workflow optimization`
  },
  {
    filePath: 'docs/current/API_INTEGRATION.md',
    title: 'API & Integration Framework',
    description: 'Comprehensive API documentation, third-party integrations, and developer resources for Total Recall',
    category: 'api',
    priority: 'critical',
    tags: ['current', 'api'],
    lastModified: '2025-06-12',
    estimatedReadTime: '16 min',
    content: `# API & Integration Framework

## REST API Architecture
Total Recall provides a comprehensive REST API for all system functions.

## Core API Endpoints

### Authentication & Security
- **JWT-based Authentication**: Secure token-based authentication
- **Role-based Access**: API endpoints respect user permissions
- **Rate Limiting**: Intelligent API rate limiting and throttling
- **Audit Logging**: Complete API access logging

### Data Management APIs
- **People Management**: Full CRUD operations for people and relationships
- **Company Operations**: Company management and relationship APIs
- **Module Access**: Dynamic module-based API access
- **Custom Fields**: Flexible custom field management APIs

### AI Integration APIs
- **Agent Management**: AI agent configuration and monitoring
- **Behavioral Data**: Real-time behavioral analytics APIs
- **Predictive Insights**: Access to AI-generated insights and recommendations
- **Smart Automation**: Workflow automation trigger APIs

## Third-Party Integrations

### LinkedIn Integration
- **OAuth Authentication**: Secure LinkedIn OAuth flow
- **Profile Enrichment**: Automated contact enrichment from LinkedIn
- **Bulk Operations**: Batch profile processing and updates
- **Real-time Sync**: Live profile synchronization

### Email Systems
- **SMTP Integration**: Configurable email delivery
- **Template Management**: Dynamic email template system
- **Tracking & Analytics**: Email engagement tracking
- **AI Response Generation**: Automated email response suggestions

## Developer Resources
✅ REST API documentation
✅ Authentication flow guides
✅ Integration examples
✅ SDK development in progress
🔄 GraphQL API development
🔄 Webhook system implementation`
  },
  {
    filePath: 'docs/current/SECURITY_COMPLIANCE.md',
    title: 'Security & Compliance Framework',
    description: 'Enterprise-grade security implementation, compliance features, and data protection in Total Recall',
    category: 'security',
    priority: 'critical',
    tags: ['current', 'security'],
    lastModified: '2025-06-12',
    estimatedReadTime: '20 min',
    content: `# Security & Compliance Framework

## Security Architecture

### Multi-Layer Security
- **Application Security**: Input validation, output encoding, secure coding practices
- **Database Security**: Row-level security (RLS) for complete tenant isolation
- **Network Security**: TLS encryption, secure communication protocols
- **Infrastructure Security**: Cloud-native security best practices

### Authentication & Authorization
- **Multi-Factor Authentication**: Optional MFA for enhanced security
- **Session Management**: Secure session handling with timeout controls
- **Password Policies**: Configurable password strength requirements
- **Role-Based Access Control**: Granular permission management

### Data Protection
- **Encryption**: AES-256 encryption for data at rest and in transit
- **Data Anonymization**: PII protection and anonymization capabilities
- **Backup Security**: Encrypted backup storage and recovery procedures
- **Data Retention**: Configurable data retention and deletion policies

## Compliance Features

### Audit & Monitoring
- **Comprehensive Logging**: All user actions and system events logged
- **Real-time Monitoring**: Active security threat detection
- **Compliance Reporting**: Automated compliance report generation
- **Change Tracking**: Complete audit trail for all data modifications

### Privacy Controls
- **Data Subject Rights**: GDPR-compliant data access and deletion
- **Consent Management**: Granular consent tracking and management
- **Data Portability**: Secure data export and transfer capabilities
- **Privacy by Design**: Privacy considerations built into system architecture

### Enterprise Compliance
- **SOC 2 Ready**: Security controls aligned with SOC 2 requirements
- **GDPR Compliant**: Full European data protection regulation compliance
- **Industry Standards**: Alignment with industry-specific compliance requirements
- **Regular Audits**: Ongoing security assessment and improvement

## Security Monitoring
✅ Real-time security monitoring active
✅ Comprehensive audit logging implemented
✅ Data encryption operational
✅ Access control system functional
🔄 Advanced threat detection
🔄 Automated compliance reporting`
  },
  {
    filePath: 'docs/current/ENTERPRISE_FEATURES.md',
    title: 'Enterprise Features & Capabilities',
    description: 'Comprehensive overview of Total Recall\'s enterprise-grade features, scalability, and advanced functionality',
    category: 'enterprise',
    priority: 'high',
    tags: ['current', 'enterprise'],
    lastModified: '2025-06-12',
    estimatedReadTime: '14 min',
    content: `# Enterprise Features & Capabilities

## Multi-Tenant Architecture
Total Recall is built from the ground up as a multi-tenant platform supporting enterprise-scale deployments.

## Core Enterprise Features

### Tenant Management
- **Complete Isolation**: Each tenant operates in a fully isolated environment
- **Custom Branding**: Per-tenant UI customization and branding
- **Module Configuration**: Flexible module enablement per tenant
- **Subscription Management**: Flexible pricing and feature control

### Advanced User Management
- **Role Hierarchy**: Complex organizational role structures
- **Department Management**: Department-based access and organization
- **User Provisioning**: Automated user account management
- **Session Controls**: Advanced session management and security

### Scalability Features
- **Performance Optimization**: Intelligent caching and query optimization
- **Load Balancing**: Automatic load distribution across resources
- **Resource Management**: Dynamic resource allocation and scaling
- **High Availability**: 99.9% uptime with redundancy and failover

### Integration Capabilities
- **API-First Design**: Complete functionality available via REST APIs
- **Webhook System**: Real-time event notifications and integrations
- **SSO Integration**: SAML, OAuth, and LDAP integration support
- **Data Migration**: Comprehensive data import and migration tools

## Advanced Analytics

### Business Intelligence
- **Custom Dashboards**: Configurable executive dashboards
- **Advanced Reporting**: Complex multi-dimensional reporting
- **Data Visualization**: Interactive charts and analytics
- **Export Capabilities**: Comprehensive data export options

### AI-Powered Insights
- **Predictive Analytics**: AI-powered business forecasting
- **Pattern Recognition**: Automated insight discovery
- **Performance Optimization**: AI-driven process improvements
- **Decision Support**: Data-driven recommendation engine

## Enterprise Support
✅ 24/7 technical support
✅ Dedicated account management
✅ Custom implementation services
✅ Training and onboarding programs
🔄 Advanced SLA options
🔄 White-label deployment options`
  },
  {
    filePath: 'docs/current/SUBSCRIPTION_MANAGEMENT.md',
    title: 'Subscription & Module Management',
    description: 'Flexible subscription plans, module permissions, and pricing management for Total Recall enterprise deployments',
    category: 'modules',
    priority: 'high',
    tags: ['current', 'subscriptions'],
    lastModified: '2025-06-12',
    estimatedReadTime: '10 min',
    content: `# Subscription & Module Management

## Flexible Subscription Model
Total Recall offers flexible subscription management with granular module control.

## Subscription Features

### Plan Management
- **Multiple Plan Types**: Support for various subscription tiers
- **Module Permissions**: Granular control over module access per plan
- **Usage Limits**: Configurable limits for users, storage, and features
- **Custom Pricing**: Flexible pricing models for enterprise clients

### Module Access Control
- **Per-Module Licensing**: Individual module enablement and licensing
- **Feature Limitations**: Granular feature restrictions within modules
- **Usage Tracking**: Monitor and track module usage across tenants
- **Automated Enforcement**: System-level enforcement of subscription limits

### Billing & Payments
- **Automated Billing**: Recurring subscription billing management
- **Usage-Based Pricing**: Support for usage-based pricing models
- **Invoice Generation**: Automated invoice creation and delivery
- **Payment Processing**: Secure payment processing and management

## Module Ecosystem

### Core Modules Available
- **People Management**: Contact and relationship management
- **ATS System**: Full applicant tracking system
- **Company Management**: Enterprise company database
- **Form Builder**: Dynamic form creation and management
- **Custom Fields**: Flexible data model extensions
- **AI Analytics**: Advanced AI-powered insights
- **Workflow Automation**: Process automation and optimization

### Module Dependencies
- **Smart Dependencies**: Automatic handling of module interdependencies
- **Graceful Degradation**: System continues to function with reduced modules
- **Upgrade Paths**: Seamless module activation and feature unlocking

## Current Status
✅ Subscription management system operational
✅ Module-based access control active
✅ Billing integration functional
✅ Usage tracking implemented
🔄 Advanced usage analytics
🔄 Self-service subscription management`
  },
  {
    filePath: 'docs/current/REAL_TIME_COLLABORATION.md',
    title: 'Real-Time Collaboration System',
    description: 'Live collaboration features, real-time updates, and team coordination capabilities across Total Recall',
    category: 'ai',
    priority: 'medium',
    tags: ['current', 'collaboration'],
    lastModified: '2025-06-12',
    estimatedReadTime: '8 min',
    content: `# Real-Time Collaboration System

## Live Collaboration Features
Total Recall provides real-time collaboration capabilities across all modules.

## Core Collaboration Features

### Real-Time Updates
- **Live Data Sync**: Instant synchronization across all connected users
- **Conflict Resolution**: Intelligent handling of concurrent edits
- **Presence Indicators**: See who's online and what they're working on
- **Activity Feeds**: Real-time activity notifications and updates

### Team Coordination
- **Shared Workspaces**: Collaborative workspaces for team projects
- **Comment System**: Contextual comments and discussions
- **Task Assignment**: Collaborative task management and tracking
- **Approval Workflows**: Multi-user approval and review processes

### Communication Integration
- **In-App Messaging**: Built-in communication tools
- **Notification System**: Intelligent notification management
- **Integration Ready**: Slack, Teams, and email integration support
- **Mobile Sync**: Real-time sync across desktop and mobile devices

## Implementation Status
✅ Real-time data synchronization
✅ Basic collaboration features
✅ Notification system operational
🔄 Advanced conflict resolution
🔄 Mobile collaboration apps
🔄 Video call integration`
  },
  {
    filePath: 'docs/current/DEPLOYMENT_GUIDE.md',
    title: 'Deployment & Operations Guide',
    description: 'Complete guide for deploying, configuring, and maintaining Total Recall in enterprise environments',
    category: 'architecture',
    priority: 'high',
    tags: ['current', 'deployment'],
    lastModified: '2025-06-12',
    estimatedReadTime: '22 min',
    content: `# Deployment & Operations Guide

## Deployment Options

### Cloud Deployment
- **Supabase Hosted**: Fully managed cloud deployment
- **Custom Cloud**: Deploy on AWS, Azure, or Google Cloud
- **Hybrid Deployment**: Combine cloud and on-premise resources
- **Multi-Region**: Global deployment with regional data compliance

### On-Premise Deployment
- **Self-Hosted**: Complete on-premise installation
- **Air-Gapped**: Secure deployment for sensitive environments
- **Private Cloud**: Internal cloud deployment options
- **Custom Infrastructure**: Tailored deployment for specific requirements

## Configuration Management

### System Configuration
- **Environment Variables**: Comprehensive configuration management
- **Database Setup**: PostgreSQL configuration and optimization
- **Security Settings**: Security policy configuration and enforcement
- **Performance Tuning**: System optimization for specific workloads

### Module Configuration
- **Module Enablement**: Configure which modules are active
- **Feature Flags**: Control feature availability per tenant
- **Integration Settings**: Configure third-party service integrations
- **AI Configuration**: Set up AI agents and behavioral tracking

## Monitoring & Maintenance

### System Monitoring
- **Health Checks**: Automated system health monitoring
- **Performance Metrics**: Real-time performance tracking
- **Error Monitoring**: Comprehensive error tracking and alerting
- **Capacity Planning**: Resource usage monitoring and forecasting

### Backup & Recovery
- **Automated Backups**: Scheduled database and file backups
- **Point-in-Time Recovery**: Granular recovery capabilities
- **Disaster Recovery**: Complete disaster recovery procedures
- **Data Migration**: Tools for data migration and upgrades

## Operations Best Practices
✅ Monitoring setup guides
✅ Backup procedures documented
✅ Security configuration guides
✅ Performance optimization tips
🔄 Automated deployment scripts
🔄 Kubernetes deployment manifests`
  }
];
