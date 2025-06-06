import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ExternalLink, 
  Settings, 
  CheckCircle,
  AlertCircle,
  Users,
  BarChart3,
  Unlink,
  TestTube
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { linkedinOAuthService } from '@/services/linkedinOAuthService';
import { linkedinApiService } from '@/services/linkedinApiService';
import { linkedinCredentialsService } from '@/services/linkedinCredentialsService';
import { supabase } from '@/integrations/supabase/client';
import LinkedInEnrichmentDashboard from '@/components/people/linkedin/LinkedInEnrichmentDashboard';

interface LinkedInIntegrationProps {
  tenantId: string;
}

const LinkedInIntegration: React.FC<LinkedInIntegrationProps> = ({ tenantId }) => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isCredentialsConfigured, setIsCredentialsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionData, setConnectionData] = useState<any>(null);

  // Check if LinkedIn is already connected and credentials are configured
  useEffect(() => {
    checkIntegrationStatus();
  }, [tenantId]);

  const checkIntegrationStatus = async () => {
    setIsLoading(true);
    try {
      // Check if credentials are configured
      const credentialsConfigured = await linkedinCredentialsService.isConfigured(tenantId);
      setIsCredentialsConfigured(credentialsConfigured);

      // Check if OAuth connection is active
      const { data } = await supabase
        .from('tenant_social_media_connections')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('platform', 'linkedin')
        .eq('is_active', true)
        .maybeSingle();

      if (data) {
        setIsConnected(true);
        setConnectionData(data);
      }
    } catch (error) {
      console.error('Error checking integration status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!isCredentialsConfigured) {
      toast({
        title: "Credentials Required",
        description: "Please configure LinkedIn API credentials first",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      // Get authorization URL
      const authUrl = await linkedinOAuthService.getAuthUrl(tenantId);
      
      if (authUrl) {
        // Redirect to LinkedIn OAuth
        window.location.href = authUrl;
      } else {
        throw new Error('Failed to generate authorization URL');
      }
      
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to initiate LinkedIn connection. Please check your credentials.",
        variant: "destructive"
      });
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      const success = await linkedinApiService.disconnect(tenantId);
      if (success) {
        setIsConnected(false);
        setConnectionData(null);
        toast({
          title: "LinkedIn Disconnected",
          description: "LinkedIn integration has been disconnected successfully."
        });
      } else {
        throw new Error('Failed to disconnect');
      }
    } catch (error) {
      toast({
        title: "Disconnection Failed",
        description: "Failed to disconnect LinkedIn integration.",
        variant: "destructive"
      });
    }
  };

  const testConnection = async () => {
    try {
      const profile = await linkedinApiService.getUserProfile(tenantId);
      if (profile) {
        toast({
          title: "Connection Test Successful",
          description: `Connected as ${profile.firstName} ${profile.lastName}`
        });
      } else {
        throw new Error('Failed to get profile');
      }
    } catch (error) {
      toast({
        title: "Connection Test Failed",
        description: "Unable to verify LinkedIn connection. Please reconnect.",
        variant: "destructive"
      });
    }
  };

  const testCredentials = async () => {
    try {
      const isValid = await linkedinOAuthService.testCredentials(tenantId);
      if (isValid) {
        toast({
          title: "Credentials Valid",
          description: "LinkedIn API credentials are properly configured."
        });
      } else {
        toast({
          title: "Credentials Invalid",
          description: "LinkedIn API credentials appear to be invalid or missing.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Unable to test LinkedIn credentials.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading LinkedIn integration status...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="connection" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="connection">Connection Status</TabsTrigger>
          <TabsTrigger value="enrichment" disabled={!isConnected}>Data Enrichment</TabsTrigger>
          <TabsTrigger value="analytics" disabled={!isConnected}>Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="connection" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-sm">in</span>
                    </div>
                    LinkedIn Integration Status
                  </CardTitle>
                  <CardDescription>
                    Manage your LinkedIn OAuth connection and API access
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant={isCredentialsConfigured ? "default" : "secondary"}>
                    {isCredentialsConfigured ? "Credentials OK" : "Credentials Needed"}
                  </Badge>
                  <Badge variant={isConnected ? "default" : "secondary"}>
                    {isConnected ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Connected
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Not Connected
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isCredentialsConfigured && (
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-medium text-amber-900 mb-2">Credentials Required</h4>
                  <p className="text-sm text-amber-800 mb-3">
                    You need to configure LinkedIn API credentials before you can connect to LinkedIn.
                    Please use the Setup tab to configure your LinkedIn Developer App credentials.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-amber-300 text-amber-700"
                    onClick={() => window.open('https://developer.linkedin.com/apps', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    LinkedIn Developer Portal
                  </Button>
                </div>
              )}

              {isCredentialsConfigured && !isConnected && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Ready to Connect</h4>
                  <p className="text-sm text-blue-800 mb-3">
                    LinkedIn API credentials are configured. Click the button below to authorize the connection.
                  </p>
                  <Button 
                    onClick={handleConnect} 
                    disabled={isConnecting}
                    className="w-full"
                  >
                    {isConnecting ? "Connecting..." : "Connect to LinkedIn"}
                  </Button>
                </div>
              )}

              {isConnected && (
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-900 mb-2">Connection Active</h4>
                    <p className="text-sm text-green-800">
                      Your LinkedIn integration is active and ready for profile matching and data enrichment.
                    </p>
                    {connectionData && (
                      <div className="text-xs text-green-700 mt-2">
                        Connected on: {new Date(connectionData.connected_at || connectionData.created_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h5 className="font-medium mb-2">Available Features</h5>
                        <ul className="text-sm space-y-1">
                          <li>• Profile matching by email</li>
                          <li>• Bulk contact enrichment</li>
                          <li>• Automatic profile linking</li>
                          <li>• Real-time data sync</li>
                          <li>• Content posting capabilities</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h5 className="font-medium mb-2">API Permissions</h5>
                        <ul className="text-sm space-y-1">
                          <li>• r_liteprofile - Basic profile info</li>
                          <li>• r_emailaddress - Email addresses</li>
                          <li>• w_member_social - Post content</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {isCredentialsConfigured && (
                  <Button variant="outline" onClick={testCredentials} className="flex-1">
                    <TestTube className="w-4 h-4 mr-2" />
                    Test Credentials
                  </Button>
                )}
                {isConnected && (
                  <>
                    <Button variant="outline" onClick={testConnection} className="flex-1">
                      <Settings className="w-4 h-4 mr-2" />
                      Test Connection
                    </Button>
                    <Button variant="outline" onClick={handleDisconnect} className="flex-1">
                      <Unlink className="w-4 h-4 mr-2" />
                      Disconnect
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrichment" className="mt-6">
          <LinkedInEnrichmentDashboard />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                LinkedIn Integration Analytics
              </CardTitle>
              <CardDescription>
                Track the performance and usage of your LinkedIn integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-sm text-gray-600">Profiles Matched</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="w-8 h-8 mx-auto text-green-600 mb-2" />
                    <div className="text-2xl font-bold">0%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <BarChart3 className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-sm text-gray-600">API Calls Today</div>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Analytics data will appear here once you start using the LinkedIn integration features.
                </p>
                <Button variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Detailed Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LinkedInIntegration;
