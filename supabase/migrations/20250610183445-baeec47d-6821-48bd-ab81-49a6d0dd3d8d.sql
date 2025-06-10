
-- Insert dropdown categories for industries if they don't exist
INSERT INTO dropdown_option_categories (id, name, description)
VALUES 
  (gen_random_uuid(), 'industry1', 'Primary industry categories'),
  (gen_random_uuid(), 'industry2', 'Secondary industry categories'),
  (gen_random_uuid(), 'industry3', 'Specific industry categories')
ON CONFLICT (name) DO NOTHING;

-- Get category IDs for the industries
WITH category_ids AS (
  SELECT 
    id as industry1_id,
    'industry1' as category_name
  FROM dropdown_option_categories 
  WHERE name = 'industry1'
  
  UNION ALL
  
  SELECT 
    id as industry2_id,
    'industry2' as category_name
  FROM dropdown_option_categories 
  WHERE name = 'industry2'
  
  UNION ALL
  
  SELECT 
    id as industry3_id,
    'industry3' as category_name
  FROM dropdown_option_categories 
  WHERE name = 'industry3'
)

-- Clear existing industry options
DELETE FROM dropdown_options 
WHERE category_id IN (
  SELECT id FROM dropdown_option_categories 
  WHERE name IN ('industry1', 'industry2', 'industry3')
);

-- Insert Industry 1 options (Primary categories)
INSERT INTO dropdown_options (id, category_id, value, label, sort_order)
SELECT 
  gen_random_uuid(),
  c.industry1_id,
  unnest(ARRAY['services', 'trading', 'manufacturing', 'government']),
  unnest(ARRAY['Services', 'Trading', 'Manufacturing', 'Government']),
  unnest(ARRAY[1, 2, 3, 4])
FROM (SELECT id as industry1_id FROM dropdown_option_categories WHERE name = 'industry1') c;

-- Insert Industry 2 options (Secondary categories for Services)
INSERT INTO dropdown_options (id, category_id, value, label, sort_order)
SELECT 
  gen_random_uuid(),
  c.industry2_id,
  unnest(ARRAY[
    'it_software', 'financial_services', 'healthcare_services', 'consulting', 
    'education', 'telecommunications', 'media_entertainment', 'hospitality',
    'real_estate', 'professional_services'
  ]),
  unnest(ARRAY[
    'IT & Software', 'Financial Services', 'Healthcare Services', 'Consulting',
    'Education', 'Telecommunications', 'Media & Entertainment', 'Hospitality',
    'Real Estate', 'Professional Services'
  ]),
  unnest(ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
FROM (SELECT id as industry2_id FROM dropdown_option_categories WHERE name = 'industry2') c;

-- Insert Industry 2 options (Secondary categories for Trading)
INSERT INTO dropdown_options (id, category_id, value, label, sort_order)
SELECT 
  gen_random_uuid(),
  c.industry2_id,
  unnest(ARRAY[
    'import_export', 'retail_trade', 'wholesale_trade', 'commodity_trading',
    'e_commerce', 'distribution'
  ]),
  unnest(ARRAY[
    'Import/Export', 'Retail Trade', 'Wholesale Trade', 'Commodity Trading',
    'E-commerce', 'Distribution'
  ]),
  unnest(ARRAY[11, 12, 13, 14, 15, 16])
FROM (SELECT id as industry2_id FROM dropdown_option_categories WHERE name = 'industry2') c;

-- Insert Industry 2 options (Secondary categories for Manufacturing)
INSERT INTO dropdown_options (id, category_id, value, label, sort_order)
SELECT 
  gen_random_uuid(),
  c.industry2_id,
  unnest(ARRAY[
    'automotive', 'electronics', 'textiles', 'chemicals', 'pharmaceuticals',
    'food_processing', 'machinery', 'aerospace', 'construction_materials'
  ]),
  unnest(ARRAY[
    'Automotive', 'Electronics', 'Textiles', 'Chemicals', 'Pharmaceuticals',
    'Food Processing', 'Machinery', 'Aerospace', 'Construction Materials'
  ]),
  unnest(ARRAY[17, 18, 19, 20, 21, 22, 23, 24, 25])
FROM (SELECT id as industry2_id FROM dropdown_option_categories WHERE name = 'industry2') c;

-- Insert Industry 2 options (Secondary categories for Government)
INSERT INTO dropdown_options (id, category_id, value, label, sort_order)
SELECT 
  gen_random_uuid(),
  c.industry2_id,
  unnest(ARRAY[
    'central_government', 'state_government', 'local_government', 'public_sector',
    'defense', 'regulatory_bodies'
  ]),
  unnest(ARRAY[
    'Central Government', 'State Government', 'Local Government', 'Public Sector',
    'Defense', 'Regulatory Bodies'
  ]),
  unnest(ARRAY[26, 27, 28, 29, 30, 31])
FROM (SELECT id as industry2_id FROM dropdown_option_categories WHERE name = 'industry2') c;

-- Insert Industry 3 options (Specific categories - sample for IT & Software)
INSERT INTO dropdown_options (id, category_id, value, label, sort_order)
SELECT 
  gen_random_uuid(),
  c.industry3_id,
  unnest(ARRAY[
    'web_development', 'mobile_app_development', 'software_consulting', 
    'cloud_services', 'cybersecurity', 'data_analytics', 'ai_ml',
    'enterprise_software', 'gaming', 'fintech'
  ]),
  unnest(ARRAY[
    'Web Development', 'Mobile App Development', 'Software Consulting',
    'Cloud Services', 'Cybersecurity', 'Data Analytics', 'AI/ML',
    'Enterprise Software', 'Gaming', 'FinTech'
  ]),
  unnest(ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
FROM (SELECT id as industry3_id FROM dropdown_option_categories WHERE name = 'industry3') c;

-- Insert Industry 3 options (Specific categories - sample for Financial Services)
INSERT INTO dropdown_options (id, category_id, value, label, sort_order)
SELECT 
  gen_random_uuid(),
  c.industry3_id,
  unnest(ARRAY[
    'banking', 'insurance', 'investment_management', 'wealth_management',
    'credit_services', 'payment_processing', 'microfinance', 'securities'
  ]),
  unnest(ARRAY[
    'Banking', 'Insurance', 'Investment Management', 'Wealth Management',
    'Credit Services', 'Payment Processing', 'Microfinance', 'Securities'
  ]),
  unnest(ARRAY[11, 12, 13, 14, 15, 16, 17, 18])
FROM (SELECT id as industry3_id FROM dropdown_option_categories WHERE name = 'industry3') c;

-- Insert Industry 3 options (Specific categories - sample for Automotive Manufacturing)
INSERT INTO dropdown_options (id, category_id, value, label, sort_order)
SELECT 
  gen_random_uuid(),
  c.industry3_id,
  unnest(ARRAY[
    'vehicle_manufacturing', 'auto_components', 'electric_vehicles', 
    'automotive_software', 'auto_finance', 'auto_insurance'
  ]),
  unnest(ARRAY[
    'Vehicle Manufacturing', 'Auto Components', 'Electric Vehicles',
    'Automotive Software', 'Auto Finance', 'Auto Insurance'
  ]),
  unnest(ARRAY[19, 20, 21, 22, 23, 24])
FROM (SELECT id as industry3_id FROM dropdown_option_categories WHERE name = 'industry3') c;
