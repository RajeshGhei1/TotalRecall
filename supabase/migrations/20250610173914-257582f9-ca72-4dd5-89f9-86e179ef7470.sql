
-- Remove the enduserchannel column from companies table
ALTER TABLE public.companies DROP COLUMN IF EXISTS enduserchannel;

-- Clean up end_user_channels dropdown category and its options
DELETE FROM public.dropdown_options 
WHERE category_id IN (
  SELECT id FROM public.dropdown_option_categories 
  WHERE name = 'end_user_channels'
);

DELETE FROM public.dropdown_option_categories 
WHERE name = 'end_user_channels';
