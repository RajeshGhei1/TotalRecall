-- Add AI contribution fields to system_modules table
-- This migration adds fields to track AI capabilities and contribution level for each module

-- Add AI capabilities array field
ALTER TABLE public.system_modules 
ADD COLUMN IF NOT EXISTS ai_capabilities TEXT[] DEFAULT '{}';

-- Add AI integration level field (high, medium, low, none)
ALTER TABLE public.system_modules 
ADD COLUMN IF NOT EXISTS ai_level TEXT DEFAULT 'none' CHECK (ai_level IN ('high', 'medium', 'low', 'none'));

-- Add AI description field
ALTER TABLE public.system_modules 
ADD COLUMN IF NOT EXISTS ai_description TEXT;

-- Add AI features JSON field for detailed AI feature descriptions
ALTER TABLE public.system_modules 
ADD COLUMN IF NOT EXISTS ai_features JSONB DEFAULT '{}';

-- Create an index on ai_level for faster filtering
CREATE INDEX IF NOT EXISTS idx_system_modules_ai_level ON public.system_modules(ai_level);

-- Create an index on ai_capabilities for faster array searches
CREATE INDEX IF NOT EXISTS idx_system_modules_ai_capabilities ON public.system_modules USING GIN(ai_capabilities);

-- Add comments for documentation
COMMENT ON COLUMN public.system_modules.ai_capabilities IS 'Array of AI capabilities provided by this module';
COMMENT ON COLUMN public.system_modules.ai_level IS 'Level of AI integration in the module (high, medium, low, none)';
COMMENT ON COLUMN public.system_modules.ai_description IS 'Description of AI functionality in the module';
COMMENT ON COLUMN public.system_modules.ai_features IS 'Detailed JSON object describing specific AI features';
