
import { z } from 'zod';

// Define the form schema with Zod
export const companyFormSchema = z.object({
  id: z.string().optional(), // Add id field for existing companies
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
  // Add tenant-specific fields
  cin: z.string().min(1, "CIN is required"),
  companyStatus: z.string().optional(),
  registeredOfficeAddress: z.string().min(1, "Registered office address is required"),
  registrationDate: z.date({
    required_error: "Registration date is required",
  }).or(z.string().transform(str => new Date(str))), // Handle both date and string
  registeredEmailAddress: z.string().email("Invalid email address").min(1, "Registered email address is required"),
  noOfDirectives: z.string().min(1, "Number of directives is required"),
  globalRegion: z.string().min(1, "Global region is required"),
  country: z.string().min(1, "Country is required"),
  region: z.string().min(1, "Region is required"),
  hoLocation: z.string().min(1, "HO location is required"),
  industry1: z.string().min(1, "Industry 1 is required"),
  industry2: z.string().min(1, "Industry 2 is required"),
  industry3: z.string().min(1, "Industry 3 is required"),
  companySector: z.string().min(1, "Company sector is required"),
  companyType: z.string().min(1, "Company type is required"),
  entityType: z.string().min(1, "Entity type is required"),
  noOfEmployee: z.string().min(1, "Number of employees is required"),
  segmentAsPerNumberOfEmployees: z.string().min(1, "Segment as per number of employees is required"),
  turnOver: z.string().min(1, "Turn over is required"),
  segmentAsPerTurnover: z.string().min(1, "Segment as per turnover is required"),
  turnoverYear: z.string().min(1, "Turnover year is required"),
  yearOfEstablishment: z.string().min(1, "Year of establishment is required"),
  paidupCapital: z.string().min(1, "Paidup capital is required"),
  segmentAsPerPaidUpCapital: z.string().min(1, "Segment as per paid up capital is required"),
  areaOfSpecialize: z.string().optional(),
  serviceLine: z.string().optional(),
  verticles: z.string().optional(),
  companyProfile: z.string().min(1, "Company profile is required"),
  // Add parent company and group structure fields
  parentCompanyId: z.string().optional(),
  companyGroupName: z.string().optional(),
  hierarchyLevel: z.number().optional(),
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
