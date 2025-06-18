
import React from "react";

interface TalentListProps {
  view?: 'search' | 'favorites' | 'recent' | 'analytics';
  showFilters?: boolean;
  allowAdd?: boolean;
}

const TalentList: React.FC<TalentListProps> = ({ 
  view = 'search', 
  showFilters = true, 
  allowAdd = true 
}) => {
  // Simple implementation for now - this would be expanded based on the view prop
  return (
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Talent Database</h2>
        <p className="text-muted-foreground">
          Current view: {view} | Filters: {showFilters ? 'On' : 'Off'} | Add allowed: {allowAdd ? 'Yes' : 'No'}
        </p>
      </div>
      
      {showFilters && (
        <div className="mb-4 p-4 bg-gray-50 rounded">
          <p>Filter controls would go here</p>
        </div>
      )}
      
      <div className="space-y-4">
        <p>Talent list content for {view} view would be displayed here.</p>
        
        {allowAdd && (
          <div className="mt-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Add New Talent
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TalentList;
