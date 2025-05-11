
import ExtendedTenantForm from './ExtendedTenantForm';
import { tenantFormSchema } from './schema';

// Use export type for proper type re-exporting when isolatedModules is enabled
export type { TenantFormValues } from './schema';

export {
  ExtendedTenantForm,
  tenantFormSchema
};
