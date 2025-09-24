
import { useState, useEffect, useMemo } from 'react';
import { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  requiresModule?: string;
  badge?: string | number;
  category?: string;
  priority?: number;
  isSuperAdminModule?: boolean;
  isCollapsible?: boolean;
  // Updated interface to support navigation categorization
}

export interface NavigationState {
  items: NavItem[];
  pinnedItems: string[];
  hiddenItems: string[];
  customOrder: string[];
}

export const useNavigationPreferences = (userType: string, defaultItems: NavItem[]) => {
  // Memoize the default items to prevent unnecessary re-renders
  const memoizedDefaultItems = useMemo(() => defaultItems, [defaultItems]);
  
  const [navigationState, setNavigationState] = useState<NavigationState>(() => ({
    items: memoizedDefaultItems,
    pinnedItems: [],
    hiddenItems: [],
    customOrder: []
  }));

  // Update items when defaultItems changes, but in a controlled way
  useEffect(() => {
    setNavigationState(prev => ({
      ...prev,
      items: memoizedDefaultItems
    }));
  }, [memoizedDefaultItems]);

  const updateNavigationState = (updates: Partial<NavigationState>) => {
    setNavigationState(prev => ({
      ...prev,
      ...updates
    }));
  };

  const togglePinItem = (itemId: string) => {
    setNavigationState(prev => ({
      ...prev,
      pinnedItems: prev.pinnedItems.includes(itemId)
        ? prev.pinnedItems.filter(id => id !== itemId)
        : [...prev.pinnedItems, itemId]
    }));
  };

  const toggleHideItem = (itemId: string) => {
    setNavigationState(prev => ({
      ...prev,
      hiddenItems: prev.hiddenItems.includes(itemId)
        ? prev.hiddenItems.filter(id => id !== itemId)
        : [...prev.hiddenItems, itemId]
    }));
  };

  const reorderItems = (newOrder: string[]) => {
    setNavigationState(prev => ({
      ...prev,
      customOrder: newOrder
    }));
  };

  // Process items with current preferences
  const processedItems = useMemo(() => {
    const { items, pinnedItems, hiddenItems, customOrder } = navigationState;
    
    // Filter out hidden items
    const visibleItems = items.filter(item => !hiddenItems.includes(item.id));
    
    // Apply custom order if exists
    if (customOrder.length > 0) {
      const orderedItems: NavItem[] = [];
      const itemsMap = new Map(visibleItems.map(item => [item.id, item]));
      
      // Add items in custom order
      customOrder.forEach(id => {
        const item = itemsMap.get(id);
        if (item) {
          orderedItems.push(item);
          itemsMap.delete(id);
        }
      });
      
      // Add remaining items that weren't in custom order
      orderedItems.push(...Array.from(itemsMap.values()));
      
      return orderedItems;
    }
    
    return visibleItems;
  }, [navigationState]);

  return {
    items: processedItems,
    pinnedItems: navigationState.pinnedItems,
    hiddenItems: navigationState.hiddenItems,
    customOrder: navigationState.customOrder,
    updateNavigationState,
    togglePinItem,
    toggleHideItem,
    reorderItems
  };
};
