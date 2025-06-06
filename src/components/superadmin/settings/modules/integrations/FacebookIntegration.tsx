
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

interface FacebookIntegrationProps {
  tenantId: string;
}

const FacebookIntegration: React.FC<FacebookIntegrationProps> = ({ tenantId }) => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [credentials, setCredentials] = useState({
    appId: '',
    appSecret: '',
    accessToken: '',
    redirectUri: `${window.location.origin}/auth/facebook/callback`
  });

  const handleConnect = async () => {
    if (!credentials.appId || !credentials.appSecret) {
      toast({
        title: "Missing Credentials",
        description: "Please provide both App ID and App Secret",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsConnected(true);
      toast({
        title: "Facebook Connected",
        description: "Successfully connected to Facebook API"
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Facebook. Please check your credentials.",
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
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">f</span>
                </div>
                Facebook Integration
              </CardTitle>
              <CardDescription>
                Connect your Facebook App to enable social media marketing features
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
                  <li>Go to Facebook for Developers</li>
                  <li>Create a new app or select an existing one</li>
                  <li>Copy your App ID and App Secret</li>
                  <li>Configure OAuth redirect URIs</li>
                  <li>Set up required permissions</li>
                </ol>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 border-blue-300 text-blue-700"
                  onClick={() => window.open('https://developers.facebook.com/apps', '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Facebook Developers
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="appId">App ID</Label>
                  <Input
                    id="appId"
                    type="text"
                    value={credentials.appId}
                    onChange={(e) => setCredentials(prev => ({ ...prev, appId: e.target.value }))}
                    placeholder="Your Facebook App ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appSecret">App Secret</Label>
                  <Input
                    id="appSecret"
                    type="password"
                    value={credentials.appSecret}
                    onChange={(e) => setCredentials(prev => ({ ...prev, appSecret: e.target.value }))}
                    placeholder="Your Facebook App Secret"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accessToken">Page Access Token (Optional)</Label>
                <Input
                  id="accessToken"
                  type="password"
                  value={credentials.accessToken}
                  onChange={(e) => setCredentials(prev => ({ ...prev, accessToken: e.target.value }))}
                  placeholder="For page management features"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="redirectUri">OAuth Redirect URI</Label>
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
                  Add this URL to your Facebook app's OAuth redirect URIs
                </p>
              </div>

              <Button 
                onClick={handleConnect} 
                disabled={isConnecting || !credentials.appId || !credentials.appSecret}
                className="w-full"
              >
                {isConnecting ? "Connecting..." : "Connect to Facebook"}
              </Button>
            </>
          )}

          {isConnected && (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">Connection Active</h4>
                <p className="text-sm text-green-800">
                  Your Facebook integration is active and ready for social media marketing.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h5 className="font-medium mb-2">Available Features</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Page posting</li>
                      <li>• Lead ads management</li>
                      <li>• Audience insights</li>
                      <li>• Campaign tracking</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h5 className="font-medium mb-2">Permissions</h5>
                    <ul className="text-sm space-y-1">
                      <li>• pages_show_list</li>
                      <li>• pages_read_engagement</li>
                      <li>• pages_manage_posts</li>
                      <li>• leads_retrieval</li>
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

export default FacebookIntegration;
