
import { useMemo } from 'react';
import { Company } from '@/hooks/useCompanies';

export interface CompanyFilters {
  search: string;
  industries: string[];
  sizes: string[];
  locations: string[];
  companyTypes: string[];
  sectors: string[];
  foundedFrom?: Date;
  foundedTo?: Date;
  registrationFrom?: Date;
  registrationTo?: Date;
}

export const useCompanyFilters = (
  companies: Company[] | undefined,
  filters: CompanyFilters,
  searchTerm: string
) => {
  const filteredCompanies = useMemo(() => {
    // Ensure companies is defined and is an array before filtering
    if (!companies || !Array.isArray(companies)) {
      return [];
    }

    let filtered = [...companies];

    // Apply search filter
    if (searchTerm?.trim()) {
      const search = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(company => 
        company.name?.toLowerCase().includes(search) ||
        company.domain?.toLowerCase().includes(search) ||
        company.email?.toLowerCase().includes(search) ||
        company.industry1?.toLowerCase().includes(search) ||
        company.industry2?.toLowerCase().includes(search) ||
        company.industry3?.toLowerCase().includes(search) ||
        company.location?.toLowerCase().includes(search)
      );
    }

    // Apply industry filter (check all industry fields)
    if (filters.industries && filters.industries.length > 0) {
      filtered = filtered.filter(company => 
        (company.industry1 && filters.industries.includes(company.industry1)) ||
        (company.industry2 && filters.industries.includes(company.industry2)) ||
        (company.industry3 && filters.industries.includes(company.industry3))
      );
    }

    // Apply size filter
    if (filters.sizes && filters.sizes.length > 0) {
      filtered = filtered.filter(company => 
        company.size && filters.sizes.includes(company.size)
      );
    }

    // Apply location filter
    if (filters.locations && filters.locations.length > 0) {
      filtered = filtered.filter(company => 
        company.location && filters.locations.includes(company.location)
      );
    }

    // Apply company type filter
    if (filters.companyTypes && filters.companyTypes.length > 0) {
      filtered = filtered.filter(company => 
        company.companytype && filters.companyTypes.includes(company.companytype)
      );
    }

    // Apply sector filter
    if (filters.sectors && filters.sectors.length > 0) {
      filtered = filtered.filter(company => 
        company.companysector && filters.sectors.includes(company.companysector)
      );
    }

    // Apply founded date range filter
    if (filters.foundedFrom || filters.foundedTo) {
      filtered = filtered.filter(company => {
        if (!company.founded) return false;
        if (filters.foundedFrom && company.founded < filters.foundedFrom.getFullYear()) return false;
        if (filters.foundedTo && company.founded > filters.foundedTo.getFullYear()) return false;
        return true;
      });
    }

    // Apply registration date range filter
    if (filters.registrationFrom || filters.registrationTo) {
      filtered = filtered.filter(company => {
        if (!company.registrationdate) return false;
        const regDate = new Date(company.registrationdate);
        if (filters.registrationFrom && regDate < filters.registrationFrom) return false;
        if (filters.registrationTo && regDate > filters.registrationTo) return false;
        return true;
      });
    }

    return filtered;
  }, [companies, filters, searchTerm]);

  return {
    filteredCompanies
  };
};
