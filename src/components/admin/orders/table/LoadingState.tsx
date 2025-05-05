
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="rounded-md border p-4">
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingState;
