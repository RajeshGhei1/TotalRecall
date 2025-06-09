
import { useMemo } from 'react';
import { Company } from '@/hooks/useCompanies';
import { CompanyFilters } from '../filters/CompanyAdvancedFilters';

export const useCompanyFilters = (
  companies: Company[] | undefined,
  filters: CompanyFilters,
  searchTerm: string
) => {
  const filteredCompanies = useMemo(() => {
    if (!companies) return [];
    
    return companies.filter(company => {
      // Text search filter
      if (filters.search || searchTerm) {
        const searchText = (filters.search || searchTerm).toLowerCase();
        const searchableText = [
          company.name,
          company.industry,
          company.location,
          company.description,
          company.website,
          company.email,
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (!searchableText.includes(searchText)) return false;
      }
      
      // Industry filter
      if (filters.industries?.length && company.industry) {
        if (!filters.industries.includes(company.industry)) return false;
      }
      
      // Size filter
      if (filters.sizes?.length && company.size) {
        if (!filters.sizes.includes(company.size)) return false;
      }
      
      // Location filter
      if (filters.locations?.length && company.location) {
        if (!filters.locations.includes(company.location)) return false;
      }
      
      // Company Type filter
      if (filters.companyTypes?.length && company.companyType) {
        if (!filters.companyTypes.includes(company.companyType)) return false;
      }
      
      // Sector filter
      if (filters.sectors?.length && company.companySector) {
        if (!filters.sectors.includes(company.companySector)) return false;
      }
      
      // Founded date range filter
      if (filters.foundedFrom || filters.foundedTo) {
        if (company.founded) {
          const foundedYear = company.founded;
          if (filters.foundedFrom && foundedYear < filters.foundedFrom.getFullYear()) return false;
          if (filters.foundedTo && foundedYear > filters.foundedTo.getFullYear()) return false;
        } else if (filters.foundedFrom || filters.foundedTo) {
          return false;
        }
      }
      
      // Registration date range filter
      if (filters.registrationFrom || filters.registrationTo) {
        if (company.registrationDate) {
          const regDate = new Date(company.registrationDate);
          if (filters.registrationFrom && regDate < filters.registrationFrom) return false;
          if (filters.registrationTo && regDate > filters.registrationTo) return false;
        } else if (filters.registrationFrom || filters.registrationTo) {
          return false;
        }
      }
      
      return true;
    });
  }, [companies, filters, searchTerm]);

  return { filteredCompanies };
};
