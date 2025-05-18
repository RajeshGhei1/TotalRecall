
import { z } from 'zod';

// Define the form schema with Zod
export const companyFormSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  website: z.string().url("Invalid website URL").optional().or(z.literal('')),
  industry: z.string().min(1, "Industry is required"),
  size: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  phone: z.string().optional(),
  founded: z.number().optional(),
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal('')),
  twitter: z.string().url("Invalid Twitter URL").optional().or(z.literal('')),
  facebook: z.string().url("Invalid Facebook URL").optional().or(z.literal('')),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;

// Define form options for dropdowns
export const formOptions = {
  industryOptions: [
    { value: "technology", label: "Technology" },
    { value: "healthcare", label: "Healthcare" },
    { value: "finance", label: "Finance" },
    { value: "education", label: "Education" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "retail", label: "Retail" },
    { value: "other", label: "Other" },
  ],
  sizeOptions: [
    { value: "1-10", label: "1-10 employees" },
    { value: "11-50", label: "11-50 employees" },
    { value: "51-200", label: "51-200 employees" },
    { value: "201-500", label: "201-500 employees" },
    { value: "501-1000", label: "501-1000 employees" },
    { value: "1001-5000", label: "1001-5000 employees" },
    { value: "5001+", label: "5001+ employees" },
  ],
};
