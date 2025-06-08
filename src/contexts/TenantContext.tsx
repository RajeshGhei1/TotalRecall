
import React, { createContext, useContext, useState } from 'react';

interface TenantContextType {
  selectedTenantId: string | null;
  setSelectedTenantId: (tenantId: string | null) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenantContext = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenantContext must be used within a TenantProvider');
  }
  return context;
};

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);

  return (
    <TenantContext.Provider value={{ selectedTenantId, setSelectedTenantId }}>
      {children}
    </TenantContext.Provider>
  );
};
