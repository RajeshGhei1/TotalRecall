
import React from 'react';
import { Bot } from 'lucide-react';
import { AIModel } from './types';

interface AIModelListProps {
  models: AIModel[];
}

const AIModelList = ({ models }: AIModelListProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Available AI Models</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map((model) => (
          <div key={model.id} className="flex flex-col p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">{model.name}</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Provider: {model.provider}</p>
            <p className="text-sm flex-1">{model.description}</p>
            {model.isDefault && (
              <div className="mt-2">
                <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">Default</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIModelList;
