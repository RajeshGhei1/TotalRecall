
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  CheckCircle,
  AlertCircle,
  Copy,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface LinkedInCredentialsSetupProps {
  tenantId: string;
  onCredentialsConfigured?: () => void;
}

export const LinkedInCredentialsSetup: React.FC<LinkedInCredentialsSetupProps> = ({
  tenantId,
  onCredentialsConfigured
}) => {
  const { toast } = useToast();
  const [credentials, setCredentials] = useState({
    clientId: '',
    clientSecret: ''
  });
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const redirectUri = `${window.location.origin}/auth`;

  useEffect(() => {
    checkExistingConfiguration();
  }, [tenantId]);

  const checkExistingConfiguration = async () => {
    setIsLoading(true);
    try {
      // Check if LinkedIn connection already exists
      const { data } = await supabase
        .from('tenant_social_media_connections')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('platform', 'linkedin')
        .eq('is_active', true)
        .maybeSingle();

      setIsConfigured(!!data);
    } catch (error) {
      console.error('Error checking LinkedIn configuration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!credentials.clientId || !credentials.clientSecret) {
      toast({
        title: "Missing Credentials",
        description: "Please provide both Client ID and Client Secret",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      // Store credentials in Supabase secrets or tenant settings
      // For now, we'll store them in the connection_config
      const { error } = await supabase
        .from('tenant_social_media_connections')
        .upsert({
          tenant_id: tenantId,
          platform: 'linkedin',
          is_active: false, // Will be activated after OAuth
          connection_config: {
            client_id: credentials.clientId,
            client_secret: credentials.clientSecret,
            redirect_uri: redirectUri,
            scope: ['r_liteprofile', 'r_emailaddress', 'w_member_social']
          }
        });

      if (error) throw error;

      setIsConfigured(true);
      onCredentialsConfigured?.();
      
      toast({
        title: "Credentials Saved",
        description: "LinkedIn API credentials have been configured successfully."
      });
    } catch (error) {
      console.error('Error saving credentials:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save LinkedIn credentials. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Redirect URI copied to clipboard"
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Checking LinkedIn configuration...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">in</span>
              </div>
              LinkedIn API Configuration
            </CardTitle>
            <CardDescription>
              Configure your LinkedIn Developer App credentials
            </CardDescription>
          </div>
          <Badge variant={isConfigured ? "default" : "secondary"}>
            {isConfigured ? (
              <>
                <CheckCircle className="w-4 h-4 mr-1" />
                Configured
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 mr-1" />
                Not Configured
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isConfigured && (
          <>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You need to create a LinkedIn Developer App and configure the credentials below.
              </AlertDescription>
            </Alert>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Setup Instructions</h4>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Go to the LinkedIn Developer Portal</li>
                <li>Create a new app or select an existing one</li>
                <li>Copy your Client ID and Client Secret</li>
                <li>Add the redirect URI below to your app settings</li>
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

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="redirectUri">Redirect URI</Label>
                <div className="flex gap-2">
                  <Input
                    id="redirectUri"
                    type="text"
                    value={redirectUri}
                    readOnly
                    className="bg-gray-50"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(redirectUri)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-600">
                  Add this URL to your LinkedIn app's authorized redirect URIs
                </p>
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

              <Button 
                onClick={handleSave} 
                disabled={isSaving || !credentials.clientId || !credentials.clientSecret}
                className="w-full"
              >
                {isSaving ? "Saving..." : "Save Credentials"}
              </Button>
            </div>
          </>
        )}

        {isConfigured && (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">Configuration Complete</h4>
              <p className="text-sm text-green-800">
                Your LinkedIn API credentials are configured and ready for OAuth authentication.
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Settings className="w-4 h-4 mr-2" />
                Update Credentials
              </Button>
              <Button variant="outline" className="flex-1">
                Test Connection
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LinkedInCredentialsSetup;
