
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  Settings, 
  CheckCircle,
  AlertCircle,
  Copy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">in</span>
                </div>
                LinkedIn Integration
              </CardTitle>
              <CardDescription>
                Connect your LinkedIn Developer App to enable social media features
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
                  <li>Configure the required permissions</li>
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
                  Your LinkedIn integration is active and ready to use for social media features.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h5 className="font-medium mb-2">Available Features</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Profile data synchronization</li>
                      <li>• Company page management</li>
                      <li>• Content posting</li>
                      <li>• Analytics tracking</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h5 className="font-medium mb-2">Permissions</h5>
                    <ul className="text-sm space-y-1">
                      <li>• r_liteprofile</li>
                      <li>• r_emailaddress</li>
                      <li>• w_member_social</li>
                      <li>• r_organization_social</li>
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
    </div>
  );
};

export default LinkedInIntegration;
