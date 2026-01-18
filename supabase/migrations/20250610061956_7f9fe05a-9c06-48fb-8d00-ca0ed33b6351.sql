
-- Create relationship types table
CREATE TABLE public.company_relationship_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  is_hierarchical boolean DEFAULT false,
  allows_percentage boolean DEFAULT false,
  color text DEFAULT '#3B82F6',
  icon text DEFAULT 'building',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create advanced company relationships table
CREATE TABLE public.company_relationships_advanced (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  child_company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  relationship_type_id uuid REFERENCES public.company_relationship_types(id),
  ownership_percentage numeric(5,2) CHECK (ownership_percentage >= 0 AND ownership_percentage <= 100),
  effective_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  is_active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}',
  notes text,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT no_self_reference CHECK (parent_company_id != child_company_id),
  CONSTRAINT valid_date_range CHECK (end_date IS NULL OR end_date >= effective_date)
);

-- Create relationship history table for tracking changes
CREATE TABLE public.company_relationship_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_id uuid REFERENCES public.company_relationships_advanced(id) ON DELETE CASCADE,
  change_type text NOT NULL CHECK (change_type IN ('created', 'updated', 'deleted')),
  old_values jsonb,
  new_values jsonb,
  changed_by uuid REFERENCES public.profiles(id),
  changed_at timestamptz DEFAULT now(),
  change_reason text
);

-- Create indexes for better performance
CREATE INDEX idx_company_relationships_advanced_parent ON public.company_relationships_advanced(parent_company_id);
CREATE INDEX idx_company_relationships_advanced_child ON public.company_relationships_advanced(child_company_id);
CREATE INDEX idx_company_relationships_advanced_type ON public.company_relationships_advanced(relationship_type_id);
CREATE INDEX idx_company_relationships_advanced_active ON public.company_relationships_advanced(is_active) WHERE is_active = true;
CREATE INDEX idx_company_relationship_history_relationship ON public.company_relationship_history(relationship_id);

-- Insert standard relationship types
INSERT INTO public.company_relationship_types (name, description, is_hierarchical, allows_percentage, color, icon) VALUES
('Subsidiary', 'A company controlled by another company through ownership of voting stock', true, true, '#10B981', 'building'),
('Parent Company', 'A company that owns enough voting stock in another corporation to control it', true, true, '#3B82F6', 'building-2'),
('Partnership', 'A formal arrangement between two companies to work together', false, true, '#8B5CF6', 'handshake'),
('Joint Venture', 'A business arrangement where two companies pool resources for a specific project', false, true, '#F59E0B', 'users'),
('Acquisition', 'A company that has been acquired by another company', true, true, '#EF4444', 'arrow-up-circle'),
('Merger', 'Companies that have merged to form a new entity', false, false, '#EC4899', 'merge'),
('Strategic Alliance', 'A cooperative agreement between companies to achieve mutual benefits', false, false, '#06B6D4', 'link'),
('Supplier', 'A company that provides goods or services to another company', false, false, '#84CC16', 'truck'),
('Customer', 'A company that purchases goods or services from another company', false, false, '#F97316', 'shopping-cart');

-- Create function to prevent circular relationships
CREATE OR REPLACE FUNCTION public.check_circular_relationship()
RETURNS TRIGGER AS $$
DECLARE
  circular_exists boolean;
BEGIN
  -- Use recursive CTE to check for circular relationships
  WITH RECURSIVE relationship_path AS (
    -- Base case: start with the new relationship
    SELECT 
      NEW.parent_company_id as company_id,
      NEW.child_company_id as related_company_id,
      1 as depth,
      ARRAY[NEW.parent_company_id] as path
    
    UNION ALL
    
    -- Recursive case: follow the chain of relationships
    SELECT 
      cr.child_company_id,
      rp.related_company_id,
      rp.depth + 1,
      rp.path || cr.child_company_id
    FROM company_relationships_advanced cr
    JOIN relationship_path rp ON cr.parent_company_id = rp.company_id
    JOIN company_relationship_types crt ON cr.relationship_type_id = crt.id
    WHERE crt.is_hierarchical = true
      AND cr.is_active = true
      AND rp.depth < 10 -- Prevent infinite recursion
      AND NOT (cr.child_company_id = ANY(rp.path)) -- Prevent cycles in path
  )
  SELECT EXISTS(
    SELECT 1 FROM relationship_path 
    WHERE company_id = NEW.child_company_id 
    AND related_company_id = NEW.parent_company_id
  ) INTO circular_exists;
  
  IF circular_exists THEN
    RAISE EXCEPTION 'Circular relationship detected. This would create a cycle in the company hierarchy.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to check for circular relationships
CREATE TRIGGER check_circular_relationship_trigger
  BEFORE INSERT OR UPDATE ON public.company_relationships_advanced
  FOR EACH ROW
  EXECUTE FUNCTION public.check_circular_relationship();

-- Create function to log relationship changes
CREATE OR REPLACE FUNCTION public.log_relationship_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.company_relationship_history (
      relationship_id, change_type, new_values, changed_by
    ) VALUES (
      NEW.id, 'created', row_to_json(NEW), NEW.created_by
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.company_relationship_history (
      relationship_id, change_type, old_values, new_values, changed_by
    ) VALUES (
      NEW.id, 'updated', row_to_json(OLD), row_to_json(NEW), NEW.created_by
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.company_relationship_history (
      relationship_id, change_type, old_values, changed_by
    ) VALUES (
      OLD.id, 'deleted', row_to_json(OLD), OLD.created_by
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to log all relationship changes
CREATE TRIGGER log_relationship_changes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.company_relationships_advanced
  FOR EACH ROW
  EXECUTE FUNCTION public.log_relationship_changes();

-- Add updated_at trigger
CREATE TRIGGER update_company_relationship_types_updated_at
  BEFORE UPDATE ON public.company_relationship_types
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_relationships_advanced_updated_at
  BEFORE UPDATE ON public.company_relationships_advanced
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
