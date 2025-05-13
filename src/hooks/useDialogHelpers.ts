
// Helper function to get dialog titles and placeholders for different field types
export function useIndustryDialogHelpers() {
  const getDialogTitle = (fieldName: string | null): string => {
    switch (fieldName) {
      case 'industry1':
      case 'industry2':
      case 'industry3':
        return 'Add New Industry';
      case 'companySector':
        return 'Add New Company Sector';
      case 'companyType':
        return 'Add New Company Type';
      case 'entityType':
        return 'Add New Entity Type';
      default:
        return 'Add New Option';
    }
  };

  const getDialogPlaceholder = (fieldName: string | null): string => {
    switch (fieldName) {
      case 'industry1':
      case 'industry2':
      case 'industry3':
        return 'Enter new industry name';
      case 'companySector':
        return 'Enter new company sector';
      case 'companyType':
        return 'Enter new company type';
      case 'entityType':
        return 'Enter new entity type';
      default:
        return 'Enter new option';
    }
  };

  return { getDialogTitle, getDialogPlaceholder };
}

// More generic helper for other dialogs
export function createDialogHelpers(config: Record<string, { title: string; placeholder: string }>) {
  const getDialogTitle = (fieldName: string | null): string => {
    if (!fieldName) return 'Add New';
    return config[fieldName]?.title || 'Add New Option';
  };

  const getDialogPlaceholder = (fieldName: string | null): string => {
    if (!fieldName) return 'Enter new value';
    return config[fieldName]?.placeholder || 'Enter new value';
  };

  return { getDialogTitle, getDialogPlaceholder };
}

export default useIndustryDialogHelpers;
