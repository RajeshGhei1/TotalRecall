
-- Create function to get company network with recursive traversal
CREATE OR REPLACE FUNCTION public.get_company_network(
  root_company_id UUID,
  max_depth INTEGER DEFAULT 2
)
RETURNS TABLE (
  id UUID,
  parent_company_id UUID,
  child_company_id UUID,
  relationship_type_id UUID,
  ownership_percentage NUMERIC,
  effective_date DATE,
  end_date DATE,
  is_active BOOLEAN,
  metadata JSONB,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  parent_company JSONB,
  child_company JSONB,
  relationship_type JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE company_network AS (
    -- Base case: direct relationships of the root company
    SELECT 
      cr.*,
      1 as depth
    FROM company_relationships_advanced cr
    WHERE (cr.parent_company_id = root_company_id OR cr.child_company_id = root_company_id)
      AND cr.is_active = true
    
    UNION ALL
    
    -- Recursive case: relationships of connected companies
    SELECT 
      cr.*,
      cn.depth + 1
    FROM company_relationships_advanced cr
    JOIN company_network cn ON (
      cr.parent_company_id = cn.child_company_id OR 
      cr.parent_company_id = cn.parent_company_id OR
      cr.child_company_id = cn.child_company_id OR
      cr.child_company_id = cn.parent_company_id
    )
    WHERE cn.depth < max_depth
      AND cr.is_active = true
      AND cr.id != cn.id  -- Prevent infinite loops
  )
  SELECT DISTINCT
    cn.id,
    cn.parent_company_id,
    cn.child_company_id,
    cn.relationship_type_id,
    cn.ownership_percentage,
    cn.effective_date,
    cn.end_date,
    cn.is_active,
    cn.metadata,
    cn.notes,
    cn.created_by,
    cn.created_at,
    cn.updated_at,
    -- Parent company details as JSON
    json_build_object(
      'id', pc.id,
      'name', pc.name,
      'industry', pc.industry,
      'size', pc.size,
      'location', pc.location
    ) as parent_company,
    -- Child company details as JSON
    json_build_object(
      'id', cc.id,
      'name', cc.name,
      'industry', cc.industry,
      'size', cc.size,
      'location', cc.location
    ) as child_company,
    -- Relationship type details as JSON
    json_build_object(
      'id', rt.id,
      'name', rt.name,
      'description', rt.description,
      'is_hierarchical', rt.is_hierarchical,
      'allows_percentage', rt.allows_percentage,
      'color', rt.color,
      'icon', rt.icon
    ) as relationship_type
  FROM company_network cn
  LEFT JOIN companies pc ON cn.parent_company_id = pc.id
  LEFT JOIN companies cc ON cn.child_company_id = cc.id
  LEFT JOIN company_relationship_types rt ON cn.relationship_type_id = rt.id
  ORDER BY cn.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
