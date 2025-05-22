
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TalentMetricsDashboard from '@/components/talent/TalentMetricsDashboard';
import ContactMetricsDashboard from '@/components/contacts/ContactMetricsDashboard';
import PeopleList from './PeopleList';
import ReportingTabContent from './tabs/ReportingTabContent';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from "@/components/ui/scroll-area";

interface PeopleTabsContentProps {
  personType: 'talent' | 'contact';
  activeTab: string;
  setActiveTab: (value: string) => void;
  onLinkToCompany: (id: string) => void;
  searchQuery?: string;
  companyFilter?: string;
}

const PeopleTabsContent: React.FC<PeopleTabsContentProps> = ({ 
  personType, 
  activeTab, 
  setActiveTab, 
  onLinkToCompany,
  searchQuery,
  companyFilter
}: PeopleTabsContentProps) => {
  const isMobile = useIsMobile();
  const showReportingTabs = companyFilter && companyFilter !== 'all';
  
  if (personType === 'talent') {
    return (
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <ScrollArea className="w-full">
          <TabsList className="mb-4 w-full md:w-auto inline-flex">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="all">All Talents</TabsTrigger>
            {showReportingTabs && (
              <>
                <TabsTrigger value="reports-to">Reports To</TabsTrigger>
                <TabsTrigger value="direct-reports">Direct Reports</TabsTrigger>
              </>
            )}
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
            <TabsTrigger value="new">New Applications</TabsTrigger>
          </TabsList>
        </ScrollArea>
        
        <TabsContent value="dashboard">
          <TalentMetricsDashboard />
        </TabsContent>
        
        <TabsContent value="all">
          <Card className="card-gradient">
            <CardHeader className={isMobile ? "px-3 py-4" : ""}>
              <CardTitle>All Talents</CardTitle>
              <CardDescription>View and manage all talents registered in the platform</CardDescription>
            </CardHeader>
            <CardContent className={isMobile ? "px-3 py-4" : ""}>
              <PeopleList 
                personType="talent" 
                onLinkToCompany={onLinkToCompany} 
                searchQuery={searchQuery}
                companyFilter={companyFilter}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {showReportingTabs && (
          <>
            <TabsContent value="reports-to">
              <Card className="card-gradient">
                <CardHeader className={isMobile ? "px-3 py-4" : ""}>
                  <CardTitle>Manager Relationships</CardTitle>
                  <CardDescription>View talents with management responsibilities at this company</CardDescription>
                </CardHeader>
                <CardContent className={isMobile ? "px-3 py-4" : ""}>
                  <ReportingTabContent 
                    companyId={companyFilter} 
                    reportingType="manager"
                    searchQuery={searchQuery}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="direct-reports">
              <Card className="card-gradient">
                <CardHeader className={isMobile ? "px-3 py-4" : ""}>
                  <CardTitle>Reporting Relationships</CardTitle>
                  <CardDescription>View talents who report to managers at this company</CardDescription>
                </CardHeader>
                <CardContent className={isMobile ? "px-3 py-4" : ""}>
                  <ReportingTabContent 
                    companyId={companyFilter} 
                    reportingType="direct-report"
                    searchQuery={searchQuery}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
        
        <TabsContent value="active">
          <Card className="card-gradient">
            <CardHeader className={isMobile ? "px-3 py-4" : ""}>
              <CardTitle>Active Talents</CardTitle>
              <CardDescription>View and manage currently active talents</CardDescription>
            </CardHeader>
            <CardContent className={isMobile ? "px-3 py-4" : ""}>
              <div className="text-center py-8 text-muted-foreground">
                <p>No active talents found.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inactive">
          <Card className="card-gradient">
            <CardHeader className={isMobile ? "px-3 py-4" : ""}>
              <CardTitle>Inactive Talents</CardTitle>
              <CardDescription>View and manage inactive talents</CardDescription>
            </CardHeader>
            <CardContent className={isMobile ? "px-3 py-4" : ""}>
              <div className="text-center py-8 text-muted-foreground">
                <p>No inactive talents found.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="new">
          <Card className="card-gradient">
            <CardHeader className={isMobile ? "px-3 py-4" : ""}>
              <CardTitle>New Applications</CardTitle>
              <CardDescription>View and process new talent applications</CardDescription>
            </CardHeader>
            <CardContent className={isMobile ? "px-3 py-4" : ""}>
              <div className="text-center py-8 text-muted-foreground">
                <p>No new applications found.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  } else {
    return (
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <ScrollArea className="w-full">
          <TabsList className="mb-4 w-full md:w-auto inline-flex">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="all">All Contacts</TabsTrigger>
            {showReportingTabs && (
              <>
                <TabsTrigger value="reports-to">Reports To</TabsTrigger>
                <TabsTrigger value="direct-reports">Direct Reports</TabsTrigger>
              </>
            )}
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="prospects">Prospects</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
          </TabsList>
        </ScrollArea>
        
        <TabsContent value="dashboard">
          <ContactMetricsDashboard />
        </TabsContent>

        <TabsContent value="all">
          <Card className="card-gradient">
            <CardHeader className={isMobile ? "px-3 py-4" : ""}>
              <CardTitle>All Business Contacts</CardTitle>
              <CardDescription>View and manage all business contacts</CardDescription>
            </CardHeader>
            <CardContent className={isMobile ? "px-3 py-4" : ""}>
              <PeopleList 
                personType="contact" 
                onLinkToCompany={onLinkToCompany}
                searchQuery={searchQuery}
                companyFilter={companyFilter}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {showReportingTabs && (
          <>
            <TabsContent value="reports-to">
              <Card className="card-gradient">
                <CardHeader className={isMobile ? "px-3 py-4" : ""}>
                  <CardTitle>Manager Relationships</CardTitle>
                  <CardDescription>View contacts with management responsibilities at this company</CardDescription>
                </CardHeader>
                <CardContent className={isMobile ? "px-3 py-4" : ""}>
                  <ReportingTabContent 
                    companyId={companyFilter} 
                    reportingType="manager"
                    searchQuery={searchQuery}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="direct-reports">
              <Card className="card-gradient">
                <CardHeader className={isMobile ? "px-3 py-4" : ""}>
                  <CardTitle>Reporting Relationships</CardTitle>
                  <CardDescription>View contacts who report to managers at this company</CardDescription>
                </CardHeader>
                <CardContent className={isMobile ? "px-3 py-4" : ""}>
                  <ReportingTabContent 
                    companyId={companyFilter} 
                    reportingType="direct-report"
                    searchQuery={searchQuery}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
        
        <TabsContent value="clients">
          <Card className="card-gradient">
            <CardHeader className={isMobile ? "px-3 py-4" : ""}>
              <CardTitle>Client Contacts</CardTitle>
              <CardDescription>View and manage client contacts</CardDescription>
            </CardHeader>
            <CardContent className={isMobile ? "px-3 py-4" : ""}>
              <div className="text-center py-8 text-muted-foreground">
                <p>No client contacts found.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="prospects">
          <Card className="card-gradient">
            <CardHeader className={isMobile ? "px-3 py-4" : ""}>
              <CardTitle>Prospect Contacts</CardTitle>
              <CardDescription>View and manage prospect contacts</CardDescription>
            </CardHeader>
            <CardContent className={isMobile ? "px-3 py-4" : ""}>
              <div className="text-center py-8 text-muted-foreground">
                <p>No prospect contacts found.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="vendors">
          <Card className="card-gradient">
            <CardHeader className={isMobile ? "px-3 py-4" : ""}>
              <CardTitle>Vendor Contacts</CardTitle>
              <CardDescription>View and manage vendor contacts</CardDescription>
            </CardHeader>
            <CardContent className={isMobile ? "px-3 py-4" : ""}>
              <div className="text-center py-8 text-muted-foreground">
                <p>No vendor contacts found.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  }
};

export default PeopleTabsContent;
