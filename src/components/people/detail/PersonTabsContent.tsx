
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from 'lucide-react';
import JobHistoryList from '../JobHistoryList';
import { Person } from '@/types/person';
import TalentSkillsManager from '../skills/TalentSkillsManager';

interface PersonTabsContentProps {
  person: Person;
  employmentHistory: any[];
  loadingHistory: boolean;
  onAddCompany: () => void;
}

const PersonTabsContent: React.FC<PersonTabsContentProps> = ({ 
  person, 
  employmentHistory, 
  loadingHistory,
  onAddCompany
}) => {
  const [activeTab, setActiveTab] = useState('info');

  return (
    <Card className="md:col-span-2">
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
              
              <div className="rounded-md bg-muted p-4 text-center">
                <p>No additional information available.</p>
              </div>
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
