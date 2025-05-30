
import { useState, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  requiresModule?: string; // Add optional module requirement
}

interface NavigationPreferences {
  [key: string]: {
    order: string[];
    hiddenItems: string[];
    customLabels: { [key: string]: string };
  };
}

export const useNavigationPreferences = (context: string, defaultItems: NavItem[]) => {
  const [preferences, setPreferences] = useState<NavigationPreferences>({});
  const [orderedItems, setOrderedItems] = useState<NavItem[]>(defaultItems);

  useEffect(() => {
    const savedPreferences = localStorage.getItem('navigationPreferences');
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error('Error parsing navigation preferences:', error);
      }
    }
  }, []);

  useEffect(() => {
    const contextPrefs = preferences[context];
    if (!contextPrefs) {
      setOrderedItems(defaultItems);
      return;
    }

    // Filter out hidden items
    const visibleItems = defaultItems.filter(item => 
      !contextPrefs.hiddenItems?.includes(item.id)
    );

    // Apply custom order if available
    if (contextPrefs.order && contextPrefs.order.length > 0) {
      const ordered = [...visibleItems].sort((a, b) => {
        const aIndex = contextPrefs.order.indexOf(a.id);
        const bIndex = contextPrefs.order.indexOf(b.id);
        
        // If both items are in the order array, sort by their position
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        
        // If only one item is in the order array, it comes first
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        
        // If neither item is in the order array, maintain original order
        return 0;
      });
      
      setOrderedItems(ordered);
    } else {
      setOrderedItems(visibleItems);
    }

    // Apply custom labels
    if (contextPrefs.customLabels) {
      setOrderedItems(prev => prev.map(item => ({
        ...item,
        label: contextPrefs.customLabels[item.id] || item.label
      })));
    }
  }, [preferences, context, defaultItems]);

  const updateOrder = (newOrder: string[]) => {
    const updated = {
      ...preferences,
      [context]: {
        ...preferences[context],
        order: newOrder
      }
    };
    setPreferences(updated);
    localStorage.setItem('navigationPreferences', JSON.stringify(updated));
  };

  const toggleItemVisibility = (itemId: string) => {
    const contextPrefs = preferences[context] || { order: [], hiddenItems: [], customLabels: {} };
    const isHidden = contextPrefs.hiddenItems.includes(itemId);
    
    const updatedHiddenItems = isHidden
      ? contextPrefs.hiddenItems.filter(id => id !== itemId)
      : [...contextPrefs.hiddenItems, itemId];

    const updated = {
      ...preferences,
      [context]: {
        ...contextPrefs,
        hiddenItems: updatedHiddenItems
      }
    };
    
    setPreferences(updated);
    localStorage.setItem('navigationPreferences', JSON.stringify(updated));
  };

  const updateItemLabel = (itemId: string, newLabel: string) => {
    const contextPrefs = preferences[context] || { order: [], hiddenItems: [], customLabels: {} };
    
    const updated = {
      ...preferences,
      [context]: {
        ...contextPrefs,
        customLabels: {
          ...contextPrefs.customLabels,
          [itemId]: newLabel
        }
      }
    };
    
    setPreferences(updated);
    localStorage.setItem('navigationPreferences', JSON.stringify(updated));
  };

  const resetToDefaults = () => {
    const updated = { ...preferences };
    delete updated[context];
    setPreferences(updated);
    localStorage.setItem('navigationPreferences', JSON.stringify(updated));
  };

  return {
    items: orderedItems,
    updateOrder,
    toggleItemVisibility,
    updateItemLabel,
    resetToDefaults,
    hiddenItems: preferences[context]?.hiddenItems || []
  };
};
