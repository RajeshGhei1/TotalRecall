
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDropdownOptions } from '@/hooks/useDropdownOptions';
import { Button } from '@/components/ui/button';
import { countries } from '@/utils/countryData';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface CountryOptionsProviderProps {
  children: React.ReactNode;
}

const CountryOptionsProvider: React.FC<CountryOptionsProviderProps> = ({ children }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [hasCountries, setHasCountries] = useState(false);
  const { getCategoryIdByName, options } = useDropdownOptions('countries');
  
  useEffect(() => {
    // Check if we already have countries in the dropdown
    if (options && options.length > 0) {
      setHasCountries(true);
    } else {
      setHasCountries(false);
    }
  }, [options]);

  const handleImportCountries = async () => {
    try {
      setIsImporting(true);
      
      // Get or create the countries category
      const categoryId = await getCategoryIdByName('countries', true);
      
      if (!categoryId) {
        toast({
          title: 'Error',
          description: 'Failed to find or create countries category',
          variant: 'destructive',
        });
        return;
      }
      
      // Batch insert countries in groups of 20 to avoid payload size issues
      const batchSize = 20;
      for (let i = 0; i < countries.length; i += batchSize) {
        const batch = countries.slice(i, i + batchSize).map(country => ({
          category_id: categoryId,
          value: country.value,
          label: country.label
        }));
        
        const { error } = await supabase
          .from('dropdown_options')
          .insert(batch);
          
        if (error) throw error;
      }
      
      toast({
        title: 'Success',
        description: `Imported ${countries.length} countries to the dropdown options`,
      });
      
      setHasCountries(true);
    } catch (error) {
      console.error('Error importing countries:', error);
      toast({
        title: 'Error',
        description: 'Failed to import countries. See console for details.',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Simply render children if countries are already loaded
  if (hasCountries) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 border rounded-md bg-gray-50">
      <h3 className="text-lg font-medium">Country Data</h3>
      <p className="text-center text-muted-foreground mb-4">
        No countries found in the dropdown options. Would you like to import all countries?
      </p>
      <Button
        onClick={handleImportCountries}
        disabled={isImporting}
      >
        {isImporting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Importing Countries...
          </>
        ) : (
          'Import All Countries'
        )}
      </Button>
    </div>
  );
};

export default CountryOptionsProvider;
