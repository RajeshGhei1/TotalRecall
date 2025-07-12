
export interface CompanyRelationshipType {
  id: string;
  name: string;
  description: string;
  is_hierarchical: boolean;
  allows_percentage: boolean;
  color: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyRelationshipAdvanced {
  id: string;
  parent_company_id: string;
  child_company_id: string;
  relationship_type_id: string;
  ownership_percentage?: number;
  effective_date: string;
  end_date?: string;
  is_active: boolean;
  metadata: Record<string, unknown>;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  parent_company?: {
    id: string;
    name: string;
  };
  child_company?: {
    id: string;
    name: string;
  };
  relationship_type?: CompanyRelationshipType;
}

export interface CompanyRelationshipHistory {
  id: string;
  relationship_id: string;
  change_type: 'created' | 'updated' | 'deleted';
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  changed_by?: string;
  changed_at: string;
  change_reason?: string;
}

export interface CompanyNetworkNode {
  id: string;
  name: string;
  type: 'company';
  industry?: string;
  size?: string;
  location?: string;
  relationships: CompanyRelationshipAdvanced[];
}

export interface CompanyNetworkEdge {
  id: string;
  source: string;
  target: string;
  relationship: CompanyRelationshipAdvanced;
  type: string;
  label: string;
  color: string;
  animated?: boolean;
}
