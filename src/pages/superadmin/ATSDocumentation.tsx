
import React from 'react';
import { ATSDocumentationViewer } from '@/components/documentation/ATSDocumentationViewer';

export default function ATSDocumentation() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <ATSDocumentationViewer />
      </div>
    </div>
  );
}
