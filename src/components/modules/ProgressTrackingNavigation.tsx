
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Code, 
  TestTube, 
  CheckCircle, 
  FileText,
  TrendingUp,
  Settings
} from 'lucide-react';

const ProgressTrackingNavigation: React.FC = () => {
  const location = useLocation();
  const isActive = location.pathname.includes('/progress-tracking');

  return (
    <Card className={`cursor-pointer transition-all hover:shadow-md ${isActive ? 'ring-2 ring-blue-500' : ''}`}>
      <Link to="/tenant-admin/progress-tracking">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Development Progress</h3>
              <p className="text-sm text-gray-600">Real-time module development tracking</p>
            </div>
            <Badge variant="outline" className="text-xs">
              Live
            </Badge>
          </div>
          
          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Code className="h-3 w-3" />
              <span>Code</span>
            </div>
            <div className="flex items-center gap-1">
              <TestTube className="h-3 w-3" />
              <span>Tests</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              <span>Features</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <span>Docs</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProgressTrackingNavigation;
