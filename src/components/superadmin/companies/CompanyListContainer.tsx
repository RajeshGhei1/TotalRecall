
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useCompanies } from '@/hooks/useCompanies';

import CompanySearch from './CompanySearch';
import CompanyTable from './CompanyTable';
import CompanyDeleteDialog from './CompanyDeleteDialog';

const CompanyListContainer: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [companyToDelete, setCompanyToDelete] = useState(null);
  
  const { companies, isLoading } = useCompanies();
  
  // Filter companies based on search term
  const filteredCompanies = companies?.filter(company => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      company.name?.toLowerCase().includes(searchLower) ||
      company.industry?.toLowerCase().includes(searchLower) ||
      company.location?.toLowerCase().includes(searchLower)
    );
  }) || [];

  const handleAddCompany = () => {
    navigate('/superadmin/companies/add');
  };

  const handleEdit = (companyId: string) => {
    navigate(`/superadmin/companies/edit/${companyId}`);
  };

  const handleViewDetails = (companyId: string) => {
    navigate(`/superadmin/companies/view/${companyId}`);
  };

  const handleDelete = (company) => {
    setCompanyToDelete(company);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <CompanySearch 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddCompany={handleAddCompany}
      />
      
      <CompanyTable 
        companies={filteredCompanies}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewDetails={handleViewDetails}
      />
      
      <CompanyDeleteDialog
        company={companyToDelete}
        onClose={() => setCompanyToDelete(null)}
        onConfirm={() => setCompanyToDelete(null)}
      />
    </>
  );
};

export default CompanyListContainer;
