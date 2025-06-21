
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Users, TrendingUp, MapPin } from 'lucide-react';

const CompaniesModule: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Building className="h-8 w-8 text-blue-600" />
            Companies
          </h1>
          <p className="text-gray-600 mt-2">
            Comprehensive company management and relationship tracking
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Companies</p>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
              </div>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Relationships</p>
                <p className="text-2xl font-bold text-gray-900">856</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                <p className="text-2xl font-bold text-gray-900">12.5%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Locations</p>
                <p className="text-2xl font-bold text-gray-900">47</p>
              </div>
              <MapPin className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'TechCorp Solutions', industry: 'Technology', employees: '500-1000', location: 'San Francisco' },
                { name: 'Global Manufacturing Inc', industry: 'Manufacturing', employees: '1000+', location: 'Detroit' },
                { name: 'StartupX', industry: 'Software', employees: '10-50', location: 'Austin' },
                { name: 'Enterprise Systems LLC', industry: 'Consulting', employees: '250-500', location: 'New York' }
              ].map((company, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Building className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{company.name}</h3>
                      <p className="text-sm text-gray-600">{company.industry} • {company.employees} employees</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{company.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <button className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Building className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Add Company</p>
                  <p className="text-sm text-gray-600">Create new company profile</p>
                </div>
              </div>
            </button>
            
            <button className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Manage Relationships</p>
                  <p className="text-sm text-gray-600">Update company connections</p>
                </div>
              </div>
            </button>
            
            <button className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium">View Analytics</p>
                  <p className="text-sm text-gray-600">Company insights & trends</p>
                </div>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompaniesModule;
