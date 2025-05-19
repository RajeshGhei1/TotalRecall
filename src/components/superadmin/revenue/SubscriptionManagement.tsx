
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Search } from "lucide-react";

// Mock subscription data
const subscriptions = [
  {
    id: 'sub_123456',
    tenantName: 'XYZ Recruiting Inc',
    planType: 'recruitment',
    planTier: 'Professional',
    status: 'active',
    amount: 199.00,
    nextBilling: '2025-06-15',
    startDate: '2025-01-15',
  },
  {
    id: 'sub_123457',
    tenantName: 'ABC Talent Solutions',
    planType: 'recruitment',
    planTier: 'Enterprise',
    status: 'active',
    amount: 399.00,
    nextBilling: '2025-06-20',
    startDate: '2024-12-20',
  },
  {
    id: 'sub_123458',
    tenantName: 'Tech Staffing Co',
    planType: 'employer',
    planTier: 'Professional',
    status: 'active',
    amount: 99.00,
    nextBilling: '2025-06-10',
    startDate: '2024-11-10',
  },
  {
    id: 'sub_123459',
    tenantName: 'Global IT Services',
    planType: 'recruitment',
    planTier: 'Professional',
    status: 'past_due',
    amount: 199.00,
    nextBilling: '2025-06-05',
    startDate: '2025-02-05',
  },
  {
    id: 'sub_123460',
    tenantName: 'Innovative Solutions',
    planType: 'employer',
    planTier: 'Starter',
    status: 'canceled',
    amount: 49.00,
    nextBilling: 'N/A',
    startDate: '2024-10-01',
  },
];

const SubscriptionManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredSubscriptions = subscriptions.filter(sub => 
    sub.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'past_due':
        return <Badge className="bg-amber-500">Past Due</Badge>;
      case 'canceled':
        return <Badge variant="outline">Canceled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getPlanTypeBadge = (type: string) => {
    switch (type) {
      case 'recruitment':
        return <Badge className="bg-blue-500">Recruitment</Badge>;
      case 'employer':
        return <Badge className="bg-purple-500">Employer</Badge>;
      case 'talent':
        return <Badge className="bg-teal-500">Talent</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Subscriptions</CardTitle>
          <CardDescription>Manage customer subscriptions across all plans</CardDescription>
          <div className="flex items-center mt-2 gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search subscriptions..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>Add Subscription</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Next Billing</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.map(subscription => (
                <TableRow key={subscription.id}>
                  <TableCell className="font-medium">
                    <div>{subscription.tenantName}</div>
                    <div className="text-xs text-muted-foreground">{subscription.id}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {getPlanTypeBadge(subscription.planType)}
                      <span className="text-xs">{subscription.planTier}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                  <TableCell>${subscription.amount.toFixed(2)}/mo</TableCell>
                  <TableCell>{subscription.nextBilling}</TableCell>
                  <TableCell>{subscription.startDate}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Subscription</DropdownMenuItem>
                        <DropdownMenuItem>Manage Payment Methods</DropdownMenuItem>
                        <DropdownMenuItem>Cancel Subscription</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManagement;
