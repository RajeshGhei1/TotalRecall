
import React from 'react';

interface FormHeaderProps {
  title?: string;
  description?: string;
}

const FormHeader: React.FC<FormHeaderProps> = ({ title, description }) => {
  return (
    <div className="mb-6">
      {title && <h3 className="text-lg font-medium">{title}</h3>}
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
    </div>
  );
};

export default FormHeader;
