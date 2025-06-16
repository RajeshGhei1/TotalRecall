
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Zap, TrendingUp, Users, ArrowRight } from 'lucide-react';

const UpgradePlan = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Unlock the Full Power of Total Recall AI
            </h1>
            <p className="text-lg text-gray-600">
              Your current plan only includes basic user management. 
              Upgrade to access advanced features and boost your productivity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="border-2 border-blue-200 bg-blue-50/50">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                  <CardTitle className="text-lg">Dashboard Analytics</CardTitle>
                </div>
                <p className="text-sm text-gray-600">
                  Advanced dashboard with insights, charts, and business intelligence
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Real-time analytics</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Custom widgets</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Performance metrics</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 bg-purple-50/50">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-6 w-6 text-purple-600" />
                  <CardTitle className="text-lg">Predictive Insights</CardTitle>
                </div>
                <p className="text-sm text-gray-600">
                  AI-powered predictions and intelligent business recommendations
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>AI predictions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Trend analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Smart recommendations</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 bg-green-50/50">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-6 w-6 text-green-600" />
                  <CardTitle className="text-lg">Workflow Management</CardTitle>
                </div>
                <p className="text-sm text-gray-600">
                  Intelligent automation and streamlined business processes
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Automated workflows</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Process optimization</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Smart triggers</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Crown className="h-12 w-12 text-yellow-300" />
              </div>
              <CardTitle className="text-2xl mb-2">Ready to Upgrade?</CardTitle>
              <p className="text-blue-100">
                Contact your administrator to upgrade your subscription plan and unlock these powerful features.
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">What you'll get:</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Advanced user management</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>Business analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      <span>AI-powered insights</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      <span>Premium support</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                >
                  Contact Administrator
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UpgradePlan;
