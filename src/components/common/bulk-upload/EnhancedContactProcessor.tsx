
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
              // Simple update - new data overwrites old (only for fields that exist)
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

            // Note: Company relationship handling removed since it would require additional tables
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

      } catch (error: any) {
        results.failed++;
        results.errors.push(`${contact.full_name || 'Unknown'}: ${error.message}`);
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

    // Note: Company relationship handling removed since it would require additional tables
    return insertedPerson.id;
  }

  private static convertContactToPersonData(contact: ContactCSVRow) {
    // Only include fields that exist in the people table
    return {
      full_name: contact.full_name,
      email: contact.email,
      phone: contact.phone || null,
      location: contact.location || null,
      type: 'contact' // Set the type based on what's being imported
    };
  }
}
