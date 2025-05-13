
import { useState } from 'react';

type DialogConfig = {
  title: string;
  placeholder: string;
};

type DialogConfigMap = {
  [key: string]: DialogConfig;
};

export const useIndustryDialogHelpers = () => {
  // Get dialog title based on field name
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

  // Get dialog placeholder based on field name
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

  return {
    getDialogTitle,
    getDialogPlaceholder
  };
};

// Generic dialog helper creator
export const createDialogHelpers = (config: DialogConfigMap) => {
  // Get dialog title based on field name
  const getDialogTitle = (fieldName: string | null): string => {
    if (!fieldName || !config[fieldName]) {
      return 'Add New Option';
    }
    return config[fieldName].title;
  };

  // Get dialog placeholder based on field name
  const getDialogPlaceholder = (fieldName: string | null): string => {
    if (!fieldName || !config[fieldName]) {
      return 'Enter new option';
    }
    return config[fieldName].placeholder;
  };

  return {
    getDialogTitle,
    getDialogPlaceholder
  };
};

// Custom hook for using dialog state
export const useAddOptionDialog = () => {
  const [addingType, setAddingType] = useState<string | null>(null);
  const [newOption, setNewOption] = useState('');
  
  const resetDialog = () => {
    setAddingType(null);
    setNewOption('');
  };

  return {
    addingType,
    setAddingType,
    newOption,
    setNewOption,
    resetDialog
  };
};
