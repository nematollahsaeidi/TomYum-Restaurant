import { toast } from 'sonner';
import { MenuItem } from '@/lib/menu-data';

// In a real implementation, this would connect to an API
// For now, we'll simulate with local storage
export const menuService = {
  // Add new menu item
  addMenuItem: (itemData: Omit<MenuItem, 'id'>) => {
    const items = menuService.getMenuItems();
    const newItem: MenuItem = {
      ...itemData,
      id: Math.max(0, ...items.map(i => i.id)) + 1
    };
    
    const updatedItems = [...items, newItem];
    localStorage.setItem('menuItems', JSON.stringify(updatedItems));
    toast.success('Menu item added');
    return newItem;
  },

  // Update menu item
  updateMenuItem: (itemData: MenuItem) => {
    const items = menuService.getMenuItems();
    const updatedItems = items.map(item => 
      item.id === itemData.id ? itemData : item
    );
    
    localStorage.setItem('menuItems', JSON.stringify(updatedItems));
    toast.success('Menu item updated');
    return itemData;
  },

  // Delete menu item
  deleteMenuItem: (id: number) => {
    const items = menuService.getMenuItems();
    const updatedItems = items.filter(item => item.id !== id);
    localStorage.setItem('menuItems', JSON.stringify(updatedItems));
    toast.success('Menu item deleted');
    return updatedItems;
  },

  // Get all menu items
  getMenuItems: (): MenuItem[] => {
    const items = localStorage.getItem('menuItems');
    return items ? JSON.parse(items) : [];
  },

  // Filter menu by category
  filterMenu: (category: string): MenuItem[] => {
    const items = menuService.getMenuItems();
    return category === 'all' ? items : items.filter(item => item.category === category);
  }
};