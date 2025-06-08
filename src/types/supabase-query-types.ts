
export interface PersonQueryResult {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  type: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyRelationshipQueryResult {
  id: string;
  company: {
    id: string;
    name: string;
  } | null;
  role: string;
  is_current: boolean;
}

export interface EmploymentHistoryQueryResult {
  id: string;
  role: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  reports_to?: string;
  company: {
    id: string;
    name: string;
  } | null;
}
