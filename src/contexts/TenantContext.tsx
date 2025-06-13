
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TenantContextType {
  selectedTenantId: string | null;
  selectedTenantName: string | null;
  setSelectedTenantId: (tenantId: string | null) => void;
  setSelectedTenant: (tenantId: string | null, tenantName?: string) => void;
  clearSelectedTenant: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [selectedTenantName, setSelectedTenantName] = useState<string | null>(null);

  const setSelectedTenant = (tenantId: string | null, tenantName?: string) => {
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

export const useTenantContext = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenantContext must be used within a TenantProvider');
  }
  return context;
};
