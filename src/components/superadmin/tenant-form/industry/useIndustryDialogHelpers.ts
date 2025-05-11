
export const useIndustryDialogHelpers = () => {
  // Get dialog props based on the current adding type
  const getDialogTitle = (addingType: string | null) => {
    if (addingType === 'industry1' || addingType === 'industry2' || addingType === 'industry3') {
      return 'Add New Industry';
    } else if (addingType === 'companySector') {
      return 'Add New Company Sector';
    } else if (addingType === 'companyType') {
      return 'Add New Company Type';  
    } else if (addingType === 'entityType') {
      return 'Add New Entity Type';
    }
    return 'Add New Option';
  };

  const getDialogPlaceholder = (addingType: string | null) => {
    if (addingType === 'industry1' || addingType === 'industry2' || addingType === 'industry3') {
      return 'Enter new industry name';
    } else if (addingType === 'companySector') {
      return 'Enter new company sector';
    } else if (addingType === 'companyType') {
      return 'Enter new company type';
    } else if (addingType === 'entityType') {
      return 'Enter new entity type';
    }
    return 'Enter new option name';
  };

  return {
    getDialogTitle,
    getDialogPlaceholder
  };
};
