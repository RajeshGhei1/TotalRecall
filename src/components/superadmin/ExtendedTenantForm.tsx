
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Building2, Globe } from 'lucide-react';
import { format } from 'date-fns';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

// Define the form schema with Zod
const tenantFormSchema = z.object({
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

type TenantFormValues = z.infer<typeof tenantFormSchema>;

interface ExtendedTenantFormProps {
  onSubmit: (data: TenantFormValues) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

const ExtendedTenantForm: React.FC<ExtendedTenantFormProps> = ({ 
  onSubmit, 
  isSubmitting, 
  onCancel 
}) => {
  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: {
      name: '',
      domain: '',
      cin: '',
      companyStatus: '',
      registeredOfficeAddress: '',
      registeredEmailAddress: '',
      noOfDirectives: '',
      globalRegion: '',
      country: '',
      region: '',
      hoLocation: '',
      industry1: '',
      industry2: '',
      industry3: '',
      companySector: '',
      companyType: '',
      entityType: '',
      noOfEmployee: '',
      segmentAsPerNumberOfEmployees: '',
      turnOver: '',
      segmentAsPerTurnover: '',
      turnoverYear: '',
      yearOfEstablishment: '',
      paidupCapital: '',
      segmentAsPerPaidUpCapital: '',
      areaOfSpecialize: '',
      serviceLine: '',
      verticles: '',
      webSite: '',
      companyProfile: '',
      endUserChannel: '',
    }
  });

  // Sample options for select fields - replace with actual data as needed
  const regionOptions = ["North America", "South America", "Europe", "Asia", "Africa", "Australia"];
  const countryOptions = ["United States", "Canada", "United Kingdom", "India", "Australia", "Germany"];
  const industryOptions = ["Technology", "Finance", "Healthcare", "Manufacturing", "Retail", "Education"];
  const companyTypeOptions = ["Public", "Private", "Non-profit", "Government"];
  const entityTypeOptions = ["LLC", "Corporation", "Partnership", "Sole Proprietorship"];
  const segmentOptions = ["Small", "Medium", "Large", "Enterprise"];
  const endUserOptions = ["Enterprise EndUser", "SMB", "Consumer", "Government"];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Account Name <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Account Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Parent (Not in schema, shown in image) */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Parent</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="[Choose One]" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* CIN */}
          <FormField
            control={form.control}
            name="cin"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  CIN <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="CIN Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Registered Office Address */}
          <FormField
            control={form.control}
            name="registeredOfficeAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Registered Office Address <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Registered Office Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Registration Date */}
          <FormField
            control={form.control}
            name="registrationDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="flex items-center">
                  Registration Date <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Registered Date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Registered Email Address */}
          <FormField
            control={form.control}
            name="registeredEmailAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Registered Email Address <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Registered Email Address" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Company Status */}
          <FormField
            control={form.control}
            name="companyStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Company Status <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="[Choose One]" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* No Of Directives/Partner */}
          <FormField
            control={form.control}
            name="noOfDirectives"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  No Of Directives/Partner <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="No of directives" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Global Region */}
          <FormField
            control={form.control}
            name="globalRegion"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Global Region <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="[Choose One]" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {regionOptions.map((region) => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Country */}
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Country <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="[Choose One]" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countryOptions.map((country) => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Region */}
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Region <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="[Choose One]" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="north">North</SelectItem>
                    <SelectItem value="south">South</SelectItem>
                    <SelectItem value="east">East</SelectItem>
                    <SelectItem value="west">West</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* HO Location */}
          <FormField
            control={form.control}
            name="hoLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  HO Location <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="[Choose One]" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="location1">Location 1</SelectItem>
                    <SelectItem value="location2">Location 2</SelectItem>
                    <SelectItem value="location3">Location 3</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Industry1 */}
          <FormField
            control={form.control}
            name="industry1"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Industry1 <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="[Choose One]" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {industryOptions.map((industry) => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Industry2 */}
          <FormField
            control={form.control}
            name="industry2"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Industry2 <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="[Choose One]" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {industryOptions.map((industry) => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Industry3 */}
          <FormField
            control={form.control}
            name="industry3"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Industry3 <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="[Choose One]" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {industryOptions.map((industry) => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Company Sector */}
          <FormField
            control={form.control}
            name="companySector"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Company Sector <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="[Choose One]" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Company Type */}
          <FormField
            control={form.control}
            name="companyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Company Type <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="[Choose One]" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {companyTypeOptions.map((type) => (
                      <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Entity Type */}
          <FormField
            control={form.control}
            name="entityType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Entity Type <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="[Choose One]" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {entityTypeOptions.map((type) => (
                      <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* No. of Employee */}
          <FormField
            control={form.control}
            name="noOfEmployee"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  No. of Employee <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Segment as per Number of Employees */}
          <FormField
            control={form.control}
            name="segmentAsPerNumberOfEmployees"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Segment as per Number of Employees <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="[Choose One]" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {segmentOptions.map((segment) => (
                      <SelectItem key={segment} value={segment.toLowerCase()}>{segment}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Turn Over */}
          <FormField
            control={form.control}
            name="turnOver"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Turn Over <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Segment as per Turnover */}
          <FormField
            control={form.control}
            name="segmentAsPerTurnover"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Segment as per Turnover <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="[Choose One]" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {segmentOptions.map((segment) => (
                      <SelectItem key={segment} value={segment.toLowerCase()}>{segment}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Turnover Year */}
          <FormField
            control={form.control}
            name="turnoverYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Turnover Year <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Year of Establishment */}
          <FormField
            control={form.control}
            name="yearOfEstablishment"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Year of Establishment <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Paidup Capital */}
          <FormField
            control={form.control}
            name="paidupCapital"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Paidup Capital <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Segment as per Paid up Capital */}
          <FormField
            control={form.control}
            name="segmentAsPerPaidUpCapital"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Segment as per Paid up Capital <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="[Choose One]" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {segmentOptions.map((segment) => (
                      <SelectItem key={segment} value={segment.toLowerCase()}>{segment}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Area of Specialize */}
          <FormField
            control={form.control}
            name="areaOfSpecialize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area of Specialize</FormLabel>
                <FormControl>
                  <Input placeholder="Area of Specialization" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Service Line */}
          <FormField
            control={form.control}
            name="serviceLine"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Line</FormLabel>
                <FormControl>
                  <Input placeholder="Service Line" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Verticles */}
          <FormField
            control={form.control}
            name="verticles"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verticles</FormLabel>
                <FormControl>
                  <Input placeholder="Verticles" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* WEB Site */}
          <FormField
            control={form.control}
            name="webSite"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WEB Site</FormLabel>
                <FormControl>
                  <Input placeholder="WEB Site" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Company Profile */}
        <FormField
          control={form.control}
          name="companyProfile"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                Company Profile <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <FormControl>
                <Textarea placeholder="Company Profile" className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* EndUser/Channel */}
        <FormField
          control={form.control}
          name="endUserChannel"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                EndUser/Channel <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Enterprise EndUser" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {endUserOptions.map((option) => (
                    <SelectItem key={option} value={option.toLowerCase()}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ExtendedTenantForm;
