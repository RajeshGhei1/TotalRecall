
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from 'lucide-react';
import JobHistoryList, { JobHistoryItem } from '../JobHistoryList';
import { Person } from '@/types/person';
import TalentSkillsManager from '../skills/TalentSkillsManager';
import { CustomFieldsForm } from '@/components/customFields';
import ReportingRelationships from './ReportingRelationships';

interface PersonTabsContentProps {
  person: Person;
  employmentHistory: JobHistoryItem[];
  loadingHistory?: boolean;
  onAddCompany?: () => void;
}

const PersonTabsContent: React.FC<PersonTabsContentProps> = ({ 
  person, 
  employmentHistory, 
  loadingHistory = false,
  onAddCompany = () => {}
}) => {
  const [activeTab, setActiveTab] = useState('info');
  
  // Find current company relationship if it exists
  const currentCompanyRelationship = employmentHistory?.find(job => job.is_current);
  const currentCompanyId = currentCompanyRelationship?.company?.id;

  return (
    <Card>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="info"
            className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
          >
            Additional Info
          </TabsTrigger>
          <TabsTrigger
            value="companies"
            className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
          >
            Companies
          </TabsTrigger>
          <TabsTrigger
            value="reporting"
            className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
          >
            Reporting
          </TabsTrigger>
          {person?.type === 'talent' && (
            <TabsTrigger
              value="skills"
              className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
            >
              Skills
            </TabsTrigger>
          )}
        </TabsList>

        <CardContent className="p-6">
          <TabsContent value="info" className="mt-0">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                {person?.type === 'talent'
                  ? 'Additional information about this talent.'
                  : 'Additional information about this business contact.'}
              </p>
              
              {person?.id && (
                <CustomFieldsForm
                  entityType={person.type === 'talent' ? 'talent_form' : 'contact_form'}
                  entityId={person.id}
                  formContext={person.type === 'talent' ? 'talent_form' : 'contact_form'}
                />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="companies" className="mt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Company History</h3>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="gap-1"
                  onClick={onAddCompany}
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Company</span>
                </Button>
              </div>
              
              {loadingHistory ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : employmentHistory && employmentHistory.length > 0 ? (
                <JobHistoryList history={employmentHistory} showAllHistory={true} />
              ) : (
                <div className="rounded-md bg-muted p-4 text-center">
                  <p>No company associations found.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="reporting" className="mt-0">
            <div className="space-y-4">
              {person?.id ? (
                <ReportingRelationships 
                  personId={person.id}
                  companyId={currentCompanyId}
                />
              ) : (
                <div className="rounded-md bg-muted p-4 text-center">
                  <p>Loading reporting relationships...</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {person?.type === 'talent' && (
            <TabsContent value="skills" className="mt-0">
              {person?.id && <TalentSkillsManager personId={person.id} />}
            </TabsContent>
          )}
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default PersonTabsContent;
