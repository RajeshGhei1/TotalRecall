
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="p-6">
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingState;
