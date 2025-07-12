
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { AvailableWidget } from '@/types/common';

interface WidgetPaletteProps {
  widgetsByCategory: Record<string, AvailableWidget[]>;
  addWidget: (widget: AvailableWidget) => void;
}

const WidgetPalette: React.FC<WidgetPaletteProps> = ({ widgetsByCategory, addWidget }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Widgets</CardTitle>
        <CardDescription>
          Click on widgets to add them to your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(widgetsByCategory).map(([category, widgets]) => (
          <div key={category} className="space-y-2">
            <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
              {category}
            </h4>
            <div className="grid gap-2">
              {widgets.map((widget) => (
                <div
                  key={widget.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => addWidget(widget)}
                >
                  <div>
                    <div className="font-medium">{widget.name}</div>
                    {widget.description && (
                      <div className="text-sm text-muted-foreground">
                        {widget.description}
                      </div>
                    )}
                  </div>
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default WidgetPalette;
