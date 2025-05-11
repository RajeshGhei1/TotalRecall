
interface DialogConfig {
  [key: string]: {
    title: string;
    placeholder: string;
  };
}

export const createDialogHelpers = (config: DialogConfig) => {
  // Get dialog props based on the current adding type
  const getDialogTitle = (entityType: string | null) => {
    if (!entityType || !config[entityType]) {
      return 'Add New Option';
    }
    return config[entityType].title;
  };

  const getDialogPlaceholder = (entityType: string | null) => {
    if (!entityType || !config[entityType]) {
      return 'Enter new option name';
    }
    return config[entityType].placeholder;
  };

  return {
    getDialogTitle,
    getDialogPlaceholder
  };
};

// For backward compatibility, export the original industry-specific helper
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
    }
  });
};
