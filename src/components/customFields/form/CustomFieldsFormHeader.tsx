
import React from 'react';

interface CustomFieldsFormHeaderProps {
  title?: string;
  description?: string;
}

const CustomFieldsFormHeader: React.FC<CustomFieldsFormHeaderProps> = ({
  title,
  description
}) => {
  if (!title && !description) return null;
  
  return (
    <div>
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
};

export default CustomFieldsFormHeader;
