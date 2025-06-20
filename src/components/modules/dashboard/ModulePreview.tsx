
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ModuleRenderer from '../ModuleRenderer';

interface ModulePreviewProps {
  moduleId: string;
  onClose: () => void;
}

const ModulePreview: React.FC<ModulePreviewProps> = ({ moduleId, onClose }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Module Preview
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ModuleRenderer moduleId={moduleId} />
      </CardContent>
    </Card>
  );
};

export default ModulePreview;
