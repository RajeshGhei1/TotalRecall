
import { z } from 'zod';

// Define the form schema with Zod
export const tenantFormSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  domain: z.string().optional(),
  cin: z.string().min(1, "CIN is required"),
  registrationDate: z.date({
    required_error: "Registration date is required",
  }).or(z.string().transform(str => new Date(str))), // Handle both date and string
  companyStatus: z.string().optional(),
  registeredOfficeAddress: z.string().min(1, "Registered office address is required"),
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
  webSite: z.string().optional(),
  companyProfile: z.string().min(1, "Company profile is required"),
});

export type TenantFormValues = z.infer<typeof tenantFormSchema>;

// Define empty formOptions for compatibility
export const formOptions = {
  regionOptions: [] as unknown[],
  countryOptions: [] as unknown[],
  industryOptions: [] as unknown[],
  companyTypeOptions: [] as unknown[],
  entityTypeOptions: [] as unknown[],
  segmentOptions: [] as unknown[],
  companyStatusOptions: [] as unknown[],
  localRegionOptions: [] as unknown[],
  locationOptions: [] as unknown[],
  companySectorOptions: [] as unknown[],
  yearOptions: [] as unknown[],
  employeeRangeOptions: [] as unknown[],
  turnoverRangeOptions: [] as unknown[],
  specializationOptions: [] as unknown[],
  serviceLineOptions: [] as unknown[]
};
