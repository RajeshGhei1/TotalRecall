
import React from 'react';
import RelationshipManager from '../relationships/RelationshipManager';

interface RelationshipsSectionProps {
  companyId: string;
  companyName: string;
}

const RelationshipsSection: React.FC<RelationshipsSectionProps> = ({ companyId, companyName }) => {
  return (
    <div className="space-y-6">
      <RelationshipManager companyId={companyId} companyName={companyName} />
    </div>
  );
};

export default RelationshipsSection;
