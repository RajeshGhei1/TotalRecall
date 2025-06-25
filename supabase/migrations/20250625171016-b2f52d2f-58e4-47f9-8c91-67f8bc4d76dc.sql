
-- Create the ai_analytics module in the system_modules table
INSERT INTO system_modules (
  name, 
  description, 
  category, 
  is_active, 
  version,
  auto_load,
  load_order,
  created_at,
  updated_at
) VALUES (
  'ai_analytics',
  'Behavioral Intelligence System - Real-time user interaction tracking and AI-powered personalization',
  'ai_analytics',
  true,
  '1.0.0',
  true,
  50,
  now(),
  now()
);
