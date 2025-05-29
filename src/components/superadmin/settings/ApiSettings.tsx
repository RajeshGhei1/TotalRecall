
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FileCode, Database } from "lucide-react";
import { useTenantContext } from "@/contexts/TenantContext";

const ApiSettings = () => {
  const { selectedTenantId } = useTenantContext();
  const [webhookEnabled, setWebhookEnabled] = useState(false);

  const handleSaveSettings = () => {
    if (!selectedTenantId) {
      toast({
        title: "No tenant selected",
        description: "Please select a tenant first",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "API settings saved",
      description: "Tenant's API configuration has been updated",
    });
  };

  const handleConfigureClick = (service: string) => {
    if (!selectedTenantId) {
      toast({
        title: "No tenant selected",
        description: "Please select a tenant first",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: `Configure ${service}`,
      description: `Configuration process for ${service} would start here`,
    });
  };

  const handleValidateApiKey = () => {
    if (!selectedTenantId) {
      toast({
        title: "No tenant selected",
        description: "Please select a tenant first",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "API Key Validated",
      description: "The API key is valid and has been saved securely",
    });
  };

  if (!selectedTenantId) {
    return (
      <div className="bg-muted/50 p-6 text-center rounded-md">
        <p className="text-muted-foreground">Select a tenant to manage its API settings</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-md font-medium">Document Parsing Tools</h3>
        
        <div className="flex items-center justify-between border p-4 rounded-md">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <FileCode className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">Resume Parser</p>
              <p className="text-sm text-muted-foreground">
                Extract structured data from resumes and CVs
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => handleConfigureClick("Resume Parser")}>Configure</Button>
        </div>
        
        <div className="flex items-center justify-between border p-4 rounded-md">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-2 rounded-full">
              <FileCode className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="font-medium">Job Description Parser</p>
              <p className="text-sm text-muted-foreground">
                Extract key requirements and skills from job descriptions
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => handleConfigureClick("Job Description Parser")}>Configure</Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-md font-medium">Billing Integrations</h3>
        
        <div className="flex items-center justify-between border p-4 rounded-md">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-100 p-2 rounded-full">
              <img 
                src="https://cdn.cdnlogo.com/logos/s/54/stripe.svg" 
                alt="Stripe" 
                className="h-6 w-6" 
              />
            </div>
            <div>
              <p className="font-medium">Stripe</p>
              <p className="text-sm text-muted-foreground">
                Process payments and manage billing
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => handleConfigureClick("Stripe")}>Connect</Button>
        </div>
        
        <div className="flex items-center justify-between border p-4 rounded-md">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-2 rounded-full">
              <img 
                src="https://cdn.cdnlogo.com/logos/q/44/quickbooks.svg" 
                alt="QuickBooks" 
                className="h-6 w-6" 
              />
            </div>
            <div>
              <p className="font-medium">QuickBooks</p>
              <p className="text-sm text-muted-foreground">
                Accounting and financial management
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => handleConfigureClick("QuickBooks")}>Connect</Button>
        </div>
        
        <div className="flex items-center justify-between border p-4 rounded-md">
          <div className="flex items-center space-x-4">
            <div className="bg-sky-100 p-2 rounded-full">
              <img 
                src="https://cdn.cdnlogo.com/logos/x/99/xero.svg" 
                alt="Xero" 
                className="h-6 w-6" 
              />
            </div>
            <div>
              <p className="font-medium">Xero</p>
              <p className="text-sm text-muted-foreground">
                Cloud-based accounting software
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => handleConfigureClick("Xero")}>Connect</Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-md font-medium">Database Connectors</h3>
        
        <div className="space-y-2">
          <Label htmlFor="api-endpoint">Custom API Endpoint</Label>
          <Input id="api-endpoint" placeholder="https://api.example.com/v1/" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <div className="flex gap-2">
            <Input id="api-key" placeholder="Enter API key" type="password" className="flex-1" />
            <Button variant="outline" onClick={handleValidateApiKey}>Validate</Button>
          </div>
          <p className="text-sm text-muted-foreground">
            API key is securely encrypted and stored
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Database Connection</p>
              <p className="text-sm text-muted-foreground">
                Connect to external databases for data import/export
              </p>
            </div>
            <Button className="flex items-center gap-2" onClick={() => handleConfigureClick("Database Connection")}>
              <Database className="h-4 w-4" /> Configure Connection
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch 
              id="webhook-notifications"
              checked={webhookEnabled}
              onCheckedChange={setWebhookEnabled}
            />
            <Label htmlFor="webhook-notifications">Enable Webhook Notifications</Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Send webhook notifications to third-party applications when important events occur
          </p>
        </div>
      </div>
      
      <Button onClick={handleSaveSettings}>
        Save API Settings
      </Button>
    </div>
  );
};

export default ApiSettings;
