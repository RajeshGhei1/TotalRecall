
import { supabase } from '@/integrations/supabase/client';
import { DuplicateInfo, DuplicateMatch, DuplicateStrategy } from './types';

export interface CompanyCSVRow {
  // Basic Information
  name: string;
  cin?: string;
  email?: string;
  website?: string;
  domain?: string;
  phone?: string;
  description?: string;
  founded?: string;
  
  // Location & Address
  location?: string;
  registeredofficeaddress?: string;
  country?: string;
  globalregion?: string;
  region?: string;
  holocation?: string;
  
  // Industry & Classification
  industry1?: string;
  industry2?: string;
  industry3?: string;
  companysector?: string;
  companytype?: string;
  entitytype?: string;
  
  // Business Details
  size?: string;
  noofemployee?: string;
  segmentaspernumberofemployees?: string;
  turnover?: string;
  segmentasperturnover?: string;
  turnoveryear?: string;
  yearofestablishment?: string;
  paidupcapital?: string;
  segmentasperpaidupcapital?: string;
  
  // Legal & Registration
  companystatus?: string;
  registrationdate?: string;
  registeredemailaddress?: string;
  noofdirectives?: string;
  
  // Business Profile
  companyprofile?: string;
  areaofspecialize?: string;
  serviceline?: string;
  verticles?: string;
  
  // Social Media
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  
  // Hierarchy
  parent_company_id?: string;
  company_group_name?: string;
  hierarchy_level?: string;
  
  // GST Numbers (for branch offices)
  gst_number?: string;
  branch_office_1_gst?: string;
  branch_office_2_gst?: string;
  branch_office_3_gst?: string;
  branch_office_4_gst?: string;
}

export class CompanyDuplicateDetector {
  private static normalizeCIN(cin: string): string {
    if (!cin) return '';
    return cin.toUpperCase().trim().replace(/[^A-Z0-9]/g, '');
  }

  private static normalizeGST(gst: string): string {
    if (!gst) return '';
    return gst.toUpperCase().trim().replace(/[^A-Z0-9]/g, '');
  }

  private static normalizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  private static normalizeName(name: string): string {
    return name.toLowerCase().trim().replace(/[^\w\s]/g, '');
  }

