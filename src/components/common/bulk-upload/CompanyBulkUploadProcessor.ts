
import { supabase } from '@/integrations/supabase/client';
import { CompanyCSVRow, CompanyDuplicateDetector } from './CompanyDuplicateDetector';
import { CompanySmartMerger } from './CompanySmartMerger';
import { ProcessingResultsEnhanced, DuplicateStrategy, MergeOptions, DuplicateInfo } from './types';
import { validateGSTNumber } from '@/utils/gstValidation';

export class CompanyBulkUploadProcessor {
  static async processCompaniesWithDuplicateHandling(
    companies: CompanyCSVRow[],
    strategy: DuplicateStrategy,
    mergeOptions: MergeOptions
  ): Promise<ProcessingResultsEnhanced> {
    const results: ProcessingResultsEnhanced = {
      successful: 0,
      failed: 0,
      duplicates_found: 0,
      duplicates_skipped: 0,
      duplicates_merged: 0,
      errors: [],
      duplicate_details: []
    };

    // First, detect all duplicates
    console.log('Starting duplicate detection for companies...');
    const duplicates = await CompanyDuplicateDetector.detectDuplicates(companies, strategy);
    results.duplicates_found = duplicates.length;
    results.duplicate_details = duplicates;

    console.log(`Found ${duplicates.length} potential company duplicates`);

    // Create a map for quick duplicate lookup
    const duplicateMap = new Map<number, DuplicateInfo>();
    duplicates.forEach(duplicate => {
      duplicateMap.set(duplicate.row - 2, duplicate); // Convert back to 0-based index
    });

    // Process each company
    for (let i = 0; i < companies.length; i++) {
      const company = companies[i];
      const duplicate = duplicateMap.get(i);

      try {
        // Validate required fields
        if (!company.name) {
          results.failed++;
          results.errors.push(`Row ${i + 2}: Missing required field (name)`);
          continue;
        }

        // Validate CIN if provided
        if (company.cin) {
          const cinRegex = /^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;
          if (!cinRegex.test(company.cin.toUpperCase().replace(/[^A-Z0-9]/g, ''))) {
            results.failed++;
            results.errors.push(`Row ${i + 2}: Invalid CIN format for ${company.name}`);
            continue;
          }
        }

        // Validate GST numbers if provided
        const gstFields = ['gst_number', 'branch_office_1_gst', 'branch_office_2_gst', 'branch_office_3_gst', 'branch_office_4_gst'];
        let hasGSTError = false;
        
        for (const field of gstFields) {
          const gstValue = company[field as keyof CompanyCSVRow] as string;
          if (gstValue) {
            const gstValidation = validateGSTNumber(gstValue);
            if (!gstValidation.isValid) {
              results.failed++;
              results.errors.push(`Row ${i + 2}: ${gstValidation.message} for ${company.name} (${field})`);
              hasGSTError = true;
              break;
            }
          }
        }
        
        if (hasGSTError) continue;

        if (duplicate) {
          // Handle duplicate according to strategy
          const action = duplicate.suggestedAction;
          
          if (action === 'skip') {
            results.duplicates_skipped++;
            console.log(`Skipping duplicate company: ${company.name}`);
            continue;
          } else if (action === 'merge' || action === 'update') {
            // Merge or update existing record
            const existingRecord = duplicate.existingRecord;
            let updatedData;

            if (action === 'merge') {
              updatedData = CompanySmartMerger.mergeCompanies(existingRecord, company, mergeOptions);
            } else {
              // Simple update - new data overwrites old
              updatedData = this.convertCompanyToDbData(company);
            }

            const { error: updateError } = await supabase
              .from('companies')
              .update(updatedData)
              .eq('id', existingRecord.id);

            if (updateError) {
              throw updateError;
            }

            // Handle branch office GST numbers
            await this.handleBranchOfficeGST(existingRecord.id, company);

            results.duplicates_merged++;
            console.log(`${action === 'merge' ? 'Merged' : 'Updated'} duplicate company: ${company.name}`);

          } else if (action === 'create_anyway') {
            // Create new record despite being a duplicate
            await this.createNewCompany(company);
            results.successful++;
            console.log(`Created anyway (duplicate) company: ${company.name}`);
          } else if (action === 'review') {
            // Skip for now, but mark for manual review
            results.duplicates_skipped++;
            results.errors.push(`Row ${i + 2}: ${company.name} - Flagged for manual review`);
            continue;
          }
        } else {
          // No duplicate found, create new record
          await this.createNewCompany(company);
          results.successful++;
          console.log(`Created new company: ${company.name}`);
        }

      } catch (error: any) {
        results.failed++;
        results.errors.push(`${company.name || 'Unknown'}: ${error.message}`);
        console.error(`Error processing company ${company.name}:`, error);
      }
    }

    return results;
  }

