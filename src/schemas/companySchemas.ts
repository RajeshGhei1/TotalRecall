
import { z } from 'zod';

export const companySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Company name is required').max(255, 'Company name too long'),
  tr_id: z.string().optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  industry1: z.string().optional(),
  industry2: z.string().optional(),
  industry3: z.string().optional(),
  size: z.string().optional(),
  founded: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  cin: z.string().optional(),
  companystatus: z.string().optional(),
  companytype: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const companyCreateSchema = companySchema.omit({
  id: true,
  tr_id: true,
  created_at: true,
  updated_at: true,
});

export const companyUpdateSchema = companyCreateSchema.partial();

export const companyFilterSchema = z.object({
  search: z.string().optional(),
  industry1: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  locations: z.array(z.string()).optional(),
  countries: z.array(z.string()).optional(),
});

export type Company = z.infer<typeof companySchema>;
export type CompanyCreate = z.infer<typeof companyCreateSchema>;
export type CompanyUpdate = z.infer<typeof companyUpdateSchema>;
export type CompanyFilters = z.infer<typeof companyFilterSchema>;
