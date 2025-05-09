
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FileCode, Database } from "lucide-react";

const ApiSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Integrations</CardTitle>
        <CardDescription>
          Connect to billing systems and parsing tools for document data extraction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-md font-medium">Document Parsing Tools</h3>
          
          {/* Resume Parser */}
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
            <Button variant="outline">Configure</Button>
          </div>
          
          {/* Job Description Parser */}
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
            <Button variant="outline">Configure</Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-md font-medium">Billing Integrations</h3>
          
          {/* Stripe Integration */}
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
            <Button variant="outline">Connect</Button>
          </div>
          
          {/* QuickBooks Integration */}
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
            <Button variant="outline">Connect</Button>
          </div>
          
          {/* Xero Integration */}
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
            <Button variant="outline">Connect</Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-md font-medium">Database Connectors</h3>
          
          {/* Custom API Configuration */}
          <div className="space-y-2">
            <Label htmlFor="api-endpoint">Custom API Endpoint</Label>
            <Input id="api-endpoint" placeholder="https://api.example.com/v1/" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="flex gap-2">
              <Input id="api-key" placeholder="Enter your API key" type="password" className="flex-1" />
              <Button variant="outline">Validate</Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Your API key is securely encrypted and stored
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
              <Button className="flex items-center gap-2">
                <Database className="h-4 w-4" /> Configure Connection
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="webhook-notifications" />
              <Label htmlFor="webhook-notifications">Enable Webhook Notifications</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Send webhook notifications to third-party applications when important events occur
            </p>
          </div>
        </div>
        
        <Button
          onClick={() => {
            toast({
              title: "API settings saved",
              description: "Your API configuration has been updated",
            });
          }}
        >
          Save API Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default ApiSettings;
