
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { CheckCircle, ArrowRight, Instagram, Linkedin, Facebook, Twitter, MessageSquare, Mail, Share } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SetupWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantData: any;
}

const SetupWizard = ({ open, onOpenChange, tenantData }: SetupWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
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
  );
};

export default SetupWizard;
