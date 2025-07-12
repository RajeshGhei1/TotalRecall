
import { useState, useEffect } from 'react';

export interface Company {
  id: string;
  name: string;
  domain: string;
  industry: string;
}

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Compunknown[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data loading - in real implementation would connect to service
    setTimeout(() => {
      setCompanies([
        {
          id: '1',
          name: 'Acme Corporation',
          domain: 'acme.com',
          industry: 'Technology'
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  return {
    companies,
    isLoading,
    refetch: () => {
      setIsLoading(true);
      // Trigger refetch
    }
  };
};