  private static calculateNameSimilarity(name1: string, name2: string): number {
    const n1 = this.normalizeName(name1);
    const n2 = this.normalizeName(name2);
    
    if (n1 === n2) return 1.0;
    
    // Simple Levenshtein distance calculation
    const matrix = Array(n2.length + 1).fill(null).map(() => Array(n1.length + 1).fill(null));
    
    for (let i = 0; i <= n1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= n2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= n2.length; j++) {
      for (let i = 1; i <= n1.length; i++) {
        const indicator = n1[i - 1] === n2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    const maxLength = Math.max(n1.length, n2.length);
    return maxLength === 0 ? 1 : 1 - (matrix[n2.length][n1.length] / maxLength);
  }

  private static extractGSTNumbers(company: CompanyCSVRow): string[] {
    const gstNumbers: string[] = [];
    
    // Main GST number
    if (company.gst_number) {
      gstNumbers.push(this.normalizeGST(company.gst_number));
    }
    
    // Branch office GST numbers
    for (let i = 1; i <= 4; i++) {
      const gstField = company[`branch_office_${i}_gst` as keyof CompanyCSVRow] as string;
      if (gstField) {
        gstNumbers.push(this.normalizeGST(gstField));
      }
    }
    
    return gstNumbers.filter(gst => gst.length > 0);
  }

  static async detectDuplicates(
    companies: CompanyCSVRow[],
    strategy: DuplicateStrategy
  ): Promise<DuplicateInfo[]> {
    const duplicates: DuplicateInfo[] = [];
    
    // Get all existing companies and their branch offices for GST comparison
    const { data: existingCompanies, error: companiesError } = await supabase
      .from('companies')
      .select('*');
    
    if (companiesError) {
      console.error('Error fetching existing companies:', companiesError);
      return [];
    }

    // Get branch offices for GST comparison
    const { data: branchOffices, error: branchError } = await supabase
      .from('company_branch_offices')
      .select('company_id, gst_number');
    
    if (branchError) {
      console.error('Error fetching branch offices:', branchError);
    }

    // Create a map of company to GST numbers
    const companyGSTMap = new Map<string, string[]>();
    if (branchOffices) {
      branchOffices.forEach(branch => {
        if (branch.gst_number) {
          const existingGSTs = companyGSTMap.get(branch.company_id) || [];
          existingGSTs.push(this.normalizeGST(branch.gst_number));
          companyGSTMap.set(branch.company_id, existingGSTs);
        }
      });
    }

    for (let i = 0; i < companies.length; i++) {
      const company = companies[i];
      const matches: DuplicateMatch[] = [];
      let bestMatch: any = null;
      let highestConfidence = 0;

      for (const existing of existingCompanies || []) {
        const currentMatches: DuplicateMatch[] = [];
        let totalConfidence = 0;

        // Primary: CIN match (highest priority)
        if (company.cin && existing.cin) {
          const normalizedCompanyCIN = this.normalizeCIN(company.cin);
          const normalizedExistingCIN = this.normalizeCIN(existing.cin);
          
          if (normalizedCompanyCIN === normalizedExistingCIN && normalizedCompanyCIN.length > 0) {
            currentMatches.push({
              type: 'cin',
              confidence: 1.0,
              field: 'cin',
              value: company.cin
            });
            totalConfidence += 1.0;
          }
        }

        // Secondary: GST number match
        const companyGSTs = this.extractGSTNumbers(company);
        const existingGSTs = companyGSTMap.get(existing.id) || [];
        
        for (const companyGST of companyGSTs) {
          for (const existingGST of existingGSTs) {
            if (companyGST === existingGST && companyGST.length >= 15) {
              currentMatches.push({
                type: 'gst',
                confidence: 0.95,
                field: 'gst_number',
                value: companyGST
              });
              totalConfidence += 0.95;
              break; // Only count one GST match per company pair
            }
          }
        }

        // Email match
        if (company.email && existing.email) {
          const normalizedCompanyEmail = this.normalizeEmail(company.email);
          const normalizedExistingEmail = this.normalizeEmail(existing.email);
          
          if (normalizedCompanyEmail === normalizedExistingEmail) {
            currentMatches.push({
              type: 'email',
              confidence: 0.9,
              field: 'email',
              value: company.email
            });
            totalConfidence += 0.9;
          }
        }

        // Name match
        if (company.name && existing.name) {
          const nameSimilarity = this.calculateNameSimilarity(company.name, existing.name);
          
          if (nameSimilarity >= 0.85) {
            currentMatches.push({
              type: 'name_company',
              confidence: nameSimilarity,
              field: 'name',
              value: company.name
            });
            totalConfidence += nameSimilarity * 0.7; // Lower weight for name-only matches
          }
        }

        // Website/domain match
        if (company.website && existing.website) {
          const companyDomain = company.website.toLowerCase().replace(/^https?:\/\/(www\.)?/, '');
          const existingDomain = existing.website.toLowerCase().replace(/^https?:\/\/(www\.)?/, '');
          
          if (companyDomain === existingDomain) {
            currentMatches.push({
              type: 'website',
              confidence: 0.8,
              field: 'website',
              value: company.website
            });
            totalConfidence += 0.8;
          }
        }

        // If we found matches above threshold, consider this a duplicate
        if (currentMatches.length > 0 && totalConfidence >= strategy.confidenceThreshold) {
          if (totalConfidence > highestConfidence) {
            highestConfidence = totalConfidence;
            bestMatch = existing;
            matches.splice(0, matches.length, ...currentMatches);
          }
        }
      }

      if (bestMatch && matches.length > 0) {
        // Determine suggested action based on match types and strategy
        let suggestedAction = strategy.primaryAction;
        
        const hasCINMatch = matches.some(m => m.type === 'cin');
        const hasGSTMatch = matches.some(m => m.type === 'gst');
        const hasEmailMatch = matches.some(m => m.type === 'email');
        const hasNameMatch = matches.some(m => m.type === 'name_company');

        if (hasCINMatch) {
          suggestedAction = 'merge'; // CIN is unique identifier, always merge
        } else if (hasGSTMatch) {
          suggestedAction = strategy.emailMatches; // Use email strategy for GST
        } else if (hasEmailMatch) {
          suggestedAction = strategy.emailMatches;
        } else if (hasNameMatch) {
          suggestedAction = strategy.nameMatches;
        }

        duplicates.push({
          row: i + 2, // +2 because we start from row 1 and skip header
          newRecord: company,
          existingRecord: bestMatch,
          matches,
          suggestedAction
        });
      }
    }

    return duplicates;
  }
}
