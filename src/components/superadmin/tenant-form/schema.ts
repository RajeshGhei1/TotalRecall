
import { z } from 'zod';

// Define the form schema with Zod
export const tenantFormSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  domain: z.string().optional(),
  cin: z.string().min(1, "CIN is required"),
  registrationDate: z.date({
    required_error: "Registration date is required",
  }),
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
  endUserChannel: z.string().min(1, "End user/channel is required"),
});

export type TenantFormValues = z.infer<typeof tenantFormSchema>;

// Expanded options for select fields
export const formOptions = {
  // Global regions
  regionOptions: [
    "North America", "South America", "Central America",
    "Europe", "European Union", "Eastern Europe", 
    "Asia", "East Asia", "South Asia", "Southeast Asia", "Central Asia", "Western Asia",
    "Africa", "North Africa", "Sub-Saharan Africa", "East Africa", "West Africa", "Central Africa", "Southern Africa",
    "Oceania", "Australia and New Zealand", "Micronesia", "Melanesia", "Polynesia",
    "Middle East", "Caribbean", "Arctic", "Antarctica"
  ],
  
  // Countries - expanded list with countries from major regions
  countryOptions: [
    // North America
    "United States", "Canada", "Mexico",
    // South America
    "Brazil", "Argentina", "Colombia", "Chile", "Peru", "Venezuela", "Ecuador", "Bolivia", "Uruguay", "Paraguay", "Guyana",
    // Europe
    "United Kingdom", "France", "Germany", "Italy", "Spain", "Portugal", "Netherlands", "Belgium", "Switzerland", 
    "Austria", "Sweden", "Norway", "Denmark", "Finland", "Ireland", "Greece", "Poland", "Hungary", "Czech Republic",
    "Romania", "Bulgaria", "Croatia", "Serbia", "Ukraine", "Russia",
    // Asia
    "China", "Japan", "South Korea", "India", "Pakistan", "Bangladesh", "Indonesia", "Philippines", "Vietnam", 
    "Thailand", "Malaysia", "Singapore", "Taiwan", "Hong Kong", "Sri Lanka", "Nepal", "Myanmar", "Cambodia",
    // Middle East
    "Saudi Arabia", "United Arab Emirates", "Qatar", "Kuwait", "Bahrain", "Oman", "Israel", "Jordan", "Lebanon", "Turkey",
    // Africa
    "South Africa", "Nigeria", "Egypt", "Morocco", "Kenya", "Ethiopia", "Ghana", "Tanzania", "Algeria", "Tunisia",
    // Oceania
    "Australia", "New Zealand", "Papua New Guinea", "Fiji", "Solomon Islands"
  ],
  
  // Industries - comprehensive list covering major sectors
  industryOptions: [
    "Technology - Software", "Technology - Hardware", "Technology - IT Services", "Technology - Semiconductors",
    "Finance - Banking", "Finance - Insurance", "Finance - Investment Management", "Finance - FinTech",
    "Healthcare - Providers", "Healthcare - Equipment", "Healthcare - Pharmaceuticals", "Healthcare - Biotechnology",
    "Manufacturing - Automotive", "Manufacturing - Industrial", "Manufacturing - Consumer Goods", "Manufacturing - Electronics",
    "Retail - Online", "Retail - Department Stores", "Retail - Grocery", "Retail - Specialty",
    "Energy - Oil & Gas", "Energy - Renewable", "Energy - Utilities", "Energy - Mining",
    "Education - K-12", "Education - Higher Education", "Education - EdTech", "Education - Training",
    "Media & Entertainment", "Telecommunications", "Transportation & Logistics", "Hospitality & Tourism",
    "Construction & Real Estate", "Agriculture", "Aerospace & Defense", "Professional Services",
    "Food & Beverage", "Chemicals", "Pharmaceuticals", "Textiles & Apparel",
    "Automotive", "Consumer Electronics", "Environmental Services", "Non-profit Organizations"
  ],
  
  // Company types
  companyTypeOptions: [
    "Public Limited Company", "Private Limited Company", "Limited Liability Partnership (LLP)", 
    "Sole Proprietorship", "Partnership Firm", "One Person Company", "Foreign Company", "Branch Office", 
    "Liaison Office", "Project Office", "Non-profit Organization", "Section 8 Company", "Nidhi Company",
    "Producer Company", "Government Company", "Cooperative Society"
  ],
  
  // Entity types
  entityTypeOptions: [
    "LLC", "Corporation", "S-Corporation", "C-Corporation", "Partnership", "Limited Partnership", 
    "Sole Proprietorship", "Joint Venture", "Trust", "Non-profit Corporation", "Professional Corporation", 
    "Limited Liability Partnership (LLP)", "General Partnership", "Public Limited Company", "Private Limited Company"
  ],
  
  // Segment options based on size
  segmentOptions: [
    "Micro (1-9 employees)",
    "Small (10-49 employees)",
    "Medium (50-249 employees)",
    "Large (250-999 employees)",
    "Enterprise (1000+ employees)"
  ],
  
  // Company status options
  companyStatusOptions: [
    "Active", "Inactive", "Pending Registration", "In Liquidation", "Dissolved", "Dormant",
    "Under Administration", "Receivership", "Struck Off", "Proposed to Strike Off"
  ],
  
  // End user/channel options
  endUserOptions: [
    "Enterprise EndUser", "SMB", "Consumer", "Government", "Education", "Healthcare",
    "B2B Distributor", "B2B Reseller", "B2C Retail", "Direct to Consumer", "OEM",
    "System Integrator", "Value-Added Reseller", "Managed Service Provider"
  ],
  
  // Region options within countries
  localRegionOptions: [
    "North", "South", "East", "West", "Central", 
    "Northeast", "Northwest", "Southeast", "Southwest",
    "Metropolitan", "Rural", "Urban", "Suburban"
  ],
  
  // Office location types
  locationOptions: [
    "Headquarters", "Regional Office", "Branch Office", "Sales Office", 
    "R&D Center", "Manufacturing Plant", "Distribution Center", 
    "Satellite Office", "Virtual Office", "Co-working Space"
  ],
  
  // Company sectors
  companySectorOptions: [
    "Private Sector", "Public Sector", "Government", "Non-profit", 
    "Joint Sector", "Cooperative", "Multinational", "Transnational"
  ],
  
  // Years for selection
  yearOptions: Array.from({ length: 51 }, (_, i) => (new Date().getFullYear() - i).toString()),
  
  // Employee number ranges
  employeeRangeOptions: [
    "1-10", "11-50", "51-200", "201-500", "501-1000", 
    "1001-5000", "5001-10000", "10001-50000", "50000+"
  ],
  
  // Turnover ranges in millions
  turnoverRangeOptions: [
    "Under $1M", "$1M-$10M", "$10M-$50M", "$50M-$100M", 
    "$100M-$500M", "$500M-$1B", "$1B-$10B", "$10B+"
  ],
  
  // Common business specializations
  specializationOptions: [
    "Digital Transformation", "Cloud Computing", "Artificial Intelligence", 
    "Manufacturing", "Supply Chain", "Retail", "Healthcare", "Financial Services", 
    "Education", "Energy", "Transportation", "Telecommunications", 
    "Media & Entertainment", "Hospitality", "Food & Beverage", "Professional Services"
  ],
  
  // Service lines
  serviceLineOptions: [
    "Consulting", "Implementation", "Managed Services", "Support", 
    "Training", "Software Development", "System Integration", 
    "Hardware", "Cloud Services", "Cybersecurity", "Data Analytics", 
    "Digital Marketing", "Business Process Outsourcing"
  ]
};

