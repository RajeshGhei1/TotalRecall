
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import ContactTypeChart from "./ContactTypeChart";
import ContactCompanyChart from "./ContactCompanyChart";
import ContactLocationChart from "./ContactLocationChart";
import ContactEngagementChart from "./ContactEngagementChart";
import { fetchContacts } from "@/services/contactService";

const ContactMetricsDashboard = () => {
  const { data: contacts = [] } = useQuery({
    queryKey: ['contacts'],
    queryFn: fetchContacts,
    // If the service is not yet implemented, this will return empty array
  });

  const totalContacts = contacts?.length || 0;
  const clientContacts = contacts?.filter(c => c.type === 'client').length || 0;
  const prospectContacts = contacts?.filter(c => c.type === 'prospect').length || 0;
  const vendorContacts = contacts?.filter(c => c.type === 'vendor').length || 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContacts}</div>
            <p className="text-xs text-muted-foreground">Registered contacts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientContacts}</div>
            <p className="text-xs text-muted-foreground">Client contacts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prospects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prospectContacts}</div>
            <p className="text-xs text-muted-foreground">Potential clients</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendorContacts}</div>
            <p className="text-xs text-muted-foreground">Vendor contacts</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ContactTypeChart />
        <ContactLocationChart />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ContactCompanyChart />
        <ContactEngagementChart />
      </div>
    </div>
  );
};

export default ContactMetricsDashboard;
