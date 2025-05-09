import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  PenSquare, 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail, 
  MessageSquare, 
  Share, 
  CheckCircle,
  ArrowRight,
  Phone,
  Video,
  FileCode,
  Database
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const TenantAdminSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Fetch tenant information for the current user
  const { data: tenantData, isLoading: tenantLoading } = useQuery({
    queryKey: ['currentTenantData'],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_tenants')
        .select(`
          tenant_id,
          tenants:tenant_id (
            id,
            name,
            description
          )
        `)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowSetupWizard(false);
      toast({
        title: "Setup Complete!",
        description: "Your tenant has been configured successfully.",
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-between items-center mb-8">
        {[...Array(totalSteps)].map((_, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index + 1 === currentStep 
                    ? "bg-jobmojo-primary text-white"
                    : index + 1 < currentStep
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {index + 1 < currentStep ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  index + 1
                )}
              </div>
              <span className="text-xs mt-1">
                {index === 0 ? "Basics" : 
                 index === 1 ? "Social" : 
                 index === 2 ? "Communication" : "Outreach"}
              </span>
            </div>
            {index < totalSteps - 1 && (
              <div className={`h-1 flex-1 mx-2 ${
                index + 1 < currentStep ? "bg-green-400" : "bg-gray-200"
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Tenant Settings</h1>
          {tenantData?.tenants?.name && (
            <div className="flex space-x-2">
              <div className="bg-jobmojo-primary text-white px-4 py-2 rounded-md">
                {tenantData.tenants.name}
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowSetupWizard(true)}
              >
                Setup Wizard
              </Button>
            </div>
          )}
        </div>

        {/* Setup Wizard Dialog */}
        <Dialog open={showSetupWizard} onOpenChange={setShowSetupWizard}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Tenant Setup Wizard</DialogTitle>
              <DialogDescription>
                Configure your tenant step by step. This will help you get started quickly.
              </DialogDescription>
            </DialogHeader>
            
            {renderStepIndicator()}
            
            <div className="py-4">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="wizard-tenant-name">Tenant Name</Label>
                    <Input 
                      id="wizard-tenant-name"
                      defaultValue={tenantData?.tenants?.name || ""}
                      placeholder="Enter your organization name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wizard-tenant-description">Description</Label>
                    <Textarea 
                      id="wizard-tenant-description"
                      defaultValue={tenantData?.tenants?.description || ""}
                      placeholder="Brief description of your organization"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wizard-logo">Logo</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 border rounded-md flex items-center justify-center bg-gray-50">
                        <span className="text-gray-400">No logo</span>
                      </div>
                      <Button variant="outline">Upload Logo</Button>
                    </div>
                  </div>
                </div>
              )}
              
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Social Media Integration</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect your social media accounts to streamline job posting and candidate outreach.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border p-4 rounded-md">
                      <div className="flex items-center space-x-4">
                        <div className="bg-pink-100 p-2 rounded-full">
                          <Instagram className="h-6 w-6 text-pink-600" />
                        </div>
                        <div>
                          <p className="font-medium">Instagram</p>
                          <p className="text-sm text-muted-foreground">
                            Share jobs and company culture
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">Connect</Button>
                    </div>
                    
                    <div className="flex items-center justify-between border p-4 rounded-md">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Linkedin className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">LinkedIn</p>
                          <p className="text-sm text-muted-foreground">
                            Professional networking and job posts
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">Connect</Button>
                    </div>
                    
                    <div className="flex items-center justify-between border p-4 rounded-md">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-50 p-2 rounded-full">
                          <Facebook className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium">Facebook</p>
                          <p className="text-sm text-muted-foreground">
                            Community building and job sharing
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">Connect</Button>
                    </div>
                    
                    <div className="flex items-center justify-between border p-4 rounded-md">
                      <div className="flex items-center space-x-4">
                        <div className="bg-sky-50 p-2 rounded-full">
                          <Twitter className="h-6 w-6 text-sky-500" />
                        </div>
                        <div>
                          <p className="font-medium">Twitter</p>
                          <p className="text-sm text-muted-foreground">
                            Quick updates and engagement
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">Connect</Button>
                    </div>
                  </div>
                </div>
              )}
              
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Communication Tools</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Set up your communication channels for team collaboration and candidate engagement.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border p-4 rounded-md">
                      <div className="flex items-center space-x-4">
                        <div className="bg-purple-100 p-2 rounded-full">
                          <MessageSquare className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">Slack</p>
                          <p className="text-sm text-muted-foreground">
                            Team communication and notifications
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">Connect</Button>
                    </div>
                    
                    <div className="flex items-center justify-between border p-4 rounded-md">
                      <div className="flex items-center space-x-4">
                        <div className="bg-red-100 p-2 rounded-full">
                          <Mail className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">Email Templates</p>
                          <p className="text-sm text-muted-foreground">
                            Configure outreach email templates
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                    
                    <div className="flex items-center justify-between border p-4 rounded-md">
                      <div className="flex items-center space-x-4">
                        <div className="bg-green-100 p-2 rounded-full">
                          <img 
                            src="https://cdn.cdnlogo.com/logos/c/50/canva.svg" 
                            alt="Canva" 
                            className="h-6 w-6" 
                          />
                        </div>
                        <div>
                          <p className="font-medium">Canva Integration</p>
                          <p className="text-sm text-muted-foreground">
                            Creative designs for job posts and branding
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">Connect</Button>
                    </div>
                  </div>
                </div>
              )}
              
              {currentStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Outreach Configuration</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure automated outreach for candidates and clients.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="outreach-frequency">Contact Frequency</Label>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="border rounded-md p-3 cursor-pointer hover:border-primary flex flex-col items-center">
                          <span className="font-medium">Weekly</span>
                          <span className="text-xs text-muted-foreground">Recommended</span>
                        </div>
                        <div className="border rounded-md p-3 cursor-pointer hover:border-primary flex flex-col items-center">
                          <span className="font-medium">Bi-weekly</span>
                          <span className="text-xs text-muted-foreground">Moderate</span>
                        </div>
                        <div className="border rounded-md p-3 cursor-pointer hover:border-primary flex flex-col items-center">
                          <span className="font-medium">Monthly</span>
                          <span className="text-xs text-muted-foreground">Less frequent</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="outreach-automation">Automated Outreach</Label>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Switch id="auto-job-alerts" />
                          <Label htmlFor="auto-job-alerts">Job Alerts</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="auto-candidate-followup" />
                          <Label htmlFor="auto-candidate-followup">Candidate Follow-up</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="auto-talent-nurturing" />
                          <Label htmlFor="auto-talent-nurturing">Talent Nurturing</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="auto-client-updates" />
                          <Label htmlFor="auto-client-updates">Client Updates</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="outreach-channels">Outreach Channels</Label>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Mail className="h-4 w-4" /> Email
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" /> SMS
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Share className="h-4 w-4" /> Social
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              <Button onClick={handleNext}>
                {currentStep === totalSteps ? "Finish" : (
                  <span className="flex items-center">
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 md:w-[750px]">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="outreach">Outreach</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Manage your tenant's general settings and information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {tenantLoading ? (
                  <div className="space-y-4">
                    <div className="h-8 bg-gray-200 rounded animate-pulse" />
                    <div className="h-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tenant-name">Tenant Name</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="tenant-name"
                          defaultValue={tenantData?.tenants?.name || ""}
                          className="flex-1"
                        />
                        <Button size="sm" className="flex-none">
                          <PenSquare className="h-4 w-4 mr-2" /> Edit
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tenant-description">Description</Label>
                      <div className="flex items-start gap-2">
                        <Textarea
                          id="tenant-description"
                          rows={4}
                          defaultValue={tenantData?.tenants?.description || ""}
                          className="flex-1"
                        />
                        <Button size="sm" className="flex-none">
                          <PenSquare className="h-4 w-4 mr-2" /> Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                <Button
                  onClick={() => {
                    toast({
                      title: "Settings saved",
                      description: "Your tenant settings have been updated successfully",
                    });
                  }}
                >
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Settings</CardTitle>
                <CardDescription>
                  Connect and manage your social media accounts for job posting and outreach
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border p-4 rounded-md">
                    <div className="flex items-center space-x-4">
                      <div className="bg-pink-100 p-2 rounded-full">
                        <Instagram className="h-6 w-6 text-pink-600" />
                      </div>
                      <div>
                        <p className="font-medium">Instagram</p>
                        <p className="text-sm text-muted-foreground">Not connected</p>
                      </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                  
                  <div className="flex items-center justify-between border p-4 rounded-md">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Linkedin className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">LinkedIn</p>
                        <p className="text-sm text-muted-foreground">Not connected</p>
                      </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                  
                  <div className="flex items-center justify-between border p-4 rounded-md">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-50 p-2 rounded-full">
                        <Facebook className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">Facebook</p>
                        <p className="text-sm text-muted-foreground">Not connected</p>
                      </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                  
                  <div className="flex items-center justify-between border p-4 rounded-md">
                    <div className="flex items-center space-x-4">
                      <div className="bg-sky-50 p-2 rounded-full">
                        <Twitter className="h-6 w-6 text-sky-500" />
                      </div>
                      <div>
                        <p className="font-medium">Twitter</p>
                        <p className="text-sm text-muted-foreground">Not connected</p>
                      </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Canva Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect your Canva account to create custom graphics for job postings and company branding
                  </p>
                  <div className="flex items-center justify-between border p-4 rounded-md">
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 p-2 rounded-full">
                        <img 
                          src="https://cdn.cdnlogo.com/logos/c/50/canva.svg" 
                          alt="Canva" 
                          className="h-6 w-6" 
                        />
                      </div>
                      <div>
                        <p className="font-medium">Canva</p>
                        <p className="text-sm text-muted-foreground">Not connected</p>
                      </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                </div>
                
                <Button
                  onClick={() => {
                    toast({
                      title: "Social media settings saved",
                      description: "Your social media connections have been updated",
                    });
                  }}
                >
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="communication" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Communication Tools</CardTitle>
                <CardDescription>
                  Configure your communication channels and integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-md font-medium">Messaging Platforms</h3>
                  
                  {/* Slack */}
                  <div className="flex items-center justify-between border p-4 rounded-md">
                    <div className="flex items-center space-x-4">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <img
                          src="https://cdn.cdnlogo.com/logos/s/40/slack-new.svg"
                          alt="Slack"
                          className="h-6 w-6"
                        />
                      </div>
                      <div>
                        <p className="font-medium">Slack</p>
                        <p className="text-sm text-muted-foreground">
                          Team communication and notifications
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                  
                  {/* Microsoft Teams */}
                  <div className="flex items-center justify-between border p-4 rounded-md">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <img
                          src="https://cdn.cdnlogo.com/logos/m/25/microsoft-teams.svg"
                          alt="Teams"
                          className="h-6 w-6"
                        />
                      </div>
                      <div>
                        <p className="font-medium">Microsoft Teams</p>
                        <p className="text-sm text-muted-foreground">
                          Chat, meetings, and collaboration
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                  
                  {/* WhatsApp - NEW */}
                  <div className="flex items-center justify-between border p-4 rounded-md">
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 p-2 rounded-full">
                        <img
                          src="https://cdn.cdnlogo.com/logos/w/43/whatsapp.svg"
                          alt="WhatsApp"
                          className="h-6 w-6"
                        />
                      </div>
                      <div>
                        <p className="font-medium">WhatsApp</p>
                        <p className="text-sm text-muted-foreground">
                          Messaging with candidates and clients
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                  
                  {/* SMS - NEW */}
                  <div className="flex items-center justify-between border p-4 rounded-md">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <MessageSquare className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">SMS</p>
                        <p className="text-sm text-muted-foreground">
                          Text message campaigns and notifications
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-md font-medium">Video Conferencing</h3>
                  
                  {/* Zoom - NEW */}
                  <div className="flex items-center justify-between border p-4 rounded-md">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <img
                          src="https://cdn.cdnlogo.com/logos/z/41/zoom-app.svg"
                          alt="Zoom"
                          className="h-6 w-6"
                        />
                      </div>
                      <div>
                        <p className="font-medium">Zoom</p>
                        <p className="text-sm text-muted-foreground">
                          Video interviews and team meetings
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                  
                  {/* Google Meet - NEW */}
                  <div className="flex items-center justify-between border p-4 rounded-md">
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Video className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Google Meet</p>
                        <p className="text-sm text-muted-foreground">
                          Video conferences and interviews
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-md font-medium">Voice Communications</h3>
                  
                  {/* Click-to-Call - NEW */}
                  <div className="flex items-center justify-between border p-4 rounded-md">
                    <div className="flex items-center space-x-4">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <Phone className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium">Click-to-Call</p>
                        <p className="text-sm text-muted-foreground">
                          One-click calling solution for recruitment
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-md font-medium">Email Configuration</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email-sender">Default Sender Name</Label>
                    <Input id="email-sender" placeholder="Recruitment Team" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email-reply-to">Default Reply-To Address</Label>
                    <Input id="email-reply-to" placeholder="recruiting@company.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email-signature">Email Signature</Label>
                    <Textarea 
                      id="email-signature" 
                      rows={3} 
                      placeholder="Your company email signature"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="email-tracking" />
                      <Label htmlFor="email-tracking">Enable Email Tracking</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Track when emails are opened and links are clicked
                    </p>
                  </div>
                </div>
                
                <Button
                  onClick={() => {
                    toast({
                      title: "Communication settings saved",
                      description: "Your communication preferences have been updated",
                    });
                  }}
                >
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="outreach" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Outreach Configuration</CardTitle>
                <CardDescription>
                  Set up automated outreach campaigns and engagement settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-md font-medium">Automated Campaigns</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Candidate Follow-up</p>
                        <p className="text-sm text-muted-foreground">
                          Automatically follow up with candidates after interviews
                        </p>
                      </div>
                      <Switch defaultChecked id="candidate-followup" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Talent Pool Nurturing</p>
                        <p className="text-sm text-muted-foreground">
                          Send periodic updates to candidates in your talent pool
                        </p>
                      </div>
                      <Switch id="talent-nurturing" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Job Alert Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Notify candidates about relevant new job openings
                        </p>
                      </div>
                      <Switch defaultChecked id="job-alerts" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Client Updates</p>
                        <p className="text-sm text-muted-foreground">
                          Keep clients informed about hiring progress
                        </p>
                      </div>
                      <Switch id="client-updates" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-md font-medium">Outreach Templates</h3>
                  
                  <div className="flex items-center justify-between border p-4 rounded-md">
                    <div>
                      <p className="font-medium">Welcome Message</p>
                      <p className="text-sm text-muted-foreground">
                        First message to new candidates
                      </p>
                    </div>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline">Edit Template</Button>
                      </SheetTrigger>
                      <SheetContent className="w-[400px] sm:w-[540px]">
                        <SheetHeader>
                          <SheetTitle>Edit Template</SheetTitle>
                          <SheetDescription>
                            Customize your welcome message template
                          </SheetDescription>
                        </SheetHeader>
                        <div className="py-4">
                          <Textarea 
                            className="min-h-[200px]" 
                            placeholder="Enter your welcome message template..." 
                            defaultValue="Dear {{candidate_name}},\n\nThank you for your interest in {{company_name}}. We appreciate your application for the {{job_title}} position and look forward to reviewing your qualifications.\n\nBest regards,\n{{recruiter_name}}"
                          />
                          <div className="mt-2">
                            <p className="text-sm font-medium">Available Variables:</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <span className="bg-gray-100 px-2 py-1 rounded-md text-xs">{'{{candidate_name}}'}</span>
                              <span className="bg-gray-100 px-2 py-1 rounded-md text-xs">{'{{company_name}}'}</span>
                              <span className="bg-gray-100 px-2 py-1 rounded-md text-xs">{'{{job_title}}'}</span>
                              <span className="bg-gray-100 px-2 py-1 rounded-md text-xs">{'{{recruiter_name}}'}</span>
                            </div>
                          </div>
                        </div>
                        <SheetFooter>
                          <SheetClose asChild>
                            <Button type="submit">Save Template</Button>
                          </SheetClose>
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>
                  </div>
                  
                  <div className="flex items-center justify-between border p-4 rounded-md">
                    <div>
                      <p className="font-medium">Interview Invitation</p>
                      <p className="text-sm text-muted-foreground">
                        Invitation to schedule an interview
                      </p>
                    </div>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline">Edit Template</Button>
                      </SheetTrigger>
                      <SheetContent className="w-[400px] sm:w-[540px]">
                        <SheetHeader>
                          <SheetTitle>Edit Template</SheetTitle>
                          <SheetDescription>
                            Customize your interview invitation template
                          </SheetDescription>
                        </SheetHeader>
                        <div className="py-4">
                          <Textarea 
                            className="min-h-[200px]" 
                            placeholder="Enter your interview invitation template..." 
                          />
                        </div>
                        <SheetFooter>
                          <SheetClose asChild>
                            <Button type="submit">Save Template</Button>
                          </SheetClose>
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>
                  </div>
                  
                  <div className="flex items-center justify-between border p-4 rounded-md">
                    <div>
                      <p className="font-medium">Job Offer</p>
                      <p className="text-sm text-muted-foreground">
                        Official job offer message
                      </p>
                    </div>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline">Edit Template</Button>
                      </SheetTrigger>
                      <SheetContent className="w-[400px] sm:w-[540px]">
                        <SheetHeader>
                          <SheetTitle>Edit Template</SheetTitle>
                          <SheetDescription>
                            Customize your job offer template
                          </SheetDescription>
                        </SheetHeader>
                        <div className="py-4">
                          <Textarea 
                            className="min-h-[200px]" 
                            placeholder="Enter your job offer template..." 
                          />
                        </div>
                        <SheetFooter>
                          <SheetClose asChild>
                            <Button type="submit">Save Template</Button>
                          </SheetClose>
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
                
                <Button
                  onClick={() => {
                    toast({
                      title: "Outreach settings saved",
                      description: "Your outreach configuration has been updated",
                    });
                  }}
                >
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="mt-6">
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
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default TenantAdminSettings;
