
import React, { createContext, useContext, useState } from 'react';

interface TenantContextType {
  selectedTenantId: string | null;
  selectedTenantName: string | null;
  setSelectedTenantId: (tenantId: string | null) => void;
  setSelectedTenant: (tenantId: string, tenantName?: string) => void;
  clearSelectedTenant: () => void;
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
  const [selectedTenantName, setSelectedTenantName] = useState<string | null>(null);

  const setSelectedTenant = (tenantId: string, tenantName?: string) => {
    setSelectedTenantId(tenantId);
    setSelectedTenantName(tenantName || null);
  };

  const clearSelectedTenant = () => {
    setSelectedTenantId(null);
    setSelectedTenantName(null);
  };

  return (
    <TenantContext.Provider value={{ 
      selectedTenantId, 
      selectedTenantName,
      setSelectedTenantId, 
      setSelectedTenant,
      clearSelectedTenant
    }}>
      {children}
    </TenantContext.Provider>
  );
};