  private static async createNewCompany(company: CompanyCSVRow): Promise<string> {
    const companyData = this.convertCompanyToDbData(company);

    const { data: insertedCompany, error: companyError } = await supabase
      .from('companies')
      .insert([companyData])
      .select()
      .single();

    if (companyError) throw companyError;

    // Handle branch office GST numbers
    await this.handleBranchOfficeGST(insertedCompany.id, company);

    return insertedCompany.id;
  }

  private static async handleBranchOfficeGST(companyId: string, company: CompanyCSVRow) {
    // Handle main GST number and branch office GST numbers
    const gstNumbers = [];
    
    if (company.gst_number) {
      gstNumbers.push({ gst: company.gst_number, name: 'Main Office', isHQ: true });
    }
    
    for (let i = 1; i <= 4; i++) {
      const gstField = company[`branch_office_${i}_gst` as keyof CompanyCSVRow] as string;
      if (gstField) {
        gstNumbers.push({ 
          gst: gstField, 
          name: `Branch Office ${i}`, 
          isHQ: false 
        });
      }
    }

    // Create branch office records for GST numbers
    for (const { gst, name, isHQ } of gstNumbers) {
      const { error } = await supabase
        .from('company_branch_offices')
        .insert({
          company_id: companyId,
          branch_name: name,
          branch_type: isHQ ? 'headquarters' : 'branch',
          gst_number: gst,
          is_headquarters: isHQ,
          is_active: true
        });

      if (error) {
        console.error(`Failed to create branch office for GST ${gst}:`, error);
      }
    }
  }

  private static convertCompanyToDbData(company: CompanyCSVRow) {
    // Convert all company fields to match database schema
    const companyData: any = {
      name: company.name,
      cin: company.cin || null,
      email: company.email || null,
      website: company.website || null,
      domain: company.domain || null,
      phone: company.phone || null,
      description: company.description || null,
      founded: company.founded ? parseInt(company.founded) : null,
      location: company.location || null,
      registeredofficeaddress: company.registeredofficeaddress || null,
      country: company.country || null,
      globalregion: company.globalregion || null,
      region: company.region || null,
      holocation: company.holocation || null,
      industry1: company.industry1 || null,
      industry2: company.industry2 || null,
      industry3: company.industry3 || null,
      companysector: company.companysector || null,
      companytype: company.companytype || null,
      entitytype: company.entitytype || null,
      size: company.size || null,
      noofemployee: company.noofemployee || null,
      segmentaspernumberofemployees: company.segmentaspernumberofemployees || null,
      turnover: company.turnover || null,
      segmentasperturnover: company.segmentasperturnover || null,
      turnoveryear: company.turnoveryear || null,
      yearofestablishment: company.yearofestablishment || null,
      paidupcapital: company.paidupcapital || null,
      segmentasperpaidupcapital: company.segmentasperpaidupcapital || null,
      companystatus: company.companystatus || null,
      registrationdate: company.registrationdate || null,
      registeredemailaddress: company.registeredemailaddress || null,
      noofdirectives: company.noofdirectives || null,
      companyprofile: company.companyprofile || null,
      areaofspecialize: company.areaofspecialize || null,
      serviceline: company.serviceline || null,
      verticles: company.verticles || null,
      linkedin: company.linkedin || null,
      twitter: company.twitter || null,
      facebook: company.facebook || null,
      parent_company_id: company.parent_company_id || null,
      company_group_name: company.company_group_name || null,
      hierarchy_level: company.hierarchy_level ? parseInt(company.hierarchy_level) : 0
    };

    return companyData;
  }
}
