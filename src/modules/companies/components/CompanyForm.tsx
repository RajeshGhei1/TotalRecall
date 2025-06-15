
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CompanyForm: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="company-name">Company Name</Label>
          <Input id="company-name" placeholder="Enter company name" />
        </div>
        <div>
          <Label htmlFor="company-domain">Domain</Label>
          <Input id="company-domain" placeholder="company.com" />
        </div>
        <div>
          <Label htmlFor="company-industry">Industry</Label>
          <Input id="company-industry" placeholder="Technology" />
        </div>
        <Button className="w-full">Save Company</Button>
      </CardContent>
    </Card>
  );
};

export default CompanyForm;
