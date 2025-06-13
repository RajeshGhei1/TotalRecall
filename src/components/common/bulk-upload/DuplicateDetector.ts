
import { supabase } from '@/integrations/supabase/client';
import { ContactCSVRow } from './FileProcessor';
import { DuplicateInfo, DuplicateMatch, DuplicateStrategy } from './types';

export class DuplicateDetector {
  private static normalizePhone(phone: string): string {
    if (!phone) return '';
    return phone.replace(/[^\d]/g, '').replace(/^1/, '');
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

  static async detectDuplicates(
    contacts: ContactCSVRow[],
    strategy: DuplicateStrategy
  ): Promise<DuplicateInfo[]> {
    const duplicates: DuplicateInfo[] = [];
    
    // Get all existing people for comparison - select the fields that actually exist
    const { data: existingPeople, error } = await supabase
      .from('people')
      .select('*');
    
    if (error) {
      console.error('Error fetching existing people:', error);
      return [];
    }

    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      const matches: DuplicateMatch[] = [];
      let bestMatch: any = null;
      let highestConfidence = 0;

      for (const existing of existingPeople || []) {
        const currentMatches: DuplicateMatch[] = [];
        let totalConfidence = 0;

        // Email match (highest priority)
        if (contact.email && existing.email) {
          const normalizedContactEmail = this.normalizeEmail(contact.email);
          const normalizedExistingEmail = this.normalizeEmail(existing.email);
          
          if (normalizedContactEmail === normalizedExistingEmail) {
            currentMatches.push({
              type: 'email',
              confidence: 1.0,
              field: 'email',
              value: contact.email
            });
            totalConfidence += 1.0;
          }
        }

        // Phone match
        if (contact.phone && existing.phone) {
          const normalizedContactPhone = this.normalizePhone(contact.phone);
          const normalizedExistingPhone = this.normalizePhone(existing.phone);
          
          if (normalizedContactPhone === normalizedExistingPhone && normalizedContactPhone.length >= 7) {
            currentMatches.push({
              type: 'phone',
              confidence: 0.9,
              field: 'phone',
              value: contact.phone
            });
            totalConfidence += 0.9;
          }
        }

        // Name + Company match - use correct field names
        if (contact.full_name && existing.full_name) {
          const nameSimilarity = this.calculateNameSimilarity(contact.full_name, existing.full_name);
          
          if (nameSimilarity >= 0.8) {
            let companyBonus = 0;
            // Use current_title field instead of current_company, or check if company fields exist
            if (contact.company_name && existing.current_title) {
              const companySimilarity = this.calculateNameSimilarity(contact.company_name, existing.current_title);
              if (companySimilarity >= 0.8) {
                companyBonus = 0.3;
              }
            }
            
            const confidence = Math.min(nameSimilarity + companyBonus, 1.0);
            if (confidence >= 0.8) {
              currentMatches.push({
                type: 'name_company',
                confidence,
                field: 'full_name',
                value: contact.full_name
              });
              totalConfidence += confidence * 0.7; // Lower weight for name matches
            }
          }
        }

        // LinkedIn match - use correct field name
        if (contact.linkedin_url && existing.linkedin_url) {
          const normalizedContactLinkedIn = contact.linkedin_url.toLowerCase().trim();
          const normalizedExistingLinkedIn = existing.linkedin_url.toLowerCase().trim();
          
          if (normalizedContactLinkedIn === normalizedExistingLinkedIn) {
            currentMatches.push({
              type: 'linkedin',
              confidence: 0.95,
              field: 'linkedin_url',
              value: contact.linkedin_url
            });
            totalConfidence += 0.95;
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
        
        const hasEmailMatch = matches.some(m => m.type === 'email');
        const hasPhoneMatch = matches.some(m => m.type === 'phone');
        const hasNameMatch = matches.some(m => m.type === 'name_company');
        const hasLinkedInMatch = matches.some(m => m.type === 'linkedin');

        if (hasEmailMatch) {
          suggestedAction = strategy.emailMatches;
        } else if (hasLinkedInMatch) {
          suggestedAction = strategy.linkedinMatches;
        } else if (hasPhoneMatch) {
          suggestedAction = strategy.phoneMatches;
        } else if (hasNameMatch) {
          suggestedAction = strategy.nameMatches;
        }

        duplicates.push({
          row: i + 2, // +2 because we start from row 1 and skip header
          newRecord: contact,
          existingRecord: bestMatch,
          matches,
          suggestedAction
        });
      }
    }

    return duplicates;
  }
}
