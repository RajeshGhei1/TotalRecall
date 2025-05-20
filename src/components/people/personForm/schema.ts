
import * as z from 'zod';

export const personFormSchema = z.object({
  full_name: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().optional(),
  location: z.string().optional(),
  company_id: z.string().optional(),
  role: z.string().optional(),
  type: z.enum(['talent', 'contact']),
});

export type PersonFormValues = z.infer<typeof personFormSchema>;
