
import React from 'react';
import { BadgeDollarSign, BadgeIndianRupee } from 'lucide-react';

interface CurrencySelectorProps {
  currency: 'USD' | 'INR';
  setCurrency: (currency: 'USD' | 'INR') => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ currency, setCurrency }) => {
  return (
    <div className="flex items-center justify-center mb-8">
      <span className="text-sm font-medium mr-3">Currency:</span>
      <div className="bg-muted rounded-lg p-1 inline-flex">
        <button 
          onClick={() => setCurrency('USD')}
          className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
            currency === 'USD' 
              ? 'bg-primary text-primary-foreground shadow-sm' 
              : 'text-muted-foreground hover:bg-muted-foreground/10'
          }`}
        >
          <BadgeDollarSign className="h-3.5 w-3.5 mr-1" />
          USD
        </button>
        <button 
          onClick={() => setCurrency('INR')}
          className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
            currency === 'INR' 
              ? 'bg-primary text-primary-foreground shadow-sm' 
              : 'text-muted-foreground hover:bg-muted-foreground/10'
          }`}
        >
          <BadgeIndianRupee className="h-3.5 w-3.5 mr-1" />
          INR
        </button>
      </div>
    </div>
  );
};

export default CurrencySelector;
