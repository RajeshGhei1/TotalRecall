
-- Check if the ai_analytics module exists and is active
SELECT name, description, category, is_active, version 
FROM system_modules 
WHERE name = 'ai_analytics' OR name LIKE '%ai%analytics%';

-- Also check all modules to see what's available
SELECT name, category, is_active 
FROM system_modules 
ORDER BY category, name;
