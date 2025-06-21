
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Users, Mail, Phone, MapPin, Briefcase } from 'lucide-react';

const PeopleModule: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="h-8 w-8 text-green-600" />
            People & Contacts
          </h1>
          <p className="text-gray-600 mt-2">
            Advanced people and contact management with talent database integration
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                <p className="text-2xl font-bold text-gray-900">3,456</p>
              </div>
              <User className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Candidates</p>
                <p className="text-2xl font-bold text-gray-900">892</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Business Contacts</p>
                <p className="text-2xl font-bold text-gray-900">1,567</p>
              </div>
              <Mail className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent Additions</p>
                <p className="text-2xl font-bold text-gray-900">127</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { 
                  name: 'Sarah Johnson', 
                  title: 'Senior Software Engineer', 
                  company: 'TechCorp Solutions',
                  email: 'sarah.j@techcorp.com',
                  phone: '+1 (555) 123-4567',
                  location: 'San Francisco, CA'
                },
                { 
                  name: 'Michael Chen', 
                  title: 'Product Manager', 
                  company: 'StartupX',
                  email: 'michael.c@startupx.com',
                  phone: '+1 (555) 234-5678',
                  location: 'Austin, TX'
                },
                { 
                  name: 'Emily Rodriguez', 
                  title: 'HR Director', 
                  company: 'Global Manufacturing Inc',
                  email: 'e.rodriguez@globalmfg.com',
                  phone: '+1 (555) 345-6789',
                  location: 'Detroit, MI'
                },
                { 
                  name: 'David Kim', 
                  title: 'Consultant', 
                  company: 'Enterprise Systems LLC',
                  email: 'david.kim@enterprisesys.com',
                  phone: '+1 (555) 456-7890',
                  location: 'New York, NY'
                }
              ].map((contact, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                      <p className="text-sm text-gray-600">{contact.title} at {contact.company}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{contact.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{contact.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-sm text-gray-600">{contact.location}</span>
                    </div>
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
                <User className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Add Contact</p>
                  <p className="text-sm text-gray-600">Create new contact profile</p>
                </div>
              </div>
            </button>
            
            <button className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Briefcase className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Talent Database</p>
                  <p className="text-sm text-gray-600">Browse candidate profiles</p>
                </div>
              </div>
            </button>
            
            <button className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium">Business Contacts</p>
                  <p className="text-sm text-gray-600">Manage business relationships</p>
                </div>
              </div>
            </button>
            
            <button className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium">Bulk Import</p>
                  <p className="text-sm text-gray-600">Upload contacts from CSV</p>
                </div>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PeopleModule;
