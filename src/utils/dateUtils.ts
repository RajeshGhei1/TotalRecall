
import { format, isValid, parse } from 'date-fns';

/**
 * Formats a date to a string in the specified format
 */
export const formatDate = (
  date: Date | string | undefined | null,
  formatString: string = 'dd/MM/yyyy'
): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return isValid(dateObj) ? format(dateObj, formatString) : '';
  } catch (error) {
    console.error("Error formatting date:", error, date);
    return '';
  }
};

/**
 * Parses a date string in various formats to a standardized ISO string
 */
export const parseFormDate = (dateValue: unknown): string | null => {
  if (!dateValue) return null;
  
  try {
    // If it's already a Date object
    if (dateValue instanceof Date) {
      if (isValid(dateValue)) {
        return dateValue.toISOString().split('T')[0]; // YYYY-MM-DD format
      }
      return null;
    }
    
    // If it's a string, try parsing it in multiple formats
    if (typeof dateValue === 'string') {
      // Try to parse as DD/MM/YYYY first
      const ddmmyyyyDate = parse(dateValue, 'dd/MM/yyyy', new Date());
      if (isValid(ddmmyyyyDate)) {
        return ddmmyyyyDate.toISOString().split('T')[0];
      }
      
      // Try to parse as YYYY-MM-DD
      const yyyymmddDate = parse(dateValue, 'yyyy-MM-dd', new Date());
      if (isValid(yyyymmddDate)) {
        return yyyymmddDate.toISOString().split('T')[0];
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

/**
 * Converts a date string to a Date object safely
 */
export const stringToDate = (dateString: string | null | undefined): Date | undefined => {
  if (!dateString) return undefined;
  
  try {
    // Try parsing as DD/MM/YYYY first
    const ddmmyyyyDate = parse(dateString, 'dd/MM/yyyy', new Date());
    if (isValid(ddmmyyyyDate)) {
      return ddmmyyyyDate;
    }
    
    // Try as ISO date
    const date = new Date(dateString);
    return isValid(date) ? date : undefined;
  } catch (error) {
    console.error("Error converting string to date:", error, dateString);
    return undefined;
  }
};

/**
 * Formats a date for display in a consistent manner
 */
export const formatDisplayDate = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? stringToDate(date) : date;
    return dateObj && isValid(dateObj) ? format(dateObj, 'PPP') : '';
  } catch (error) {
    console.error("Error formatting date for display:", error, date);
    return '';
  }
};

/**
 * Safely formats a date for form input (DD/MM/YYYY)
 */
export const formatDateForInput = (date: Date | string | null | undefined): string => {
  return formatDate(date, 'dd/MM/yyyy');
};

/**
 * Validates if a string is a valid date in DD/MM/YYYY format
 */
export const isValidDateString = (dateString: string): boolean => {
  if (!dateString || dateString.length !== 10) return false;
  
  try {
    const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
    return isValid(parsedDate);
  } catch {
    return false;
  }
};
