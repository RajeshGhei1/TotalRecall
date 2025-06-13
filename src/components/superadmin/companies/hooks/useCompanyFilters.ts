
import { useState, useMemo } from 'react';
import { Company } from '@/hooks/useCompanies';

export interface CompanyFilters {
  search: string;
  industry1: string[];
  industry2: string[];
  industry3: string[];
  sizes: string[];
  statuses: string[];
  locations: string[];
  countries: string[];
  globalRegions: string[];
  regions: string[];
  hoLocations: string[];
  sectors: string[];
  companyTypes: string[];
  entityTypes: string[];
  employeeSegments: string[];
  turnoverSegments: string[];
  capitalSegments: string[];
  specializations: string[];
  serviceLines: string[];
  verticals: string[];
  companyGroups: string[];
  hasParent: string[];
  hasEmail: string[];
  hasPhone: string[];
  hasWebsite: string[];
  hasLinkedin: string[];
  hasTwitter: string[];
  hasFacebook: string[];
}

const initialFilters: CompanyFilters = {
  search: '',
  industry1: [],
  industry2: [],
  industry3: [],
  sizes: [],
  statuses: [],
  locations: [],
  countries: [],
  globalRegions: [],
  regions: [],
  hoLocations: [],
  sectors: [],
  companyTypes: [],
  entityTypes: [],
  employeeSegments: [],
  turnoverSegments: [],
  capitalSegments: [],
  specializations: [],
  serviceLines: [],
  verticals: [],
  companyGroups: [],
  hasParent: [],
  hasEmail: [],
  hasPhone: [],
  hasWebsite: [],
  hasLinkedin: [],
  hasTwitter: [],
  hasFacebook: [],
};

export const useCompanyFilters = (companies: Company[]) => {
  const [filters, setFilters] = useState<CompanyFilters>(initialFilters);

  const filteredCompanies = useMemo(() => {
    if (!companies) return [];

    return companies.filter(company => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          company.name?.toLowerCase().includes(searchLower) ||
          company.tr_id?.toLowerCase().includes(searchLower) ||
          company.cin?.toLowerCase().includes(searchLower) ||
          company.email?.toLowerCase().includes(searchLower) ||
          company.website?.toLowerCase().includes(searchLower) ||
          company.location?.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Industry filters
      if (filters.industry1.length && (!company.industry1 || !filters.industry1.includes(company.industry1))) return false;
      if (filters.industry2.length && (!company.industry2 || !filters.industry2.includes(company.industry2))) return false;
      if (filters.industry3.length && (!company.industry3 || !filters.industry3.includes(company.industry3))) return false;

      // Basic filters
      if (filters.sizes.length && (!company.size || !filters.sizes.includes(company.size))) return false;
      if (filters.statuses.length && (!company.companystatus || !filters.statuses.includes(company.companystatus))) return false;

      // Location filters
      if (filters.locations.length && (!company.location || !filters.locations.includes(company.location))) return false;
      if (filters.countries.length && (!company.country || !filters.countries.includes(company.country))) return false;
      if (filters.globalRegions.length && (!company.globalregion || !filters.globalRegions.includes(company.globalregion))) return false;
      if (filters.regions.length && (!company.region || !filters.regions.includes(company.region))) return false;
      if (filters.hoLocations.length && (!company.holocation || !filters.hoLocations.includes(company.holocation))) return false;

      // Company type filters
      if (filters.sectors.length && (!company.companysector || !filters.sectors.includes(company.companysector))) return false;
      if (filters.companyTypes.length && (!company.companytype || !filters.companyTypes.includes(company.companytype))) return false;
      if (filters.entityTypes.length && (!company.entitytype || !filters.entityTypes.includes(company.entitytype))) return false;

      // Metrics filters
      if (filters.employeeSegments.length && (!company.segmentaspernumberofemployees || !filters.employeeSegments.includes(company.segmentaspernumberofemployees))) return false;
      if (filters.turnoverSegments.length && (!company.segmentasperturnover || !filters.turnoverSegments.includes(company.segmentasperturnover))) return false;
      if (filters.capitalSegments.length && (!company.segmentasperpaidupcapital || !filters.capitalSegments.includes(company.segmentasperpaidupcapital))) return false;

      // Specialization filters
      if (filters.specializations.length && (!company.areaofspecialize || !filters.specializations.includes(company.areaofspecialize))) return false;
      if (filters.serviceLines.length && (!company.serviceline || !filters.serviceLines.includes(company.serviceline))) return false;
      if (filters.verticals.length && (!company.verticles || !filters.verticals.includes(company.verticles))) return false;

      // Group filters
      if (filters.companyGroups.length && (!company.company_group_name || !filters.companyGroups.includes(company.company_group_name))) return false;

      // Boolean filters
      if (filters.hasParent.length) {
        const hasParent = company.parent_company_id ? 'true' : 'false';
        if (!filters.hasParent.includes(hasParent)) return false;
      }

      if (filters.hasEmail.length) {
        const hasEmail = company.email ? 'true' : 'false';
        if (!filters.hasEmail.includes(hasEmail)) return false;
      }

      if (filters.hasPhone.length) {
        const hasPhone = company.phone ? 'true' : 'false';
        if (!filters.hasPhone.includes(hasPhone)) return false;
      }

      if (filters.hasWebsite.length) {
        const hasWebsite = company.website ? 'true' : 'false';
        if (!filters.hasWebsite.includes(hasWebsite)) return false;
      }

      if (filters.hasLinkedin.length) {
        const hasLinkedin = company.linkedin ? 'true' : 'false';
        if (!filters.hasLinkedin.includes(hasLinkedin)) return false;
      }

      if (filters.hasTwitter.length) {
        const hasTwitter = company.twitter ? 'true' : 'false';
        if (!filters.hasTwitter.includes(hasTwitter)) return false;
      }

      if (filters.hasFacebook.length) {
        const hasFacebook = company.facebook ? 'true' : 'false';
        if (!filters.hasFacebook.includes(hasFacebook)) return false;
      }

      return true;
    });
  }, [companies, filters]);

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return {
    filters,
    setFilters,
    filteredCompanies,
    resetFilters,
  };
};
