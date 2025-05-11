
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Share } from "lucide-react";

const OutreachStep = () => {
  return (
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
  );
};

export default OutreachStep;
