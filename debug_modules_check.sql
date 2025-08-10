-- Debug: Check if there are modules in the system_modules table
SELECT 
    name,
    category,
    description,
    is_active,
    created_at
FROM system_modules 
WHERE is_active = true 
ORDER BY name;

-- If empty, let's see all modules including inactive ones
SELECT 
    name,
    category,
    description,
    is_active,
    created_at
FROM system_modules 
ORDER BY name; 