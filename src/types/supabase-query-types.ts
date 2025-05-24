
// Company relationship query result types
export interface CompanyRelationshipQueryResult {
  id: string;
  person_id: string;
  company_id: string;
  role: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  reports_to: string | null;
  relationship_type: string;
  created_at: string;
  updated_at: string;
}

export interface PersonQueryResult {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  type: 'talent' | 'contact';
  location: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompanyQueryResult {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  location: string | null;
  industry: string | null;
  size: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

// Reporting relationship query results
export interface ManagerRelationshipQueryResult {
  reports_to: string | null;
  manager: {
    id: string;
    full_name: string;
    email: string | null;
    type: string;
  } | null;
}

export interface DirectReportQueryResult {
  person: {
    id: string;
    full_name: string;
    email: string | null;
    type: string;
  };
  role: string;
}

export interface CompanyRelationshipWithPersonQueryResult {
  person_id: string;
  role: string;
  reports_to: string | null;
  person: PersonQueryResult;
}

export interface CompanyRelationshipWithManagerQueryResult {
  role: string;
  person: PersonQueryResult;
}

// Employment history query results
export interface EmploymentHistoryQueryResult {
  id: string;
  role: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  reports_to: string | null;
  company: {
    id: string;
    name: string;
  };
}

// Person with company relationship
export interface PersonWithCurrentCompanyQueryResult extends PersonQueryResult {
  current_company?: {
    id: string;
    name: string;
    role: string;
  };
}

// Company org chart types
export interface OrgChartPersonQueryResult {
  id: string;
  person_id: string;
  role: string;
  reports_to: string | null;
  person: PersonQueryResult;
}
