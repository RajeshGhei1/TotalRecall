
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  RefreshCw, 
  CheckCircle,
  AlertCircle,
  BarChart3,
  Play,
  History,
  Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTenantContext } from '@/contexts/TenantContext';
import BulkEnrichmentManager from './BulkEnrichmentManager';
import EnrichmentHistoryView from './EnrichmentHistoryView';
import EnrichmentStatsCards from './EnrichmentStatsCards';

const ContactEnrichmentDashboard: React.FC = () => {
  const { toast } = useToast();
  const { selectedTenantId } = useTenantContext();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Contact Data Enrichment</h2>
          <p className="text-gray-600 mt-1">
            Enhance your contact database with LinkedIn profile information
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">in</span>
          </div>
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            LinkedIn Integration Active
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Bulk Enrichment
          </TabsTrigger>
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Individual
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <EnrichmentStatsCards />
        </TabsContent>

        <TabsContent value="bulk" className="mt-6">
          <BulkEnrichmentManager />
        </TabsContent>

        <TabsContent value="individual" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Individual Contact Enrichment</CardTitle>
              <CardDescription>
                Enrich individual contacts from the People module by visiting their detail pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">
                  Go to the People or Contacts section to enrich individual profiles
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => window.location.href = '/tenant-admin/contacts'}>
                    View Contacts
                  </Button>
                  <Button variant="outline" onClick={() => window.location.href = '/tenant-admin/talent'}>
                    View Talent
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <EnrichmentHistoryView />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactEnrichmentDashboard;
