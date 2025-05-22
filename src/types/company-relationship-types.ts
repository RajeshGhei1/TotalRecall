
import { JobHistoryItem } from '@/components/people/JobHistoryList';
import { CompanyRelationship } from '@/types/company-relationship';

export interface LinkCompanyRelationshipData {
  person_id: string;
  company_id: string;
  role: string;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  relationship_type: 'employment' | 'business_contact';
  reports_to?: string;
}

export interface ReportingPerson {
  id: string;
  full_name: string;
  email?: string | null;
  type?: string;
  role?: string;
}

export interface ReportingRelationshipsResult {
  manager: ReportingPerson | null;
  directReports: ReportingPerson[];
}

export interface CompanyReportingResult {
  managers: ReportingPerson[];
  directReports: ReportingPerson[];
}
