import { supabase } from '@/integrations/supabase/client';
import { ContactCSVRow } from './FileProcessor';
import { DuplicateDetector } from './DuplicateDetector';
import { SmartMerger } from './SmartMerger';
import { ProcessingResultsEnhanced, DuplicateStrategy, MergeOptions, DuplicateInfo } from './types';

export class EnhancedContactProcessor {
  static async processContactsWithDuplicateHandling(
    contacts: ContactCSVRow[],
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
    console.log('Starting duplicate detection...');
    const duplicates = await DuplicateDetector.detectDuplicates(contacts, strategy);
    results.duplicates_found = duplicates.length;
    results.duplicate_details = duplicates;

    console.log(`Found ${duplicates.length} potential duplicates`);

    // Create a map for quick duplicate lookup
    const duplicateMap = new Map<number, DuplicateInfo>();
    duplicates.forEach(duplicate => {
      duplicateMap.set(duplicate.row - 2, duplicate); // Convert back to 0-based index
    });

    // Process each contact
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      const duplicate = duplicateMap.get(i);

      try {
        // Validate required fields
        if (!contact.full_name || !contact.email) {
          results.failed++;
          results.errors.push(`Row ${i + 2}: Missing required fields (full_name, email)`);
          continue;
        }

        if (duplicate) {
          // Handle duplicate according to strategy
          const action = duplicate.suggestedAction;
          
          if (action === 'skip') {
            results.duplicates_skipped++;
            console.log(`Skipping duplicate: ${contact.full_name}`);
            continue;
          } else if (action === 'merge' || action === 'update') {
            // Merge or update existing record
            const existingRecord = duplicate.existingRecord;
            let updatedData;

            if (action === 'merge') {
              updatedData = SmartMerger.mergeContacts(existingRecord, contact, mergeOptions);
            } else {
              // Simple update - new data overwrites old
              updatedData = this.convertContactToPersonData(contact);
            }

            const { error: updateError } = await supabase
              .from('people')
              .update(updatedData)
              .eq('id', existingRecord.id);

            if (updateError) {
              throw updateError;
            }

            results.duplicates_merged++;
            console.log(`${action === 'merge' ? 'Merged' : 'Updated'} duplicate: ${contact.full_name}`);

            // Handle company relationship if provided
            if (contact.company_name && contact.role) {
              await this.handleCompanyRelationship(contact, existingRecord.id);
            }
          } else if (action === 'create_anyway') {
            // Create new record despite being a duplicate
            await this.createNewPerson(contact);
            results.successful++;
            console.log(`Created anyway (duplicate): ${contact.full_name}`);
          } else if (action === 'review') {
            // Skip for now, but mark for manual review
            results.duplicates_skipped++;
            results.errors.push(`Row ${i + 2}: ${contact.full_name} - Flagged for manual review`);
            continue;
          }
        } else {
          // No duplicate found, create new record
          await this.createNewPerson(contact);
          results.successful++;
          console.log(`Created new person: ${contact.full_name}`);
        }

      } catch (error: unknown) {
        results.failed++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        results.errors.push(`${contact.full_name || 'Unknown'}: ${errorMessage}`);
        console.error(`Error processing ${contact.full_name}:`, error);
      }
    }

    return results;
  }

  private static async createNewPerson(contact: ContactCSVRow): Promise<string> {
    const personData = this.convertContactToPersonData(contact);

    const { data: insertedPerson, error: personError } = await supabase
      .from('people')
      .insert([personData])
      .select()
      .single();

    if (personError) throw personError;

    // Handle company relationship if provided
    if (contact.company_name && contact.role && insertedPerson) {
      await this.handleCompanyRelationship(contact, insertedPerson.id);
    }

    return insertedPerson.id;
  }

  private static convertContactToPersonData(contact: ContactCSVRow) {
    // Parse experience years
    const experienceYears = contact.experience_years ? parseInt(contact.experience_years) : null;
    
    // Parse desired salary
    const desiredSalary = contact.desired_salary ? parseFloat(contact.desired_salary.replace(/[,$]/g, '')) : null;
    
    // Parse skills (comma-separated string to array)
    let skillsArray = [];
    if (contact.skills) {
      skillsArray = contact.skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    }
    
    // Parse availability date
    let availabilityDate = null;
    if (contact.availability_date) {
      const parsedDate = new Date(contact.availability_date);
      if (!isNaN(parsedDate.getTime())) {
        availabilityDate = parsedDate.toISOString().split('T')[0];
      }
    }

    return {
      full_name: contact.full_name,
      email: contact.email,
      phone: contact.phone || null,
      location: contact.location || null,
      personal_email: contact.personal_email || null,
      linkedin_url: contact.linkedin_url || null,
      current_title: contact.current_title || null,
      current_company: contact.current_company || null,
      experience_years: experienceYears,
      skills: skillsArray.length > 0 ? JSON.stringify(skillsArray) : null,
      notes: contact.notes || null,
      availability_date: availabilityDate,
      desired_salary: desiredSalary,
      resume_url: contact.resume_url || null,
      portfolio_url: contact.portfolio_url || null,
      type: 'contact'
    };
  }

  private static async handleCompanyRelationship(contact: ContactCSVRow, personId: string) {
    try {
      // First try to find existing company
      let { data: companyData, error: companyFindError } = await supabase
        .from('companies')
        .select('id, name')
        .ilike('name', contact.company_name!)
        .limit(1);
        
      if (companyFindError) {
        console.warn('Error finding company:', companyFindError);
      }
      
      let companyId: string;
      
      if (companyData && companyData.length > 0) {
        companyId = companyData[0].id;
      } else {
        // Create new company
        const { data: newCompanyData, error: companyCreateError } = await supabase
          .from('companies')
          .insert([{
            name: contact.company_name,
            description: `Company created via bulk upload for ${contact.full_name}`
          }])
          .select('id')
          .single();
          
        if (companyCreateError) throw companyCreateError;
        companyId = newCompanyData.id;
      }
      
      // Create company relationship
      const { error: relationshipError } = await supabase
        .from('company_relationships')
        .insert([{
          person_id: personId,
          company_id: companyId,
          role: contact.role,
          relationship_type: 'business_contact',
          start_date: new Date().toISOString().split('T')[0],
          is_current: true
        }]);
        
      if (relationshipError) {
        console.warn('Error creating company relationship:', relationshipError);
        // Don't fail the entire import for relationship errors
      }
    } catch (error) {
      console.warn('Error handling company relationship:', error);
      // Don't fail the entire import for relationship errors
    }
  }
}
