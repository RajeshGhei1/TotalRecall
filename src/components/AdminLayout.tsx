
import React, { useState } from 'react';
import { Sidebar } from './layout/Sidebar';
import { MobileNavigation } from './layout/MobileNavigation';
import TopHeader from './layout/TopHeader';
import { WeakPasswordNotification } from './layout/WeakPasswordNotification';

interface AdminLayoutProps {
  children: React.ReactNode;
  navigation?: any[];
}

const AdminLayout = ({ children, navigation = [] }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar navigation={navigation} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        <WeakPasswordNotification />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
