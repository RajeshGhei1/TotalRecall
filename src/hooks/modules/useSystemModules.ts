
import { useState, useEffect } from 'react';

export interface SystemModule {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
}

export const useSystemModules = () => {
  const [data, setData] = useState<SystemModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock loading modules
    setTimeout(() => {
      setData([
        {
          id: '1',
          name: 'Forms',
          description: 'Form management and processing',
          is_active: true
        },
        {
          id: '2',
          name: 'Workflow',
          description: 'Workflow automation',
          is_active: true
        }
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  return { data, isLoading };
};
