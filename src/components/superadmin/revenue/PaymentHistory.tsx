
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

// Mock payment data
const payments = [
  {
    id: 'py_123456',
    invoiceId: 'INV-25-001',
    tenantName: 'XYZ Recruiting Inc',
    status: 'succeeded',
    amount: 199.00,
    paymentMethod: 'Visa •••• 4242',
    date: '2025-05-16',
  },
  {
    id: 'py_123457',
    invoiceId: 'INV-25-002',
    tenantName: 'ABC Talent Solutions',
    status: 'succeeded',
    amount: 399.00,
    paymentMethod: 'Mastercard •••• 5555',
    date: '2025-05-21',
  },
  {
    id: 'py_123458',
    invoiceId: 'INV-24-045',
    tenantName: 'Tech Staffing Co',
    status: 'succeeded',
    amount: 99.00,
    paymentMethod: 'Visa •••• 9876',
    date: '2025-04-11',
  },
  {
    id: 'py_123459',
    invoiceId: 'INV-24-038',
    tenantName: 'Global IT Services',
    status: 'failed',
    amount: 199.00,
    paymentMethod: 'Visa •••• 1234',
    date: '2025-04-22',
  },
  {
    id: 'py_123460',
    invoiceId: 'INV-24-039',
    tenantName: 'Global IT Services',
    status: 'succeeded',
    amount: 199.00,
    paymentMethod: 'Mastercard •••• 5678',
    date: '2025-04-23',
  },
];

const PaymentHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredPayments = payments.filter(payment => 
    payment.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <Badge className="bg-green-500">Succeeded</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>View all payment transactions</CardDescription>
          <div className="flex items-center mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payments..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map(payment => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-xs">
                    {payment.id}
                  </TableCell>
                  <TableCell>{payment.invoiceId}</TableCell>
                  <TableCell>{payment.tenantName}</TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>{payment.paymentMethod}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentHistory;
