
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import ModuleRenderer from '../ModuleRenderer';

interface ModulePreviewProps {
  moduleId: string;
  onClose: () => void;
}

const ModulePreview: React.FC<ModulePreviewProps> = ({ moduleId, onClose }) => {
  return (
    <Card className="border border-gray-200 bg-white shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ExternalLink className="h-5 w-5 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Module Preview</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClose}
            className="flex items-center gap-2 hover:bg-white hover:border-gray-300 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-lg border-2 border-gray-100 p-6 min-h-[400px]">
          <ModuleRenderer moduleId={moduleId} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ModulePreview;
