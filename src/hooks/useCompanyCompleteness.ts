
import { useMemo } from 'react';
import { Company } from '@/hooks/useCompanies';
import { calculateCompanyCompleteness, CompanyCompletenessResult } from '@/utils/companyCompletenessCalculator';

export interface CompanyWithCompleteness extends Company {
  completeness: CompanyCompletenessResult;
}

export interface CompletenessStats {
  averageScore: number;
  companiesAbove80: number;
  companiesBelow60: number;
  totalCompanies: number;
}

export const useCompanyCompleteness = (companies: Company[]) => {
  const companiesWithCompleteness = useMemo<CompanyWithCompleteness[]>(() => {
    return companies.map(company => ({
      ...company,
      completeness: calculateCompanyCompleteness(company),
    }));
  }, [companies]);

  const stats = useMemo<CompletenessStats>(() => {
    if (!companiesWithCompleteness.length) {
      return {
        averageScore: 0,
        companiesAbove80: 0,
        companiesBelow60: 0,
        totalCompanies: 0,
      };
    }

    const totalScore = companiesWithCompleteness.reduce(
      (sum, company) => sum + company.completeness.score,
      0
    );

    const averageScore = Math.round(totalScore / companiesWithCompleteness.length);
    const companiesAbove80 = companiesWithCompleteness.filter(c => c.completeness.score >= 80).length;
    const companiesBelow60 = companiesWithCompleteness.filter(c => c.completeness.score < 60).length;

    return {
      averageScore,
      companiesAbove80,
      companiesBelow60,
      totalCompanies: companiesWithCompleteness.length,
    };
  }, [companiesWithCompleteness]);

  return {
    companiesWithCompleteness,
    stats,
  };
};
