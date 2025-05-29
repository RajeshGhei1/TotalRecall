
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface NavItem {
  id: string;
  label: string;
  customLabel?: string;
  icon: React.ComponentType<{ size?: string | number }>;
  href: string;
}

interface NavigationPreferences {
  items: Array<{
    id: string;
    customLabel?: string;
  }>;
}

export const useNavigationPreferences = (
  adminType: 'super_admin' | 'tenant_admin',
  defaultItems: NavItem[]
) => {
  const { user, bypassAuth } = useAuth();
  const { toast } = useToast();
  const [navItems, setNavItems] = useState<NavItem[]>(defaultItems);
  const [isLoading, setIsLoading] = useState(true);

  // Generate storage key for localStorage fallback
  const storageKey = `${adminType}-nav-order`;

  // Load preferences from database or localStorage
  useEffect(() => {
    const loadPreferences = async () => {
      if (bypassAuth) {
        // In bypass mode, use localStorage
        loadFromLocalStorage();
        setIsLoading(false);
        return;
      }

      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Try to load from database first
        const { data, error } = await supabase
          .from('user_navigation_preferences')
          .select('preferences')
          .eq('user_id', user.id)
          .eq('admin_type', adminType)
          .single();

        if (error && error.code !== 'PGRST116') {
          // PGRST116 is "not found" error, which is expected for new users
          console.error('Error loading navigation preferences:', error);
          // Fallback to localStorage
          loadFromLocalStorage();
        } else if (data) {
          // Successfully loaded from database
          const preferences = data.preferences as NavigationPreferences;
          applyPreferences(preferences);
        } else {
          // No preferences found, try to migrate from localStorage
          migrateFromLocalStorage();
        }
      } catch (error) {
        console.error('Unexpected error loading navigation preferences:', error);
        loadFromLocalStorage();
      }

      setIsLoading(false);
    };

    loadPreferences();
  }, [user, adminType, bypassAuth]);

  const loadFromLocalStorage = () => {
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        
        // Handle both old format (just IDs) and new format (full items with custom labels)
        if (Array.isArray(parsedData) && typeof parsedData[0] === 'string') {
          // Old format - just order IDs
          const orderedItems = parsedData
            .map((id: string) => defaultItems.find(item => item.id === id))
            .filter(Boolean);
          
          const missingItems = defaultItems.filter(
            item => !parsedData.includes(item.id)
          );
          
          setNavItems([...orderedItems, ...missingItems]);
        } else if (Array.isArray(parsedData) && parsedData[0]?.id) {
          // New format - items with custom labels
          const orderedItems = parsedData.map((savedItem: any) => {
            const defaultItem = defaultItems.find(item => item.id === savedItem.id);
            return defaultItem ? { ...defaultItem, customLabel: savedItem.customLabel } : null;
          }).filter(Boolean);
          
          const missingItems = defaultItems.filter(
            item => !parsedData.find((saved: any) => saved.id === item.id)
          );
          
          setNavItems([...orderedItems, ...missingItems]);
        }
      } catch (error) {
        console.error('Failed to parse saved navigation data:', error);
        setNavItems(defaultItems);
      }
    } else {
      setNavItems(defaultItems);
    }
  };

  const applyPreferences = (preferences: NavigationPreferences) => {
    const orderedItems = preferences.items.map((savedItem) => {
      const defaultItem = defaultItems.find(item => item.id === savedItem.id);
      return defaultItem ? { ...defaultItem, customLabel: savedItem.customLabel } : null;
    }).filter(Boolean);
    
    const missingItems = defaultItems.filter(
      item => !preferences.items.find((saved) => saved.id === item.id)
    );
    
    setNavItems([...orderedItems, ...missingItems]);
  };

  const migrateFromLocalStorage = async () => {
    const savedData = localStorage.getItem(storageKey);
    if (savedData && user && !bypassAuth) {
      try {
        const parsedData = JSON.parse(savedData);
        const preferences: NavigationPreferences = {
          items: Array.isArray(parsedData) && parsedData[0]?.id 
            ? parsedData.map((item: any) => ({
                id: item.id,
                customLabel: item.customLabel
              }))
            : parsedData.map((id: string) => ({ id }))
        };

        // Save to database
        await saveToDatabase(preferences);
        
        // Apply the migrated preferences
        applyPreferences(preferences);
        
        console.log('Successfully migrated navigation preferences to database');
      } catch (error) {
        console.error('Failed to migrate navigation preferences:', error);
        loadFromLocalStorage();
      }
    } else {
      setNavItems(defaultItems);
    }
  };

  const saveToDatabase = async (preferences: NavigationPreferences) => {
    if (!user || bypassAuth) return;

    try {
      const { error } = await supabase
        .from('user_navigation_preferences')
        .upsert({
          user_id: user.id,
          admin_type: adminType,
          preferences
        });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error saving navigation preferences to database:', error);
      throw error;
    }
  };

  const savePreferences = async (items: NavItem[]) => {
    const preferences: NavigationPreferences = {
      items: items.map(item => ({
        id: item.id,
        customLabel: item.customLabel
      }))
    };

    // Always save to localStorage as backup
    localStorage.setItem(storageKey, JSON.stringify(preferences.items));

    // Save to database if user is authenticated
    if (user && !bypassAuth) {
      try {
        await saveToDatabase(preferences);
      } catch (error) {
        toast({
          title: "Warning",
          description: "Failed to sync navigation preferences. Changes saved locally only.",
          variant: "destructive"
        });
      }
    }
  };

  const updateNavOrder = async (newItems: NavItem[]) => {
    setNavItems(newItems);
    await savePreferences(newItems);
  };

  const updateNavLabel = async (id: string, newLabel: string) => {
    const updatedItems = navItems.map(item => 
      item.id === id ? { ...item, customLabel: newLabel } : item
    );
    setNavItems(updatedItems);
    await savePreferences(updatedItems);
  };

  const resetNavLabel = async (id: string) => {
    const updatedItems = navItems.map(item => 
      item.id === id ? { ...item, customLabel: undefined } : item
    );
    setNavItems(updatedItems);
    await savePreferences(updatedItems);
  };

  const resetToDefault = async () => {
    setNavItems(defaultItems);
    
    // Clear localStorage
    localStorage.removeItem(storageKey);
    
    // Clear database
    if (user && !bypassAuth) {
      try {
        await supabase
          .from('user_navigation_preferences')
          .delete()
          .eq('user_id', user.id)
          .eq('admin_type', adminType);
      } catch (error) {
        console.error('Error clearing navigation preferences from database:', error);
      }
    }
  };

  return {
    navItems,
    updateNavOrder,
    updateNavLabel,
    resetNavLabel,
    resetToDefault,
    isLoading
  };
};
