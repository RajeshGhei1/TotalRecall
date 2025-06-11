
import { useMemo } from 'react';
import { Company } from '@/hooks/useCompanies';

export interface CompanyFilters {
  search: string;
  
  // Basic Information
  industries: string[];
  sizes: string[];
  companyTypes: string[];
  entityTypes: string[];
  sectors: string[];
  statuses: string[];
  
  // Location & Geography
  locations: string[];
  countries: string[];
  globalRegions: string[];
  regions: string[];
  hoLocations: string[];
  
  // Business Metrics
  employeeCountMin?: string;
  employeeCountMax?: string;
  turnoverMin?: string;
  turnoverMax?: string;
  paidCapitalMin?: string;
  paidCapitalMax?: string;
  employeeSegments: string[];
  turnoverSegments: string[];
  capitalSegments: string[];
  turnoverYears: string[];
  
  // Date Ranges
  foundedFrom?: Date;
  foundedTo?: Date;
  registrationFrom?: Date;
  registrationTo?: Date;
  establishmentFrom?: Date;
  establishmentTo?: Date;
  
  // Business Profile
  specializations: string[];
  serviceLines: string[];
  verticals: string[];
  
  // Hierarchy
  companyGroups: string[];
  hierarchyLevelMin?: string;
  hierarchyLevelMax?: string;
  hasParent: string[];
  
  // Contact & Social Media
  hasEmail: string[];
  hasPhone: string[];
  hasWebsite: string[];
  hasLinkedin: string[];
  hasTwitter: string[];
  hasFacebook: string[];
}

