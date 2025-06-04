
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Activity, Clock, DollarSign } from 'lucide-react';
import { AIAgent } from '@/types/ai';

interface AIOverviewMetricsProps {
  agents: AIAgent[];
  aggregatedMetrics?: {
    avgResponseTime: number;
    totalCost: number;
  };
}

export const AIOverviewMetrics = ({ agents, aggregatedMetrics }: AIOverviewMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Agents</p>
              <p className="text-2xl font-bold">{agents.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Agents</p>
              <p className="text-2xl font-bold">{agents.filter(a => a.is_active).length}</p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold">{aggregatedMetrics?.avgResponseTime.toFixed(0) || 0}ms</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cost</p>
              <p className="text-2xl font-bold">${aggregatedMetrics?.totalCost.toFixed(2) || '0.00'}</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
