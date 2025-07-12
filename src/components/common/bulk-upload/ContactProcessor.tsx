
import { supabase } from '@/integrations/supabase/client';
import { ContactCSVRow } from './FileProcessor';

export interface ProcessingResults {
  successful: number;
  failed: number;
  errors: string[];
}

export class ContactProcessor {
  static async processContacts(contacts: ContactCSVRow[]): Promise<ProcessingResults> {
    const results = { successful: 0, failed: 0, errors: [] as string[] };
    
    for (const contact of contacts) {
      try {
        // Validate required fields
        if (!contact.full_name || !contact.email) {
          results.failed++;
          results.errors.push(`Row ${results.successful + results.failed + 1}: Missing required fields (full_name, email)`);
          continue;
        }
        
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
        
        // Create person record with all fields
        const personData = {
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
        
        const { data: insertedPerson, error: personError } = await supabase
          .from('people')
          .insert([personData])
          .select()
          .single();
          
        if (personError) throw personError;
        
        // If company_name is provided, try to find or create company and link
        if (contact.company_name && contact.role && insertedPerson) {
          await this.handleCompanyRelationship(contact, insertedPerson.id);
        }
        
        results.successful++;
        
      } catch (error: unknown) {
        results.failed++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        results.errors.push(`${contact.full_name || 'Unknown'}: ${errorMessage}`);
      }
    }
    
    return results;
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
