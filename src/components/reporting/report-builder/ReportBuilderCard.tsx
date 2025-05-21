
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReportCreationTab from './creation/ReportCreationTab';
import SavedReportsTab from './saved/SavedReportsTab';
import { SavedReport } from '@/services/reportingService';

const ReportBuilderCard: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('create');
  const [savedReports, setSavedReports] = React.useState<SavedReport[]>([]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Report Builder</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="create">Create Report</TabsTrigger>
            <TabsTrigger value="saved">Saved Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create">
            <ReportCreationTab 
              savedReports={savedReports}
              onSaveReport={(report: SavedReport) => {
                setSavedReports([report, ...savedReports]);
              }}
            />
          </TabsContent>
          
          <TabsContent value="saved">
            <SavedReportsTab 
              savedReports={savedReports}
              setSavedReports={setSavedReports}
              onLoadReport={(report: SavedReport) => {
                setActiveTab('create');
              }}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ReportBuilderCard;
