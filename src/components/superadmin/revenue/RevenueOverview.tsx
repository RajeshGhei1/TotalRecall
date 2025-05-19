
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, Briefcase, Building } from 'lucide-react';

const revenueData = [
  { month: 'Jan', mrr: 12500 },
  { month: 'Feb', mrr: 13200 },
  { month: 'Mar', mrr: 14100 },
  { month: 'Apr', mrr: 15000 },
  { month: 'May', mrr: 16200 },
  { month: 'Jun', mrr: 17800 },
];

const customerData = [
  { month: 'Jan', recruiters: 28, employers: 45, talent: 130 },
  { month: 'Feb', recruiters: 32, employers: 48, talent: 142 },
  { month: 'Mar', recruiters: 35, employers: 52, talent: 158 },
  { month: 'Apr', recruiters: 40, employers: 57, talent: 172 },
  { month: 'May', recruiters: 43, employers: 62, talent: 185 },
  { month: 'Jun', recruiters: 48, employers: 68, talent: 201 },
];

// User type data
const userTypesData = {
  jobSeekers: {
    count: 1245,
    growth: 12.8,
    icon: Users
  },
  recruitmentAgencies: {
    count: 87,
    growth: 8.5,
    icon: Briefcase
  },
  employerCompanies: {
    count: 156,
    growth: 15.2,
    icon: Building
  }
};

const RevenueOverview = () => {
  // Calculate revenue growth metrics
  const currentMrr = revenueData[revenueData.length - 1].mrr;
  const previousMrr = revenueData[revenueData.length - 2].mrr;
  const mrrGrowth = ((currentMrr - previousMrr) / previousMrr) * 100;
  const totalCustomers = customerData[customerData.length - 1].recruiters + 
                         customerData[customerData.length - 1].employers + 
                         customerData[customerData.length - 1].talent;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Recurring Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentMrr.toLocaleString()}</div>
            <div className="flex items-center text-sm text-muted-foreground">
              {mrrGrowth > 0 ? (
                <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span className={mrrGrowth > 0 ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(mrrGrowth).toFixed(1)}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Annual Recurring Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(currentMrr * 12).toLocaleString()}</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>Projected yearly revenue</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <div className="h-4 w-4 text-muted-foreground">#</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>Across all plans</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Revenue Per User
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(currentMrr / totalCustomers).toFixed(2)}</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>Monthly ARPU</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* New section for user types metrics */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Platform Usage by User Type</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {/* Job Seekers Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Job Seekers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userTypesData.jobSeekers.count.toLocaleString()}</div>
              <div className="flex items-center text-sm text-muted-foreground">
                <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-500">
                  {userTypesData.jobSeekers.growth}% growth
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Recruitment Agencies Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Recruitment Agencies
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userTypesData.recruitmentAgencies.count.toLocaleString()}</div>
              <div className="flex items-center text-sm text-muted-foreground">
                <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-500">
                  {userTypesData.recruitmentAgencies.growth}% growth
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Companies Posting Jobs Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Companies Posting Jobs
              </CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userTypesData.employerCompanies.count.toLocaleString()}</div>
              <div className="flex items-center text-sm text-muted-foreground">
                <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-500">
                  {userTypesData.employerCompanies.growth}% growth
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Monthly Recurring Revenue</CardTitle>
            <CardDescription>
              6-month revenue trend
            </CardDescription>
          </CardHeader>
          <CardContent className="p-1">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'MRR']} />
                  <Line 
                    type="monotone" 
                    dataKey="mrr" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
            <CardDescription>
              Distribution by user type
            </CardDescription>
          </CardHeader>
          <CardContent className="p-1">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customerData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="recruiters" name="Recruitment Companies" fill="#8884d8" stackId="a" />
                  <Bar dataKey="employers" name="Employers" fill="#82ca9d" stackId="a" />
                  <Bar dataKey="talent" name="Talent" fill="#ffc658" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RevenueOverview;
