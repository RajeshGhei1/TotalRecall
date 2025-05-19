
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
import { MoreHorizontal, Search, Download, FileText } from "lucide-react";

// Mock invoice data
const invoices = [
  {
    id: 'INV-25-001',
    tenantName: 'XYZ Recruiting Inc',
    status: 'paid',
    amount: 199.00,
    issueDate: '2025-05-15',
    dueDate: '2025-06-15',
    paidDate: '2025-05-16',
  },
  {
    id: 'INV-25-002',
    tenantName: 'ABC Talent Solutions',
    status: 'paid',
    amount: 399.00,
    issueDate: '2025-05-20',
    dueDate: '2025-06-20',
    paidDate: '2025-05-21',
  },
  {
    id: 'INV-25-003',
    tenantName: 'Tech Staffing Co',
    status: 'pending',
    amount: 99.00,
    issueDate: '2025-05-10',
    dueDate: '2025-06-10',
    paidDate: null,
  },
  {
    id: 'INV-25-004',
    tenantName: 'Global IT Services',
    status: 'overdue',
    amount: 199.00,
    issueDate: '2025-05-05',
    dueDate: '2025-05-20',
    paidDate: null,
  },
  {
    id: 'INV-25-005',
    tenantName: 'Innovative Solutions',
    status: 'canceled',
    amount: 49.00,
    issueDate: '2025-05-01',
    dueDate: '2025-06-01',
    paidDate: null,
  },
];

const InvoiceList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredInvoices = invoices.filter(invoice => 
    invoice.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-blue-500">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500">Overdue</Badge>;
      case 'canceled':
        return <Badge variant="outline">Canceled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>Manage billing invoices for all customers</CardDescription>
          <div className="flex items-center mt-2 gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>Create Invoice</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map(invoice => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    {invoice.id}
                  </TableCell>
                  <TableCell>{invoice.tenantName}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>{invoice.issueDate}</TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="icon" variant="ghost" title="View Invoice">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" title="Download Invoice">
                        <Download className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                          <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                          <DropdownMenuItem>Mark as Canceled</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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

export default InvoiceList;
