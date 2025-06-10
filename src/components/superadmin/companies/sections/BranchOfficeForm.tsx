
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Save } from 'lucide-react';
import { BranchOfficeFormData } from '@/hooks/useBranchOffices';
import { validateGSTNumber, formatGSTNumber } from '@/utils/gstValidation';

const branchOfficeSchema = z.object({
  branch_name: z.string().min(1, 'Branch name is required'),
  branch_type: z.string().min(1, 'Branch type is required'),
  gst_number: z.string().optional().refine((val) => {
    if (!val) return true;
    return validateGSTNumber(val).isValid;
  }, 'Invalid GST number format'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postal_code: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  is_active: z.boolean(),
  is_headquarters: z.boolean(),
});

interface BranchOfficeFormProps {
  initialData?: BranchOfficeFormData;
  onSubmit: (data: BranchOfficeFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const BRANCH_TYPES = [
  'Branch Office',
  'Regional Office',
  'Sales Office',
  'Corporate Office',
  'Manufacturing Unit',
  'Distribution Center',
  'Service Center',
];

export const BranchOfficeForm: React.FC<BranchOfficeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BranchOfficeFormData>({
    resolver: zodResolver(branchOfficeSchema),
    defaultValues: {
      branch_name: '',
      branch_type: 'Branch Office',
      gst_number: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postal_code: '',
      phone: '',
      email: '',
      is_active: true,
      is_headquarters: false,
      ...initialData,
    },
  });

  const watchedGST = watch('gst_number');
  const watchedIsHQ = watch('is_headquarters');

  const handleGSTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatGSTNumber(e.target.value);
    setValue('gst_number', formatted);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {initialData ? 'Edit Branch Office' : 'Add Branch Office'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="branch_name">Branch Name *</Label>
              <Input
                {...register('branch_name')}
                placeholder="e.g., Mumbai Branch"
                className={errors.branch_name ? 'border-red-500' : ''}
              />
              {errors.branch_name && (
                <p className="text-sm text-red-500">{errors.branch_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch_type">Branch Type</Label>
              <Select
                value={watch('branch_type')}
                onValueChange={(value) => setValue('branch_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select branch type" />
                </SelectTrigger>
                <SelectContent>
                  {BRANCH_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gst_number">GST Number</Label>
              <Input
                {...register('gst_number')}
                onChange={handleGSTChange}
                value={watchedGST}
                placeholder="22 AAAAA 0000 A1Z5"
                maxLength={19}
                className={errors.gst_number ? 'border-red-500' : ''}
              />
              {errors.gst_number && (
                <p className="text-sm text-red-500">{errors.gst_number.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                {...register('email')}
                type="email"
                placeholder="branch@company.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                {...register('phone')}
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                {...register('city')}
                placeholder="Mumbai"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                {...register('state')}
                placeholder="Maharashtra"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                {...register('country')}
                placeholder="India"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postal_code">Postal Code</Label>
              <Input
                {...register('postal_code')}
                placeholder="400001"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              {...register('address')}
              placeholder="Complete address of the branch office"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={watch('is_active')}
                  onCheckedChange={(checked) => setValue('is_active', checked)}
                />
                <Label>Active</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={watchedIsHQ}
                  onCheckedChange={(checked) => setValue('is_headquarters', checked)}
                />
                <Label>Headquarters</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Branch Office'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
