
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ExternalLink, 
  Settings, 
  CheckCircle,
  AlertCircle,
  Copy,
  Users,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LinkedInEnrichmentDashboard from '@/components/people/linkedin/LinkedInEnrichmentDashboard';

interface LinkedInIntegrationProps {
  tenantId: string;
}

const LinkedInIntegration: React.FC<LinkedInIntegrationProps> = ({ tenantId }) => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [credentials, setCredentials] = useState({
    clientId: '',
    clientSecret: '',
    redirectUri: `${window.location.origin}/auth/linkedin/callback`
  });

  const handleConnect = async () => {
    if (!credentials.clientId || !credentials.clientSecret) {
      toast({
        title: "Missing Credentials",
        description: "Please provide both Client ID and Client Secret",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      // Simulate API call to save credentials and establish connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsConnected(true);
      toast({
        title: "LinkedIn Connected",
        description: "Successfully connected to LinkedIn API"
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to LinkedIn. Please check your credentials.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Redirect URI copied to clipboard"
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="setup">Setup & Connection</TabsTrigger>
          <TabsTrigger value="enrichment" disabled={!isConnected}>Data Enrichment</TabsTrigger>
          <TabsTrigger value="analytics" disabled={!isConnected}>Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-sm">in</span>
                    </div>
                    LinkedIn Integration Setup
                  </CardTitle>
                  <CardDescription>
                    Connect your LinkedIn Developer App to enable profile matching and data enrichment
                  </CardDescription>
                </div>
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
            </CardHeader>
            <CardContent className="space-y-4">
              {!isConnected && (
                <>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Setup Instructions</h4>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                      <li>Go to the LinkedIn Developer Portal</li>
                      <li>Create a new app or select an existing one</li>
                      <li>Copy your Client ID and Client Secret</li>
                      <li>Add the redirect URI to your app settings</li>
                      <li>Request the following permissions: r_liteprofile, r_emailaddress, w_member_social</li>
                    </ol>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3 border-blue-300 text-blue-700"
                      onClick={() => window.open('https://developer.linkedin.com/apps', '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open LinkedIn Developer Portal
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clientId">Client ID</Label>
                      <Input
                        id="clientId"
                        type="text"
                        value={credentials.clientId}
                        onChange={(e) => setCredentials(prev => ({ ...prev, clientId: e.target.value }))}
                        placeholder="Your LinkedIn App Client ID"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientSecret">Client Secret</Label>
                      <Input
                        id="clientSecret"
                        type="password"
                        value={credentials.clientSecret}
                        onChange={(e) => setCredentials(prev => ({ ...prev, clientSecret: e.target.value }))}
                        placeholder="Your LinkedIn App Client Secret"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="redirectUri">Redirect URI</Label>
                    <div className="flex gap-2">
                      <Input
                        id="redirectUri"
                        type="text"
                        value={credentials.redirectUri}
                        readOnly
                        className="bg-gray-50"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyToClipboard(credentials.redirectUri)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-600">
                      Add this URL to your LinkedIn app's authorized redirect URIs
                    </p>
                  </div>

                  <Button 
                    onClick={handleConnect} 
                    disabled={isConnecting || !credentials.clientId || !credentials.clientSecret}
                    className="w-full"
                  >
                    {isConnecting ? "Connecting..." : "Connect to LinkedIn"}
                  </Button>
                </>
              )}

              {isConnected && (
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-900 mb-2">Connection Active</h4>
                    <p className="text-sm text-green-800">
                      Your LinkedIn integration is active and ready for profile matching and data enrichment.
                    </p>
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
                          <li>• Company page management</li>
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
                          <li>• r_organization_social - Company data</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <Button variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Test Connection
                  </Button>
                </div>
              )}
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
