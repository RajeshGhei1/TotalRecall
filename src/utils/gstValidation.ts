
export const validateGSTNumber = (gstNumber: string): { isValid: boolean; message?: string } => {
  if (!gstNumber) {
    return { isValid: true }; // GST is optional
  }

  // Remove spaces and convert to uppercase
  const cleanGST = gstNumber.replace(/\s/g, '').toUpperCase();
  
  // GST format: 2 digits (state code) + 10 alphanumeric (PAN) + 1 digit (entity number) + Z + 1 alphanumeric (checksum)
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  
  if (!gstRegex.test(cleanGST)) {
    return {
      isValid: false,
      message: 'Invalid GST format. Expected format: 22AAAAA0000A1Z5'
    };
  }

  return { isValid: true };
};

export const formatGSTNumber = (gstNumber: string): string => {
  if (!gstNumber) return '';
  
  const cleanGST = gstNumber.replace(/\s/g, '').toUpperCase();
  
  // Format as: 22 AAAAA 0000 A1Z5
  if (cleanGST.length === 15) {
    return `${cleanGST.slice(0, 2)} ${cleanGST.slice(2, 7)} ${cleanGST.slice(7, 11)} ${cleanGST.slice(11)}`;
  }
  
  return cleanGST;
};
