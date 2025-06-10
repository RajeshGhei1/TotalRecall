
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'; // General application styles
import Companies from '@/pages/superadmin/Companies';
import CompanyDetailView from '@/components/superadmin/companies/CompanyDetailView';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Superadmin Routes */}
          <Route path="/superadmin/companies" element={<Companies />} />
          <Route path="/superadmin/companies/:companyId" element={<CompanyDetailView />} />
          
          {/* Default route redirects to companies for now */}
          <Route path="/" element={<Companies />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