export const useCompanyFilters = (
  companies: Company[] | undefined,
  filters: CompanyFilters,
  searchTerm: string
) => {
  const filteredCompanies = useMemo(() => {
    // Return empty array if companies is not available or not an array
    if (!companies || !Array.isArray(companies)) {
      return [];
    }

    let filtered = [...companies];

    // Apply global search filter
    if (searchTerm?.trim()) {
      const search = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(company => 
        company.name?.toLowerCase().includes(search) ||
        company.domain?.toLowerCase().includes(search) ||
        company.email?.toLowerCase().includes(search) ||
        company.industry1?.toLowerCase().includes(search) ||
        company.industry2?.toLowerCase().includes(search) ||
        company.industry3?.toLowerCase().includes(search) ||
        company.location?.toLowerCase().includes(search) ||
        company.description?.toLowerCase().includes(search) ||
        company.companyprofile?.toLowerCase().includes(search) ||
        company.areaofspecialize?.toLowerCase().includes(search) ||
        company.serviceline?.toLowerCase().includes(search) ||
        company.verticles?.toLowerCase().includes(search)
      );
    }

    // Apply industry filter (check all industry fields)
    if (filters.industries && Array.isArray(filters.industries) && filters.industries.length > 0) {
      filtered = filtered.filter(company => 
        (company.industry1 && filters.industries.includes(company.industry1)) ||
        (company.industry2 && filters.industries.includes(company.industry2)) ||
        (company.industry3 && filters.industries.includes(company.industry3))
      );
    }

    // Apply size filter
    if (filters.sizes && Array.isArray(filters.sizes) && filters.sizes.length > 0) {
      filtered = filtered.filter(company => 
        company.size && filters.sizes.includes(company.size)
      );
    }

    // Apply company type filter
    if (filters.companyTypes && Array.isArray(filters.companyTypes) && filters.companyTypes.length > 0) {
      filtered = filtered.filter(company => 
        company.companytype && filters.companyTypes.includes(company.companytype)
      );
    }

    // Apply entity type filter
    if (filters.entityTypes && Array.isArray(filters.entityTypes) && filters.entityTypes.length > 0) {
      filtered = filtered.filter(company => 
        company.entitytype && filters.entityTypes.includes(company.entitytype)
      );
    }

    // Apply sector filter
    if (filters.sectors && Array.isArray(filters.sectors) && filters.sectors.length > 0) {
      filtered = filtered.filter(company => 
        company.companysector && filters.sectors.includes(company.companysector)
      );
    }

    // Apply status filter
    if (filters.statuses && Array.isArray(filters.statuses) && filters.statuses.length > 0) {
      filtered = filtered.filter(company => 
        company.companystatus && filters.statuses.includes(company.companystatus)
      );
    }

    // Apply location filter
    if (filters.locations && Array.isArray(filters.locations) && filters.locations.length > 0) {
      filtered = filtered.filter(company => 
        company.location && filters.locations.includes(company.location)
      );
    }

    // Apply country filter
    if (filters.countries && Array.isArray(filters.countries) && filters.countries.length > 0) {
      filtered = filtered.filter(company => 
        company.country && filters.countries.includes(company.country)
      );
    }

    // Apply global region filter
    if (filters.globalRegions && Array.isArray(filters.globalRegions) && filters.globalRegions.length > 0) {
      filtered = filtered.filter(company => 
        company.globalregion && filters.globalRegions.includes(company.globalregion)
      );
    }

    // Apply region filter
    if (filters.regions && Array.isArray(filters.regions) && filters.regions.length > 0) {
      filtered = filtered.filter(company => 
        company.region && filters.regions.includes(company.region)
      );
    }

    // Apply HO location filter
    if (filters.hoLocations && Array.isArray(filters.hoLocations) && filters.hoLocations.length > 0) {
      filtered = filtered.filter(company => 
        company.holocation && filters.hoLocations.includes(company.holocation)
      );
    }

    // Apply employee count range filter
    if (filters.employeeCountMin || filters.employeeCountMax) {
      filtered = filtered.filter(company => {
        if (!company.noofemployee) return false;
        const employeeCount = parseInt(company.noofemployee);
        if (isNaN(employeeCount)) return false;
        
        const min = filters.employeeCountMin ? parseInt(filters.employeeCountMin) : 0;
        const max = filters.employeeCountMax ? parseInt(filters.employeeCountMax) : Infinity;
        
        return employeeCount >= min && employeeCount <= max;
      });
    }

    // Apply turnover range filter
    if (filters.turnoverMin || filters.turnoverMax) {
      filtered = filtered.filter(company => {
        if (!company.turnover) return false;
        const turnover = parseFloat(company.turnover);
        if (isNaN(turnover)) return false;
        
        const min = filters.turnoverMin ? parseFloat(filters.turnoverMin) : 0;
        const max = filters.turnoverMax ? parseFloat(filters.turnoverMax) : Infinity;
        
        return turnover >= min && turnover <= max;
      });
    }

    // Apply paid capital range filter
    if (filters.paidCapitalMin || filters.paidCapitalMax) {
      filtered = filtered.filter(company => {
        if (!company.paidupcapital) return false;
        const capital = parseFloat(company.paidupcapital);
        if (isNaN(capital)) return false;
        
        const min = filters.paidCapitalMin ? parseFloat(filters.paidCapitalMin) : 0;
        const max = filters.paidCapitalMax ? parseFloat(filters.paidCapitalMax) : Infinity;
        
        return capital >= min && capital <= max;
      });
    }

    // Apply employee segment filter
    if (filters.employeeSegments && Array.isArray(filters.employeeSegments) && filters.employeeSegments.length > 0) {
      filtered = filtered.filter(company => 
        company.segmentaspernumberofemployees && filters.employeeSegments.includes(company.segmentaspernumberofemployees)
      );
    }

    // Apply turnover segment filter
    if (filters.turnoverSegments && Array.isArray(filters.turnoverSegments) && filters.turnoverSegments.length > 0) {
      filtered = filtered.filter(company => 
        company.segmentasperturnover && filters.turnoverSegments.includes(company.segmentasperturnover)
      );
    }

    // Apply capital segment filter
    if (filters.capitalSegments && Array.isArray(filters.capitalSegments) && filters.capitalSegments.length > 0) {
      filtered = filtered.filter(company => 
        company.segmentasperpaidupcapital && filters.capitalSegments.includes(company.segmentasperpaidupcapital)
      );
    }

    // Apply turnover year filter
    if (filters.turnoverYears && Array.isArray(filters.turnoverYears) && filters.turnoverYears.length > 0) {
      filtered = filtered.filter(company => 
        company.turnoveryear && filters.turnoverYears.includes(company.turnoveryear)
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

    // Apply establishment date range filter
    if (filters.establishmentFrom || filters.establishmentTo) {
      filtered = filtered.filter(company => {
        if (!company.yearofestablishment) return false;
        const estYear = parseInt(company.yearofestablishment);
        if (isNaN(estYear)) return false;
        if (filters.establishmentFrom && estYear < filters.establishmentFrom.getFullYear()) return false;
        if (filters.establishmentTo && estYear > filters.establishmentTo.getFullYear()) return false;
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

    // Apply specialization filter
    if (filters.specializations && Array.isArray(filters.specializations) && filters.specializations.length > 0) {
      filtered = filtered.filter(company => 
        company.areaofspecialize && filters.specializations.includes(company.areaofspecialize)
      );
    }

    // Apply service line filter
    if (filters.serviceLines && Array.isArray(filters.serviceLines) && filters.serviceLines.length > 0) {
      filtered = filtered.filter(company => 
        company.serviceline && filters.serviceLines.includes(company.serviceline)
      );
    }

    // Apply verticals filter
    if (filters.verticals && Array.isArray(filters.verticals) && filters.verticals.length > 0) {
      filtered = filtered.filter(company => 
        company.verticles && filters.verticals.includes(company.verticles)
      );
    }

    // Apply company group filter
    if (filters.companyGroups && Array.isArray(filters.companyGroups) && filters.companyGroups.length > 0) {
      filtered = filtered.filter(company => 
        company.company_group_name && filters.companyGroups.includes(company.company_group_name)
      );
    }

    // Apply hierarchy level range filter
    if (filters.hierarchyLevelMin || filters.hierarchyLevelMax) {
      filtered = filtered.filter(company => {
        const level = company.hierarchy_level || 0;
        const min = filters.hierarchyLevelMin ? parseInt(filters.hierarchyLevelMin) : 0;
        const max = filters.hierarchyLevelMax ? parseInt(filters.hierarchyLevelMax) : Infinity;
        
        return level >= min && level <= max;
      });
    }

    // Apply has parent filter
    if (filters.hasParent && Array.isArray(filters.hasParent) && filters.hasParent.length > 0) {
      filtered = filtered.filter(company => {
        const hasParent = !!company.parent_company_id;
        return filters.hasParent.includes(hasParent.toString());
      });
    }

    // Apply contact and social media filters
    if (filters.hasEmail && Array.isArray(filters.hasEmail) && filters.hasEmail.length > 0) {
      filtered = filtered.filter(company => {
        const hasEmail = !!company.email;
        return filters.hasEmail.includes(hasEmail.toString());
      });
    }

    if (filters.hasPhone && Array.isArray(filters.hasPhone) && filters.hasPhone.length > 0) {
      filtered = filtered.filter(company => {
        const hasPhone = !!company.phone;
        return filters.hasPhone.includes(hasPhone.toString());
      });
    }

    if (filters.hasWebsite && Array.isArray(filters.hasWebsite) && filters.hasWebsite.length > 0) {
      filtered = filtered.filter(company => {
        const hasWebsite = !!company.website;
        return filters.hasWebsite.includes(hasWebsite.toString());
      });
    }

    if (filters.hasLinkedin && Array.isArray(filters.hasLinkedin) && filters.hasLinkedin.length > 0) {
      filtered = filtered.filter(company => {
        const hasLinkedin = !!company.linkedin;
        return filters.hasLinkedin.includes(hasLinkedin.toString());
      });
    }

    if (filters.hasTwitter && Array.isArray(filters.hasTwitter) && filters.hasTwitter.length > 0) {
      filtered = filtered.filter(company => {
        const hasTwitter = !!company.twitter;
        return filters.hasTwitter.includes(hasTwitter.toString());
      });
    }

    if (filters.hasFacebook && Array.isArray(filters.hasFacebook) && filters.hasFacebook.length > 0) {
      filtered = filtered.filter(company => {
        const hasFacebook = !!company.facebook;
        return filters.hasFacebook.includes(hasFacebook.toString());
      });
    }

    return filtered;
  }, [companies, filters, searchTerm]);

  return {
    filteredCompanies
  };
};
