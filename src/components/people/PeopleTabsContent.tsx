
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TalentMetricsDashboard from '@/components/talent/TalentMetricsDashboard';
import ContactMetricsDashboard from '@/components/contacts/ContactMetricsDashboard';
import PeopleList from './PeopleList';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from "@/components/ui/scroll-area";

interface PeopleTabsContentProps {
  personType: 'talent' | 'contact';
  activeTab: string;
  setActiveTab: (value: string) => void;
  onLinkToCompany: (id: string) => void;
}

const PeopleTabsContent = ({ personType, activeTab, setActiveTab, onLinkToCompany }: PeopleTabsContentProps) => {
  const isMobile = useIsMobile();
  
  if (personType === 'talent') {
    return (
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <ScrollArea className="w-full">
          <TabsList className="mb-4 w-full md:w-auto inline-flex">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="all">All Talents</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
            <TabsTrigger value="new">New Applications</TabsTrigger>
          </TabsList>
        </ScrollArea>
        
        <TabsContent value="dashboard">
          <TalentMetricsDashboard />
        </TabsContent>
        
        <TabsContent value="all">
          <Card>
            <CardHeader className={isMobile ? "px-3 py-4" : ""}>
              <CardTitle>All Talents</CardTitle>
              <CardDescription>View and manage all talents registered in the platform</CardDescription>
            </CardHeader>
            <CardContent className={isMobile ? "px-3 py-4" : ""}>
              <PeopleList 
                personType="talent" 
                onLinkToCompany={onLinkToCompany} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="active">
          <Card>
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
          <Card>
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
          <Card>
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
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <ScrollArea className="w-full">
          <TabsList className="mb-4 w-full md:w-auto inline-flex">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="all">All Contacts</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="prospects">Prospects</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
          </TabsList>
        </ScrollArea>
        
        <TabsContent value="dashboard">
          <ContactMetricsDashboard />
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader className={isMobile ? "px-3 py-4" : ""}>
              <CardTitle>All Business Contacts</CardTitle>
              <CardDescription>View and manage all business contacts</CardDescription>
            </CardHeader>
            <CardContent className={isMobile ? "px-3 py-4" : ""}>
              <PeopleList 
                personType="contact" 
                onLinkToCompany={onLinkToCompany} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clients">
          <Card>
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
          <Card>
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
          <Card>
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
