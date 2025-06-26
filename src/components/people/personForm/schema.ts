
import { z } from 'zod';

export const personFormSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  location: z.string().optional(),
  type: z.enum(['talent', 'contact']),
  company_id: z.string().optional(),
  role: z.string().optional(),
  reports_to: z.string().optional(),
  personal_email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
});

export type PersonFormValues = z.infer<typeof personFormSchema>;
