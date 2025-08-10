
import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { TabsContent } from '@/components/ui/tabs';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import SetupWizard from '@/components/superadmin/settings/SetupWizard';

// Import new refactored components
import SettingsHeader from '@/components/superadmin/settings/layout/SettingsHeader';
import SettingsTabs from '@/components/superadmin/settings/layout/SettingsTabs';
import ModulesTabContent from '@/components/superadmin/settings/tabs/ModulesTabContent';
import CustomFieldsTabContent from '@/components/superadmin/settings/tabs/CustomFieldsTabContent';
import IntegrationsTabContent from '@/components/superadmin/settings/tabs/IntegrationsTabContent';

const Settings = () => {
  const location = useLocation();
  console.log("🚀 SETTINGS PAGE - LOADING");
  console.log("🚀 SETTINGS PAGE - Current location:", location.pathname + location.search);
  console.log("🚀 SETTINGS PAGE - Full URL:", window.location.href);
  
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [searchParams] = useSearchParams();
  
  // Initialize active tab from URL parameter immediately
  const getInitialTab = () => {
    const tab = searchParams.get('tab');
    console.log('🚀 SETTINGS PAGE - URL tab parameter:', tab);
    const initialTab = tab === 'custom-fields' ? 'custom-fields' : 'modules';
    console.log('🚀 SETTINGS PAGE - Initial tab determined:', initialTab);
    return initialTab;
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab);
  
  // Update active tab when URL changes
  useEffect(() => {
    console.log('🚀 SETTINGS PAGE - useEffect triggered');
    const tab = searchParams.get('tab');
    console.log('🚀 SETTINGS PAGE - URL parameter in useEffect:', tab);
    if (tab === 'custom-fields') {
      console.log('🚀 SETTINGS PAGE - Switching to custom-fields tab');
      setActiveTab('custom-fields');
    } else {
      console.log('🚀 SETTINGS PAGE - Switching to modules tab (default)');
      setActiveTab('modules');
    }
  }, [searchParams]);
  
  console.log('🚀 SETTINGS PAGE - Current active tab state:', activeTab);
  console.log('🚀 SETTINGS PAGE - About to render with activeTab:', activeTab);
  
  return (
    <ErrorBoundary>
      <AdminLayout>
        <div className="p-6">
          <div style={{ padding: '20px', background: 'lightgreen', marginBottom: '20px' }}>
            <h1>🚀 SETTINGS PAGE LOADED SUCCESSFULLY!</h1>
            <p>Current tab: <strong>{activeTab}</strong></p>
            <p>URL: {window.location.href}</p>
          </div>
          
          <SettingsHeader />
          
          <ErrorBoundary>
            <SetupWizard 
              open={showSetupWizard} 
              onOpenChange={setShowSetupWizard} 
            />
          </ErrorBoundary>
          
          <SettingsTabs 
            value={activeTab} 
            onValueChange={(newTab) => {
              console.log('🚀 SETTINGS PAGE - Tab changed to:', newTab);
              setActiveTab(newTab);
            }}
          >
            <ErrorBoundary>
              <TabsContent value="modules" className="mt-6">
                <div style={{ padding: '10px', background: 'lightblue' }}>
                  <h3>📦 MODULES TAB CONTENT</h3>
                </div>
                <ModulesTabContent />
              </TabsContent>
            </ErrorBoundary>
            
            <ErrorBoundary>
              <TabsContent value="custom-fields" className="mt-6">
                <div style={{ padding: '10px', background: 'lightcoral' }}>
                  <h3>🎯 CUSTOM FIELDS TAB CONTENT</h3>
                </div>
                <CustomFieldsTabContent />
              </TabsContent>
            </ErrorBoundary>
            
            <ErrorBoundary>
              <TabsContent value="integrations" className="mt-6">
                <div style={{ padding: '10px', background: 'lightyellow' }}>
                  <h3>🔗 INTEGRATIONS TAB CONTENT</h3>
                </div>
                <IntegrationsTabContent />
              </TabsContent>
            </ErrorBoundary>
          </SettingsTabs>
        </div>
      </AdminLayout>
    </ErrorBoundary>
  );
};

export default Settings;
