
export interface ATSDocument {
  id: string;
  title: string;
  category: string;
  type: 'guide' | 'reference' | 'tutorial' | 'api';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime: string;
  tags: string[];
  content: string;
  lastUpdated: string;
  version: string;
}

export const atsDocuments: ATSDocument[] = [
  // System Architecture
  {
    id: 'ats-architecture',
    title: 'ATS System Architecture Overview',
    category: 'Technical Documentation',
    type: 'reference',
    difficulty: 'advanced',
    estimatedReadTime: '15 min',
    tags: ['architecture', 'database', 'api', 'components'],
    lastUpdated: '2025-01-14',
    version: '1.0',
    content: `# ATS System Architecture Overview

## Database Schema & Relationships

The ATS system is built on a robust relational database structure with the following core entities:

### Primary Tables

#### Jobs Table
- **Primary Key**: \`id\` (UUID)
- **Core Fields**: title, description, requirements, location, department
- **Status Management**: draft, active, paused, closed
- **Priority Levels**: low, medium, high, urgent
- **Relationships**: Links to applications, hiring managers

#### Candidates Table
- **Primary Key**: \`id\` (UUID)
- **Personal Info**: first_name, last_name, email, phone, location
- **Professional Data**: current_title, current_company, experience_years
- **Skills & Tags**: JSON arrays for flexible skill management
- **AI Enhancement**: ai_summary field for automated candidate insights

#### Applications Table
- **Primary Key**: \`id\` (UUID)
- **Relationships**: job_id → jobs, candidate_id → candidates
- **Status Pipeline**: applied → screening → interview → offer → hired/rejected
- **AI Features**: ai_match_score, ai_match_reasons
- **Workflow**: interview_feedback (JSON), recruiter_notes

#### Interviews Table
- **Primary Key**: \`id\` (UUID)
- **Scheduling**: scheduled_at, duration_minutes, location/meeting_link
- **Types**: phone, video, onsite, technical
- **Feedback System**: structured feedback JSON, score rating

### Key Relationships

\`\`\`
Jobs (1) ←→ (Many) Applications (Many) ←→ (1) Candidates
Applications (1) ←→ (Many) Interviews
Jobs (Many) ←→ (1) Hiring Manager (User)
\`\`\`

## API Endpoints & Services

### Core Service Methods

#### ATSService (\`src/services/atsService.ts\`)

**Job Management**
- \`getJobs(filters?)\` - Retrieve jobs with optional filtering
- \`createJob(jobData)\` - Create new job posting
- \`updateJob(id, data)\` - Update existing job
- \`deleteJob(id)\` - Remove job posting

**Candidate Management**
- \`getCandidates(filters?)\` - List candidates with search/filter
- \`createCandidate(data)\` - Add new candidate
- \`updateCandidate(id, data)\` - Update candidate information
- \`enrichCandidate(id)\` - Trigger AI/LinkedIn enrichment

**Application Processing**
- \`getApplications(filters?)\` - Retrieve applications
- \`createApplication(jobId, candidateId, data)\` - Apply candidate to job
- \`updateApplicationStatus(id, status)\` - Move through pipeline
- \`getAIMatchScore(jobId, candidateId)\` - Generate match score

## Component Architecture

### Dashboard Layer
- **ATSDashboard**: Main container component
- **ATSMetrics**: KPI visualization
- **ATSTabsContent**: Navigation between sections

### Feature Components
- **Job Management**: JobCard, CreateJobDialog, JobsTable
- **Candidate Management**: CandidateCard, CandidateTable, TalentSearch
- **Application Flow**: ApplicationCard, StatusPipeline
- **Interview System**: InterviewScheduler, FeedbackForm

### Data Flow
1. User actions trigger service calls
2. Services interact with Supabase client
3. Real-time updates via Supabase subscriptions
4. State management through React Query
5. UI updates reflect data changes

## AI Matching System

### Scoring Algorithm
The AI matching system evaluates candidates against job requirements using:

1. **Skills Matching** (40% weight)
   - Required skills vs candidate skills
   - Proficiency level matching
   - Related/transferable skills consideration

2. **Experience Alignment** (30% weight)
   - Years of experience requirements
   - Industry background relevance
   - Role progression analysis

3. **Location & Logistics** (20% weight)
   - Geographic proximity or remote capability
   - Availability date alignment
   - Salary expectation matching

4. **Cultural Fit Indicators** (10% weight)
   - Company size preference
   - Industry interest signals
   - Career trajectory alignment

### Implementation
- Scoring runs automatically on application creation
- Results stored in \`ai_match_score\` (0-100)
- Reasoning provided in \`ai_match_reasons\` array
- Recruiters can override AI recommendations

## Security & Access Control

### Row Level Security (RLS)
- All tables implement tenant isolation
- Users can only access their organization's data
- Role-based permissions for different user types

### Data Privacy
- Sensitive candidate information encrypted
- Audit logging for all data access
- GDPR compliance features built-in

---

*This architecture supports enterprise-scale recruitment operations while maintaining flexibility for customization.*`
  },

  // User Guide - Administrators
  {
    id: 'ats-admin-guide',
    title: 'ATS Administrator Guide',
    category: 'User Training',
    type: 'guide',
    difficulty: 'intermediate',
    estimatedReadTime: '25 min',
    tags: ['admin', 'setup', 'configuration', 'management'],
    lastUpdated: '2025-01-14',
    version: '1.0',
    content: `# ATS Administrator Guide

## System Setup & Configuration

### Initial Setup Checklist

✅ **Tenant Configuration**
- Verify organization details in tenant settings
- Configure company branding and logos
- Set up email domains and authentication

✅ **User Management**
- Create user accounts for HR team and recruiters
- Assign appropriate roles and permissions
- Set up hiring manager access levels

✅ **System Preferences**
- Configure default job posting templates
- Set up application status workflow
- Define interview types and duration standards

### User Role Management

#### Available Roles

**Super Admin**
- Full system access across all tenants
- Can create and manage organizations
- Access to global settings and analytics

**Tenant Admin**
- Full access within their organization
- User management and role assignment
- System configuration and customization

**Hiring Manager**
- Manage jobs in their department
- Review applications and candidates
- Schedule interviews and provide feedback

**Recruiter**
- Create and manage job postings
- Add and organize candidates
- Manage application pipeline
- Conduct initial screening

**HR User**
- Read-only access to recruitment data
- Generate reports and analytics
- Candidate database access

#### Setting Up Users

1. **Navigate to User Management**
   - Go to Admin Panel → Users
   - Click "Add New User"

2. **Create User Profile**
   \`\`\`
   Email: user@company.com
   Full Name: John Smith
   Role: Recruiter
   Department: Engineering
   \`\`\`

3. **Assign Permissions**
   - Select appropriate role
   - Configure department access
   - Set data visibility limits

### Tenant-Specific Customization

#### Custom Fields Configuration

**Adding Custom Fields to Candidate Profiles**

1. Navigate to Settings → Custom Fields
2. Select "Candidate" entity type
3. Configure field properties:
   - Field Type: Text, Number, Dropdown, Date
   - Required/Optional status
   - Default values
   - Validation rules

**Example Custom Fields:**
- Previous Salary: Number field with currency
- Visa Status: Dropdown with options
- Security Clearance: Boolean field
- Preferred Start Date: Date field

#### Job Template Management

Create standardized job posting templates:

1. **Template Structure**
   \`\`\`
   Job Title: [Title]
   Department: [Department]
   Location: [Location/Remote]
   Employment Type: [Full-time/Part-time/Contract]
   
   Requirements:
   - [Skill 1]
   - [Skill 2]
   - [Experience Level]
   
   Responsibilities:
   - [Key Responsibility 1]
   - [Key Responsibility 2]
   \`\`\`

2. **Template Variables**
   - Use placeholders for common fields
   - Set department-specific requirements
   - Include salary range guidelines

### Analytics & Reporting Configuration

#### KPI Dashboard Setup

**Primary Metrics to Track:**
- Time to Fill: Average days from job posting to hire
- Cost per Hire: Total recruitment costs / number of hires
- Source Effectiveness: Which channels bring best candidates
- Pipeline Conversion: Application → Interview → Offer → Hire rates

**Setting Up Custom Reports:**

1. **Navigate to Reports & Analytics**
2. **Create New Report**
   - Select data source (Jobs, Candidates, Applications)
   - Choose visualization type
   - Configure filters and grouping

3. **Schedule Automated Reports**
   - Set delivery frequency (Daily/Weekly/Monthly)
   - Configure recipient list
   - Format preferences (PDF/Excel/Email)

#### Performance Monitoring

**System Health Metrics:**
- User activity and engagement
- Data completeness scores
- AI matching accuracy rates
- Interview scheduling efficiency

**Quality Metrics:**
- Candidate source diversity
- Hiring manager satisfaction scores
- Time-to-productivity for new hires

### Integration Management

#### LinkedIn Integration Setup

1. **Obtain LinkedIn API Credentials**
   - Register application with LinkedIn
   - Configure OAuth permissions
   - Set up callback URLs

2. **System Configuration**
   \`\`\`
   Settings → Integrations → LinkedIn
   API Key: [Your API Key]
   Secret: [Your Secret]
   Permissions: r_liteprofile, r_emailaddress
   \`\`\`

3. **User Authentication**
   - Guide users through LinkedIn connection
   - Test profile enrichment features
   - Monitor API usage limits

#### Email System Configuration

**SMTP Setup for Notifications:**
\`\`\`
Server: smtp.company.com
Port: 587
Security: STARTTLS
Authentication: Required
\`\`\`

**Email Templates:**
- Application confirmation
- Interview invitations
- Status update notifications
- Rejection notifications

### Backup & Security

#### Data Backup Procedures

1. **Automated Backups**
   - Daily database snapshots
   - File attachment backups
   - Configuration exports

2. **Manual Backup Process**
   - Export candidate data
   - Save custom field configurations
   - Document integration settings

#### Security Best Practices

- Enable two-factor authentication
- Regular password policy updates
- Audit log monitoring
- Access review quarterly

### Troubleshooting Common Issues

#### User Access Problems
**Issue**: User cannot see certain jobs or candidates
**Solution**: Check role permissions and department assignments

#### Email Notifications Not Working
**Issue**: Users not receiving automated emails
**Solution**: Verify SMTP settings and email template configuration

#### Slow Performance
**Issue**: System running slowly
**Solution**: Check database indexes and clear browser cache

---

*Regular maintenance and monitoring ensure optimal ATS performance and user satisfaction.*`
  },

  // User Guide - Recruiters/HR
  {
    id: 'ats-recruiter-guide',
    title: 'Recruiter & HR User Guide',
    category: 'User Training',
    type: 'guide',
    difficulty: 'beginner',
    estimatedReadTime: '30 min',
    tags: ['recruiter', 'hr', 'workflow', 'candidates', 'jobs'],
    lastUpdated: '2025-01-14',
    version: '1.0',
    content: `# Recruiter & HR User Guide

## Getting Started with the ATS

### Dashboard Overview

When you log in, you'll see the main ATS dashboard with:

**Key Metrics Cards**
- Total Candidates: Current candidate database size
- Active Jobs: Currently open positions
- Applications: Pending applications requiring attention
- Interviews Scheduled: Upcoming interviews this week

**Quick Actions**
- ➕ Create New Job
- 👤 Add Candidate
- 📊 View Analytics
- 📧 Send Communications

### Navigation Structure

**Main Tabs:**
- **Overview**: Dashboard with key metrics and recent activity
- **Jobs**: Manage job postings and requirements
- **Candidates**: Candidate database and profiles
- **Applications**: Application pipeline and status tracking
- **Analytics**: Recruitment metrics and reporting

## Creating and Managing Job Postings

### Step-by-Step Job Creation

1. **Access Job Creation**
   - Click "Jobs" tab
   - Click "Create New Job" button
   - Or use quick action from dashboard

2. **Basic Job Information**
   \`\`\`
   Job Title: Senior Software Engineer
   Department: Engineering
   Location: New York, NY (Remote Optional)
   Employment Type: Full-time
   Priority Level: High
   \`\`\`

3. **Job Requirements**
   
   **Skills Section:**
   - Add required skills (e.g., "JavaScript", "React", "Node.js")
   - Specify experience levels
   - Include nice-to-have skills separately

   **Experience Requirements:**
   - Years of experience: 5-8 years
   - Educational background
   - Certifications needed

4. **Compensation & Benefits**
   \`\`\`
   Salary Range: $120,000 - $150,000
   Benefits: Health, Dental, 401k, PTO
   Remote Work: Hybrid (3 days in office)
   \`\`\`

5. **Job Description Template**
   \`\`\`
   ## About the Role
   We are seeking a Senior Software Engineer to join our growing team...

   ## Key Responsibilities
   - Design and develop scalable web applications
   - Collaborate with cross-functional teams
   - Mentor junior developers

   ## Requirements
   - 5+ years of JavaScript development
   - Experience with React and Node.js
   - Strong problem-solving skills

   ## What We Offer
   - Competitive salary and equity
   - Flexible work arrangements
   - Professional development opportunities
   \`\`\`

### Managing Job Status

**Job Status Options:**
- **Draft**: Job being prepared, not visible to candidates
- **Active**: Published and accepting applications
- **Paused**: Temporarily stopped accepting applications
- **Closed**: Position filled or cancelled

**Status Management Tips:**
- Use "Draft" while finalizing job details
- "Pause" when reviewing current applications
- Update to "Closed" immediately when position is filled

### Job Posting Best Practices

**Effective Job Titles:**
✅ "Senior Frontend Developer - React"
✅ "Marketing Manager - SaaS Experience"
❌ "Rockstar Developer Ninja"
❌ "Marketing Guru"

**Clear Requirements:**
- Separate "must-have" from "nice-to-have"
- Be specific about experience levels
- Include relevant technologies and tools

## Adding and Managing Candidates

### Adding New Candidates

1. **Candidate Information Form**
   \`\`\`
   Personal Information:
   - First Name: Sarah
   - Last Name: Johnson
   - Email: sarah.johnson@email.com
   - Phone: (555) 123-4567
   - Location: San Francisco, CA

   Professional Details:
   - Current Title: Frontend Developer
   - Current Company: Tech Startup Inc.
   - Years of Experience: 4
   - LinkedIn Profile: linkedin.com/in/sarahjohnson
   \`\`\`

2. **Skills and Expertise**
   - Add technical skills: React, TypeScript, CSS
   - Include soft skills: Leadership, Communication
   - Rate proficiency levels where applicable

3. **Upload Resume and Documents**
   - PDF format preferred
   - Ensure file names are descriptive
   - Add cover letters if provided

### Candidate Profile Management

#### Enhanced Profiles with AI

The system automatically enhances candidate profiles:

**AI Summary Generation:**
- Automatically analyzes resume content
- Generates summary of key qualifications
- Highlights relevant experience for current roles

**LinkedIn Enrichment:**
- Pulls additional profile information
- Updates work history and education
- Adds professional connections data

#### Candidate Tags and Organization

**Tagging System:**
- **Skill Tags**: "React Expert", "Team Lead", "Remote Preferred"
- **Status Tags**: "Interview Ready", "Relocating", "Notice Period"
- **Source Tags**: "LinkedIn", "Referral", "Job Board"

**Using Tags Effectively:**
\`\`\`
Technical Skills: JavaScript, Python, AWS
Seniority: Senior, Lead, Principal
Availability: Immediate, 2 weeks, 1 month
Location: NYC, Remote, Willing to Relocate
\`\`\`

### Candidate Search and Filtering

#### Advanced Search Features

**Quick Search:**
- Type candidate name, email, or company
- Search across all text fields
- Real-time results as you type

**Advanced Filters:**
\`\`\`
Skills: Contains "React" AND "TypeScript"
Experience: 3-7 years
Location: Within 50 miles of NYC
Availability: Next 30 days
Salary Expectation: $80k - $120k
\`\`\`

**Saved Searches:**
- Save frequently used filter combinations
- Name searches descriptively
- Share with team members

## Managing the Application Pipeline

### Application Status Workflow

**Standard Pipeline Stages:**

1. **Applied** → Candidate submits application
2. **Screening** → Initial resume review
3. **Interview** → Phone/video/onsite interviews
4. **Offer** → Job offer extended
5. **Hired** → Candidate accepts and starts
6. **Rejected** → Not moving forward

### Processing Applications

#### Initial Application Review

1. **Review Application**
   - Check AI match score (0-100 scale)
   - Review match reasoning provided by system
   - Consider recruiter notes and candidate history

2. **AI Match Score Interpretation**
   \`\`\`
   90-100: Excellent match - Priority review
   75-89:  Strong match - Good candidate
   60-74:  Moderate match - Consider if pipeline thin
   Below 60: Weak match - Likely pass unless exceptional circumstances
   \`\`\`

3. **Making Decisions**
   - Move promising candidates to "Screening"
   - Add detailed notes about decision reasoning
   - Reject unsuitable candidates with feedback

#### Moving Through Pipeline

**Screening Stage:**
- Conduct initial phone/video screening
- Verify basic qualifications and interest
- Assess communication skills and culture fit

**Interview Stage:**
- Schedule appropriate interview types
- Coordinate with hiring managers
- Collect structured feedback

**Offer Stage:**
- Negotiate terms and conditions
- Handle reference checks
- Manage offer logistics

### Interview Management

#### Scheduling Interviews

1. **Interview Types Available:**
   - **Phone**: Initial screening call (30 minutes)
   - **Video**: Technical or panel interview (60 minutes)
   - **Onsite**: In-person final round (2-4 hours)
   - **Technical**: Coding challenge or presentation

2. **Scheduling Process:**
   \`\`\`
   Interview Details:
   Type: Video Interview
   Duration: 60 minutes
   Interviewer: John Smith (Hiring Manager)
   Date/Time: March 15, 2025 at 2:00 PM EST
   Meeting Link: [Automatically generated]
   \`\`\`

3. **Interview Preparation:**
   - Send calendar invites to all participants
   - Include candidate profile and resume
   - Provide interview guide and questions
   - Share video conference details

#### Collecting Interview Feedback

**Structured Feedback Form:**
\`\`\`
Technical Skills: [1-5 rating]
Communication: [1-5 rating]
Problem Solving: [1-5 rating]
Culture Fit: [1-5 rating]

Comments:
- Strengths observed
- Areas of concern
- Specific examples
- Recommendation (Hire/No Hire)
\`\`\`

**Best Practices for Feedback:**
- Complete feedback within 24 hours
- Be specific with examples
- Focus on job-relevant observations
- Avoid unconscious bias

## Using AI Matching and Recommendations

### Understanding AI Match Scores

The AI system evaluates candidates against job requirements:

**Scoring Factors:**
- **Skills Alignment** (40%): Required vs. candidate skills
- **Experience Match** (30%): Years and relevance of experience  
- **Location Fit** (20%): Geographic and remote work compatibility
- **Additional Factors** (10%): Education, certifications, etc.

### AI-Generated Insights

**Match Reasoning Examples:**
\`\`\`
Strengths:
✅ Strong React and JavaScript experience (5+ years)
✅ Previous SaaS company experience
✅ Located in target market
✅ Salary expectations align

Considerations:
⚠️ Limited Node.js backend experience
⚠️ No team leadership experience
⚠️ Shorter tenure at previous roles
\`\`\`

### Leveraging AI Recommendations

**Candidate Sourcing:**
- Review AI-suggested candidates for open roles
- Use similarity matching to find candidates like successful hires
- Identify passive candidates who match job requirements

**Application Prioritization:**
- Focus on high-scoring applications first
- Investigate reasoning for surprising scores
- Use scores to guide initial screening decisions

## Communication and Notifications

### Candidate Communication

#### Email Templates

**Application Acknowledgment:**
\`\`\`
Subject: Application Received - [Job Title] at [Company]

Dear [Candidate Name],

Thank you for your interest in the [Job Title] position at [Company]. 
We have received your application and will review it carefully.

Our typical process includes:
1. Application review (3-5 business days)
2. Initial screening call
3. Technical/panel interviews
4. Final decision

We will update you on your application status within one week.

Best regards,
[Recruiter Name]
\`\`\`

**Interview Invitation:**
\`\`\`
Subject: Interview Invitation - [Job Title]

Dear [Candidate Name],

We are excited to move forward with your application for [Job Title]. 
We would like to schedule a [Interview Type] interview.

Interview Details:
- Date: [Date]
- Time: [Time] 
- Duration: [Duration]
- Format: [Video/Phone/In-person]
- Interviewer(s): [Names and titles]

Please confirm your availability or suggest alternative times.

Looking forward to speaking with you!

Best regards,
[Recruiter Name]
\`\`\`

#### Status Update Communications

Keep candidates informed throughout the process:
- Acknowledge applications within 24 hours
- Provide status updates at each stage
- Send timely rejections with feedback when possible
- Celebrate offers and successful hires

### Internal Team Communication

**Hiring Manager Updates:**
- Weekly pipeline reviews
- Urgent application alerts
- Interview feedback summaries
- Offer recommendation reports

**Team Collaboration:**
- Share candidate profiles with stakeholders
- Coordinate interview schedules
- Discuss challenging hiring decisions
- Celebrate successful placements

## Analytics and Performance Tracking

### Key Recruitment Metrics

#### Pipeline Metrics

**Time to Fill:**
- Track days from job posting to hire
- Identify bottlenecks in the process
- Compare across different roles and departments

**Conversion Rates:**
\`\`\`
Application → Screening: 25%
Screening → Interview: 60%
Interview → Offer: 30%
Offer → Hire: 85%
\`\`\`

#### Quality Metrics

**Source Effectiveness:**
- LinkedIn: 35% of quality hires
- Employee Referrals: 25% of quality hires
- Job Boards: 20% of quality hires
- Company Website: 15% of quality hires
- Other: 5% of quality hires

**Hiring Manager Satisfaction:**
- Survey hiring managers quarterly
- Track feedback on candidate quality
- Measure time-to-productivity for new hires

### Using Analytics for Improvement

#### Weekly Pipeline Review

1. **Review Active Jobs**
   - Check application volume
   - Assess candidate quality
   - Identify struggling positions

2. **Analyze Bottlenecks**
   - Long time-to-fill roles
   - Low application-to-interview rates
   - High offer rejection rates

3. **Optimize Process**
   - Adjust job descriptions for better applications
   - Streamline interview processes
   - Improve candidate experience

#### Monthly Performance Reports

**Recruiter Performance:**
- Number of roles filled
- Time to fill averages
- Candidate satisfaction scores
- Hiring manager feedback

**System Utilization:**
- User engagement metrics
- Feature adoption rates
- AI match score accuracy
- Communication response rates

## Troubleshooting and Common Issues

### Common Workflow Issues

#### Candidate Not Responding

**Potential Causes:**
- Email went to spam folder
- Candidate changed their mind
- Competing offers from other companies
- Unclear communication

**Solutions:**
- Try alternative contact methods
- Send follow-up after 3-5 days
- Improve initial communication clarity
- Set clear expectations for response times

#### Hiring Manager Delays

**Common Problems:**
- Slow interview feedback
- Delayed interview scheduling
- Changing job requirements

**Solutions:**
- Set clear SLA expectations
- Send automated reminder emails
- Escalate to HR leadership when needed
- Document delays for process improvement

#### Technical Issues

**Profile/Application Not Loading:**
1. Refresh browser page
2. Clear browser cache
3. Try different browser
4. Contact technical support

**Email Notifications Not Working:**
1. Check spam/junk folders
2. Verify email address accuracy
3. Update notification preferences
4. Test with different email provider

### Best Practices Summary

#### Daily Habits
- Check application notifications first thing
- Update candidate statuses promptly
- Respond to candidate communications within 24 hours
- Review AI match scores for new applications

#### Weekly Routines
- Conduct pipeline review with hiring managers
- Update job posting requirements based on market feedback
- Analyze source effectiveness
- Send status updates to active candidates

#### Monthly Activities
- Review recruitment metrics and KPIs
- Update candidate sourcing strategies
- Gather feedback from hiring managers
- Optimize job descriptions and requirements

---

*Consistent use of these workflows and best practices will help you build a successful and efficient recruitment process.*`
  },

  // Quick Reference Guide
  {
    id: 'ats-quick-reference',
    title: 'ATS Quick Reference & Shortcuts',
    category: 'User Training',
    type: 'reference',
    difficulty: 'beginner',
    estimatedReadTime: '10 min',
    tags: ['shortcuts', 'tips', 'quick-reference', 'workflow'],
    lastUpdated: '2025-01-14',
    version: '1.0',
    content: `# ATS Quick Reference & Shortcuts

## Keyboard Shortcuts

### Global Navigation
- \`Ctrl + 1\` - Dashboard/Overview
- \`Ctrl + 2\` - Jobs Section
- \`Ctrl + 3\` - Candidates Section
- \`Ctrl + 4\` - Applications Section
- \`Ctrl + 5\` - Analytics Section

### Quick Actions
- \`Ctrl + N\` - Create New Job
- \`Ctrl + Shift + N\` - Add New Candidate
- \`Ctrl + F\` - Focus Search Bar
- \`Ctrl + Shift + F\` - Advanced Search
- \`Esc\` - Close Modal/Dialog

### Application Management
- \`A\` - Approve/Advance Application
- \`R\` - Reject Application
- \`I\` - Schedule Interview
- \`N\` - Add Note to Application
- \`E\` - Edit Application Details

## Common Workflows

### 🚀 Quick Job Posting (2 minutes)

1. **Press \`Ctrl + N\`** → Opens job creation form
2. **Fill essentials:**
   - Title: "Senior React Developer"
   - Department: Select from dropdown
   - Location: Type or select
   - Priority: Choose level
3. **Use template** → Click "Load Template" → Select relevant template
4. **Quick requirements:**
   - Add 3-5 key skills
   - Set experience range
   - Add salary range
5. **Publish** → Change status to "Active"

### 📝 Fast Candidate Addition (3 minutes)

1. **Press \`Ctrl + Shift + N\`** → Opens candidate form
2. **Basic info:**
   - Name and email (required)
   - Phone and location
   - Current role and company
3. **Upload resume** → Drag & drop PDF
4. **Auto-fill** → Click "Extract from Resume" 
5. **Add tags** → Type and press Enter
6. **Save** → Candidate added to database

### ⚡ Speed Application Review (30 seconds per app)

1. **Review AI score** → Check match percentage
2. **Scan reasoning** → Read key strengths/concerns
3. **Quick decision:**
   - 80%+ score → Advance to screening
   - 60-79% → Review resume
   - <60% → Likely reject
4. **Add note** → Press \`N\` → Type quick feedback
5. **Update status** → Press \`A\` or \`R\`

## Status Codes & Meanings

### Job Status
| Code | Status | Meaning |
|------|--------|---------|
| 🟢 | Active | Accepting applications |
| 🟡 | Draft | Being prepared |
| ⏸️ | Paused | Temporarily closed |
| 🔴 | Closed | Position filled/cancelled |

### Application Status
| Code | Status | Next Action |
|------|--------|-------------|
| 📥 | Applied | Initial review |
| 📞 | Screening | Phone/video call |
| 🤝 | Interview | Schedule interviews |
| 💼 | Offer | Extend job offer |
| ✅ | Hired | Onboarding |
| ❌ | Rejected | Send feedback |

### Interview Types
| Icon | Type | Duration | Purpose |
|------|------|----------|---------|
| 📞 | Phone | 30 min | Initial screening |
| 📹 | Video | 60 min | Technical/panel |
| 🏢 | Onsite | 2-4 hrs | Final round |
| 💻 | Technical | 90 min | Coding challenge |

## AI Match Score Guide

### Score Interpretation
- **90-100**: 🟢 Excellent match - Priority review
- **75-89**: 🟡 Strong match - Good candidate  
- **60-74**: 🟠 Moderate match - Consider carefully
- **40-59**: 🔴 Weak match - Likely pass
- **<40**: ⚫ Poor match - Auto-reject

### Match Factors
| Factor | Weight | What It Measures |
|--------|--------|------------------|
| Skills | 40% | Required vs candidate skills |
| Experience | 30% | Years and relevance |
| Location | 20% | Geographic/remote fit |
| Other | 10% | Education, certs, etc. |

## Search Tips & Tricks

### Advanced Search Operators

**Skill Searches:**
- \`skills:React\` - Exact skill match
- \`skills:React,TypeScript\` - Must have both
- \`skills:React OR Vue\` - Either skill
- \`skills:NOT PHP\` - Exclude skill

**Experience Searches:**
- \`experience:5+\` - 5 or more years
- \`experience:3-7\` - Between 3-7 years
- \`experience:<2\` - Less than 2 years

**Location Searches:**
- \`location:"New York"\` - Exact city
- \`location:remote\` - Remote workers
- \`location:50mi:NYC\` - Within 50 miles of NYC

**Combined Searches:**
\`\`\`
skills:React,TypeScript experience:5+ location:remote
\`\`\`

### Saved Search Shortcuts

**Create Quick Searches:**
1. Build complex filter
2. Click "Save Search"
3. Name it descriptively: "Senior Frontend Remote"
4. Access from sidebar

**Common Saved Searches:**
- "React Developers 5+ Years"
- "Remote Data Scientists"
- "NYC Marketing Managers"
- "Entry Level Developers"

## Email Templates (Copy & Paste)

### Application Received
\`\`\`
Subject: Application Received - {{JOB_TITLE}}

Hi {{CANDIDATE_NAME}},

Thanks for applying to {{JOB_TITLE}} at {{COMPANY_NAME}}. 

We'll review your application and get back to you within 3-5 business days.

Best,
{{RECRUITER_NAME}}
\`\`\`

### Interview Invitation
\`\`\`
Subject: Interview Invitation - {{JOB_TITLE}}

Hi {{CANDIDATE_NAME}},

We'd like to schedule a {{INTERVIEW_TYPE}} interview for {{JOB_TITLE}}.

Available times:
- {{TIME_OPTION_1}}
- {{TIME_OPTION_2}}
- {{TIME_OPTION_3}}

Please confirm which works best.

Best,
{{RECRUITER_NAME}}
\`\`\`

### Polite Rejection
\`\`\`
Subject: Update on your application - {{JOB_TITLE}}

Hi {{CANDIDATE_NAME}},

Thank you for your interest in {{JOB_TITLE}}. After careful consideration, we've decided to move forward with other candidates.

We were impressed by {{POSITIVE_FEEDBACK}} and encourage you to apply for future opportunities.

Best wishes,
{{RECRUITER_NAME}}
\`\`\`

## Troubleshooting Quick Fixes

### Common Issues

**🔧 Can't see applications:**
- Check filters → Reset to "All"
- Verify job status → Must be "Active"
- Clear browser cache → Ctrl + F5

**🔧 Email notifications not working:**
- Check spam folder
- Verify email in profile settings
- Test with different browser

**🔧 Slow performance:**
- Close unused browser tabs
- Clear application cache
- Use Chrome for best performance

**🔧 AI scores seem wrong:**
- Check job requirements completeness
- Verify candidate skills are properly tagged
- Contact admin if consistently inaccurate

### Emergency Contacts

**Technical Issues:**
- IT Support: support@company.com
- Phone: (555) 123-4567
- Internal Chat: #ats-support

**Process Questions:**
- HR Manager: hr-manager@company.com
- Training Lead: training@company.com

## Daily Checklist

### Morning Routine (10 minutes)
- [ ] Check overnight applications
- [ ] Review scheduled interviews for today
- [ ] Respond to urgent candidate emails
- [ ] Update hiring manager on priority roles

### Midday Check (5 minutes)
- [ ] Process new applications
- [ ] Send interview confirmations
- [ ] Update application statuses
- [ ] Check for system notifications

### End of Day (10 minutes)
- [ ] Complete interview feedback forms
- [ ] Send status updates to candidates
- [ ] Review tomorrow's interview schedule
- [ ] Update recruiter notes

## Performance Tips

### Efficiency Hacks
1. **Batch similar tasks** - Review all applications at once
2. **Use templates** - Don't rewrite common emails
3. **Set up filters** - Create views for different priorities
4. **Keyboard shortcuts** - Learn the top 10 shortcuts
5. **Mobile app** - Handle urgent items on the go

### Time-Saving Features
- **Auto-scheduling** - Let system find available times
- **Bulk actions** - Update multiple applications
- **Smart notifications** - Only get alerts that matter
- **Quick notes** - Voice-to-text for interview feedback

---

*Master these shortcuts and workflows to become an ATS power user! 🚀*`
  },

  // Integration Documentation
  {
    id: 'ats-integrations',
    title: 'ATS Integration & Advanced Features',
    category: 'Technical Documentation',
    type: 'guide',
    difficulty: 'advanced',
    estimatedReadTime: '20 min',
    tags: ['integrations', 'linkedin', 'email', 'api', 'automation'],
    lastUpdated: '2025-01-14',
    version: '1.0',
    content: `# ATS Integration & Advanced Features

## LinkedIn Profile Enrichment

### Overview
The LinkedIn integration automatically enhances candidate profiles with professional data, work history, and mutual connections.

### Setup Requirements

#### LinkedIn API Configuration
\`\`\`typescript
// LinkedIn API Credentials Setup
const linkedinConfig = {
  clientId: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  redirectUri: 'https://your-domain.com/auth/linkedin/callback',
  scope: ['r_liteprofile', 'r_emailaddress', 'r_organization_social']
};
\`\`\`

#### Required Permissions
- **r_liteprofile**: Basic profile information
- **r_emailaddress**: Email address verification
- **r_organization_social**: Company information

### Implementation Details

#### Profile Enrichment Service
\`\`\`typescript
// src/services/linkedinEnrichmentService.ts
class LinkedInEnrichmentService {
  async enrichCandidateProfile(candidateId: string, linkedinUrl: string) {
    // Extract LinkedIn profile data
    const profileData = await this.fetchLinkedInProfile(linkedinUrl);
    
    // Enhanced data structure
    const enrichmentData = {
      experience: profileData.positions,
      education: profileData.educations,
      skills: profileData.skills,
      connections: profileData.numConnections,
      recommendations: profileData.recommendations,
      publications: profileData.publications
    };
    
    // Store enriched data
    await this.storeEnrichmentData(candidateId, enrichmentData);
  }
}
\`\`\`

#### Automatic Profile Matching
The system uses fuzzy matching to connect LinkedIn profiles with existing candidates:

**Matching Criteria:**
1. Email address exact match (highest confidence)
2. Full name + current company (high confidence)
3. Full name + location (medium confidence)
4. Name similarity + multiple data points (low confidence)

**Match Confidence Scoring:**
\`\`\`typescript
interface ProfileMatch {
  candidateId: string;
  linkedinProfileId: string;
  matchConfidence: number; // 0.0 - 1.0
  matchingFactors: string[];
}
\`\`\`

### Enrichment Workflow

#### Manual Enrichment
1. **Candidate Profile Page**
   - Click "Enrich from LinkedIn" button
   - Paste LinkedIn profile URL
   - System fetches and processes data
   - Review and approve changes

2. **Bulk Enrichment**
   - Select multiple candidates
   - Choose "Bulk LinkedIn Enrichment"
   - System processes candidates with LinkedIn URLs
   - Generate enrichment report

#### Automated Enrichment
\`\`\`typescript
// Triggered on candidate creation
async function onCandidateCreated(candidate: Candidate) {
  if (candidate.linkedin_url) {
    // Queue for background enrichment
    await enrichmentQueue.add('linkedin-enrichment', {
      candidateId: candidate.id,
      linkedinUrl: candidate.linkedin_url
    });
  }
}
\`\`\`

### Data Quality & Validation

#### Enrichment Data Structure
\`\`\`typescript
interface LinkedInEnrichmentData {
  basicInfo: {
    headline: string;
    summary: string;
    location: string;
    industry: string;
    currentPosition: string;
  };
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  recommendations: Recommendation[];
  lastUpdated: string;
  dataSource: 'linkedin-api' | 'manual-input';
}
\`\`\`

#### Quality Metrics
- **Data Completeness**: Percentage of fields populated
- **Recency Score**: How recently profile was updated
- **Verification Status**: Email/phone verified through LinkedIn

## Email System Integration

### SMTP Configuration

#### Multi-Provider Support
\`\`\`typescript
interface EmailProvider {
  name: 'sendgrid' | 'mailgun' | 'smtp' | 'ses';
  config: {
    apiKey?: string;
    host?: string;
    port?: number;
    secure?: boolean;
    auth?: {
      user: string;
      pass: string;
    };
  };
}
\`\`\`

#### Email Template System

**Template Structure:**
\`\`\`typescript
interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: TemplateVariable[];
  triggers: EmailTrigger[];
}

interface TemplateVariable {
  name: string;
  type: 'string' | 'date' | 'number' | 'boolean';
  required: boolean;
  defaultValue?: string;
}
\`\`\`

**Available Variables:**
\`\`\`
{{candidate.firstName}}
{{candidate.lastName}}
{{candidate.email}}
{{job.title}}
{{job.department}}
{{company.name}}
{{recruiter.name}}
{{recruiter.email}}
{{interview.date}}
{{interview.time}}
{{interview.meetingLink}}
\`\`\`

### Automated Email Workflows

#### Trigger-Based Automation
\`\`\`typescript
const emailTriggers = [
  {
    event: 'application.created',
    template: 'application-confirmation',
    delay: '0 minutes',
    condition: 'always'
  },
  {
    event: 'application.status.interview',
    template: 'interview-invitation',
    delay: '15 minutes',
    condition: 'interview_scheduled'
  },
  {
    event: 'application.status.rejected',
    template: 'polite-rejection',
    delay: '1 hour',
    condition: 'feedback_provided'
  }
];
\`\`\`

#### Email Sequences
\`\`\`typescript
// Follow-up sequence for non-responsive candidates
const followUpSequence = [
  { day: 0, template: 'initial-outreach' },
  { day: 3, template: 'gentle-reminder' },
  { day: 7, template: 'final-follow-up' },
  { day: 14, template: 'move-to-nurture-list' }
];
\`\`\`

### Email Analytics & Tracking

#### Engagement Metrics
\`\`\`typescript
interface EmailMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  replied: number;
  bounced: number;
  unsubscribed: number;
  openRate: number;
  clickThroughRate: number;
  responseRate: number;
}
\`\`\`

## Custom Field Configuration

### Dynamic Field Types

#### Field Type Definitions
\`\`\`typescript
type CustomFieldType = 
  | 'text'           // Single line text
  | 'textarea'       // Multi-line text
  | 'number'         // Numeric values
  | 'currency'       // Money values
  | 'date'           // Date picker
  | 'datetime'       // Date and time
  | 'boolean'        // Checkbox
  | 'select'         // Single select dropdown
  | 'multiselect'    // Multiple selection
  | 'radio'          // Radio buttons
  | 'file'           // File upload
  | 'url'            // URL validation
  | 'email'          // Email validation
  | 'phone';         // Phone number
\`\`\`

#### Field Configuration
\`\`\`typescript
interface CustomFieldConfig {
  id: string;
  name: string;
  key: string;
  type: CustomFieldType;
  required: boolean;
  applicableForms: string[]; // ['candidate', 'job', 'application']
  
  // Type-specific options
  options?: SelectOption[];
  validation?: FieldValidation;
        defaultValue?: unknown;
  helpText?: string;
  
  // Display options
  sortOrder: number;
  section?: string;
  conditional?: ConditionalLogic;
}
\`\`\`

### Implementation Examples

#### Candidate Custom Fields
\`\`\`typescript
// Security clearance field for government contractors
const securityClearanceField = {
  name: 'Security Clearance',
  key: 'security_clearance',
  type: 'select',
  required: false,
  options: [
    { value: 'none', label: 'None' },
    { value: 'confidential', label: 'Confidential' },
    { value: 'secret', label: 'Secret' },
    { value: 'top_secret', label: 'Top Secret' }
  ],
  applicableForms: ['candidate']
};

// Visa status for international hiring
const visaStatusField = {
  name: 'Visa Status',
  key: 'visa_status',
  type: 'select',
  required: true,
  options: [
    { value: 'citizen', label: 'US Citizen' },
    { value: 'permanent_resident', label: 'Permanent Resident' },
    { value: 'h1b', label: 'H1B Visa' },
    { value: 'opt', label: 'OPT' },
    { value: 'requires_sponsorship', label: 'Requires Sponsorship' }
  ],
  applicableForms: ['candidate', 'application']
};
\`\`\`

### Conditional Field Logic

#### Dynamic Field Display
\`\`\`typescript
interface ConditionalLogic {
  showWhen: {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'gt' | 'lt';
    value: unknown;
  };
  hideWhen?: {
    field: string;
    operator: string;
    value: unknown;
  };
}

// Example: Show relocation budget only if candidate willing to relocate
const relocationBudgetField = {
  name: 'Relocation Budget',
  key: 'relocation_budget',
  type: 'currency',
  conditional: {
    showWhen: {
      field: 'willing_to_relocate',
      operator: 'equals',
      value: true
    }
  }
};
\`\`\`

## Bulk Operations & Data Import

### CSV Import System

#### Import Mapping Interface
\`\`\`typescript
interface ImportMapping {
  csvColumn: string;
  systemField: string;
  transformation?: 'uppercase' | 'lowercase' | 'trim' | 'parse_date';
  defaultValue?: string;
  required: boolean;
}

// Example mapping for candidate import
const candidateImportMapping: ImportMapping[] = [
  { csvColumn: 'First Name', systemField: 'first_name', required: true },
  { csvColumn: 'Last Name', systemField: 'last_name', required: true },
  { csvColumn: 'Email', systemField: 'email', required: true },
  { csvColumn: 'Phone', systemField: 'phone', required: false },
  { csvColumn: 'Current Role', systemField: 'current_title', required: false },
  { csvColumn: 'Skills', systemField: 'skills', transformation: 'parse_array' }
];
\`\`\`

#### Import Validation
\`\`\`typescript
interface ImportValidation {
  rowNumber: number;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  status: 'valid' | 'invalid' | 'warning';
}

interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}
\`\`\`

### Bulk Operations

#### Supported Bulk Actions
\`\`\`typescript
type BulkAction = 
  | 'update_status'
  | 'add_tags'
  | 'remove_tags'
  | 'assign_recruiter'
  | 'schedule_interviews'
  | 'send_emails'
  | 'export_data'
  | 'delete_records';

interface BulkOperationConfig {
  action: BulkAction;
  targetIds: string[];
  parameters: Record<string, unknown>;
  confirmationRequired: boolean;
}
\`\`\`

#### Implementation Example
\`\`\`typescript
// Bulk status update for applications
async function bulkUpdateApplicationStatus(
  applicationIds: string[],
  newStatus: ApplicationStatus,
  note?: string
) {
  const updates = applicationIds.map(id => ({
    id,
    status: newStatus,
    updated_at: new Date().toISOString(),
    notes: note ? [note] : []
  }));
  
  // Batch update in database
  await supabase
    .from('applications')
    .upsert(updates);
    
  // Send notifications
  await notificationService.sendBulkStatusUpdates(updates);
}
\`\`\`

## API Integration & Webhooks

### External API Connections

#### Job Board Integrations
\`\`\`typescript
interface JobBoardProvider {
  name: 'indeed' | 'linkedin' | 'glassdoor' | 'monster';
  apiEndpoint: string;
  authentication: {
    type: 'api_key' | 'oauth2';
    credentials: Record<string, string>;
  };
  capabilities: {
    postJobs: boolean;
    syncApplications: boolean;
    candidateSearch: boolean;
  };
}
\`\`\`

#### Background Check Services
\`\`\`typescript
interface BackgroundCheckProvider {
  name: 'checkr' | 'hireright' | 'sterling';
  orderCheck: (candidateId: string, packages: string[]) => Promise<CheckOrder>;
  getStatus: (orderId: string) => Promise<CheckStatus>;
  webhook: {
    url: string;
    events: string[];
  };
}
\`\`\`

### Webhook System

#### Outgoing Webhooks
\`\`\`typescript
interface WebhookSubscription {
  id: string;
  url: string;
  events: WebhookEvent[];
  secret: string;
  active: boolean;
  retryPolicy: {
    maxRetries: number;
    backoffStrategy: 'linear' | 'exponential';
  };
}

type WebhookEvent = 
  | 'candidate.created'
  | 'candidate.updated'
  | 'application.created'
  | 'application.status_changed'
  | 'interview.scheduled'
  | 'offer.extended'
  | 'hire.completed';
\`\`\`

#### Webhook Payload Example
\`\`\`typescript
interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  data: {
    id: string;
    type: 'candidate' | 'application' | 'job' | 'interview';
    attributes: Record<string, unknown>;
    relationships?: Record<string, unknown>;
  };
  metadata: {
    tenantId: string;
    userId: string;
    version: string;
  };
}
\`\`\`

## Advanced Analytics & Reporting

### Custom Report Builder

#### Report Configuration
\`\`\`typescript
interface CustomReport {
  id: string;
  name: string;
  description: string;
  
  dataSource: {
    primaryTable: 'jobs' | 'candidates' | 'applications' | 'interviews';
    joins: JoinConfig[];
    filters: FilterConfig[];
  };
  
  columns: ReportColumn[];
  groupBy: string[];
  sortBy: SortConfig[];
  
  visualization: {
    type: 'table' | 'chart' | 'metric';
    config: VisualizationConfig;
  };
  
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
    format: 'pdf' | 'excel' | 'email';
  };
}
\`\`\`

#### Advanced Metrics
\`\`\`typescript
// Calculated metrics
const advancedMetrics = {
  timeToFill: {
    calculation: 'AVG(DATEDIFF(hired_date, job_posted_date))',
    groupBy: ['department', 'job_level'],
    filters: ['status = hired', 'hired_date >= last_quarter']
  },
  
  sourceEffectiveness: {
    calculation: 'COUNT(hired) / COUNT(applications) * 100',
    groupBy: ['application_source'],
    filters: ['application_date >= last_month']
  },
  
  interviewToOfferRate: {
    calculation: 'COUNT(offers) / COUNT(interviews) * 100',
    groupBy: ['interviewer', 'job_department']
  }
};
\`\`\`

### Predictive Analytics

#### Candidate Success Prediction
\`\`\`typescript
interface PredictiveModel {
  modelType: 'candidate_success' | 'time_to_fill' | 'offer_acceptance';
  features: string[];
  accuracy: number;
  lastTrained: string;
  predictions: Prediction[];
}

interface Prediction {
  candidateId: string;
  jobId: string;
  successProbability: number;
  confidenceInterval: [number, number];
  keyFactors: string[];
}
\`\`\`

---

*These advanced integrations and features provide enterprise-level functionality for complex recruitment operations.*`
  }
];

export interface FormFieldConfig {
  type: string;
  label: string;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  defaultValue?: string | number | boolean | null;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}
