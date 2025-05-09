
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Mail, MessageSquare, Share } from "lucide-react";

const OutreachSettings = () => {
  return (
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
        
        <div className="space-y-4">
          <h3 className="text-md font-medium">Outreach Channels</h3>
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
  );
};

export default OutreachSettings;
