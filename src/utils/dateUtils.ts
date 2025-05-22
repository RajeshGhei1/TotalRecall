
import { format, isValid, parse } from 'date-fns';

/**
 * Formats a date to a string in the specified format
 */
export const formatDate = (
  date: Date | string | undefined | null,
  formatString: string = 'dd/MM/yyyy'
): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return isValid(dateObj) ? format(dateObj, formatString) : '';
};

/**
 * Parses a date string in various formats to a standardized ISO string
 */
export const parseFormDate = (dateValue: any): string | null => {
  if (!dateValue) return null;
  
  try {
    // If it's already a Date object
    if (dateValue instanceof Date) {
      if (isValid(dateValue)) {
        return dateValue.toISOString().split('T')[0]; // YYYY-MM-DD format
      }
      return null;
    }
    
    // If it's a string, try parsing it as DD/MM/YYYY
    if (typeof dateValue === 'string') {
      // Try to parse as DD/MM/YYYY
      const parsedDate = parse(dateValue, 'dd/MM/yyyy', new Date());
      if (isValid(parsedDate)) {
        return parsedDate.toISOString().split('T')[0];
      }
      
      // Try as standard ISO date
      const dateObj = new Date(dateValue);
      if (isValid(dateObj)) {
        return dateObj.toISOString().split('T')[0];
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error parsing date:", error, dateValue);
    return null;
  }
};
