
export interface CompanyRelationship {
  id: string;
  person_id: string;
  company_id: string;
  role: string;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  relationship_type: 'employment' | 'business_contact';
  created_at: string;
  updated_at: string;
}
