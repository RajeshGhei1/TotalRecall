
// Helper hook to manage dialog titles and placeholders
export const createDialogHelpers = (config: Record<string, { title: string; placeholder: string }>) => {
  const getDialogTitle = (type: string | null): string => {
    if (!type || !config[type]) {
      return 'Add New Option';
    }
    return config[type].title;
  };

  const getDialogPlaceholder = (type: string | null): string => {
    if (!type || !config[type]) {
      return 'Enter new option value';
    }
    return config[type].placeholder;
  };

  return {
    getDialogTitle,
    getDialogPlaceholder
  };
};

// Specific helper for industry dropdowns
export const useIndustryDialogHelpers = () => {
  return createDialogHelpers({
    'industry1': {
      title: 'Add New Industry',
      placeholder: 'Enter new industry name'
    },
    'industry2': {
      title: 'Add New Industry',
      placeholder: 'Enter new industry name'
    },
    'industry3': {
      title: 'Add New Industry',
      placeholder: 'Enter new industry name'
    },
    'companySector': {
      title: 'Add New Company Sector',
      placeholder: 'Enter new company sector'
    },
    'companyType': {
      title: 'Add New Company Type',
      placeholder: 'Enter new company type'
    },
    'entityType': {
      title: 'Add New Entity Type',
      placeholder: 'Enter new entity type'
    },
  });
};

export default createDialogHelpers;
