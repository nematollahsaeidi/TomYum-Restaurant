import { toast } from 'sonner';

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  supplier: string;
  lastRestocked: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

// In a real implementation, this would connect to an API
// For now, we'll simulate with local storage
export const inventoryService = {
  // Add new inventory item
  addItem: (itemData: Omit<InventoryItem, 'id' | 'status'>) => {
    const items = inventoryService.getItems();
    const newItem: InventoryItem = {
      ...itemData,
      id: Math.max(0, ...items.map(i => i.id)) + 1,
      status: itemData.quantity === 0 ? 'out-of-stock' : 
             itemData.quantity <= itemData.minThreshold ? 'low-stock' : 'in-stock'
    };
    
    const updatedItems = [...items, newItem];
    localStorage.setItem('inventory', JSON.stringify(updatedItems));
    toast.success('Item added to inventory');
    return newItem;
  },

  // Update inventory item
  updateItem: (id: number, itemData: Partial<InventoryItem>) => {
    const items = inventoryService.getItems();
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, ...itemData };
        // Update status based on quantity
        if (updatedItem.quantity !== undefined && updatedItem.minThreshold !== undefined) {
          updatedItem.status = updatedItem.quantity === 0 ? 'out-of-stock' : 
                              updatedItem.quantity <= updatedItem.minThreshold ? 'low-stock' : 'in-stock';
        }
        return updatedItem;
      }
      return item;
    });
    
    localStorage.setItem('inventory', JSON.stringify(updatedItems));
    toast.success('Inventory item updated');
    return updatedItems.find(i => i.id === id);
  },

  // Delete inventory item
  deleteItem: (id: number) => {
    const items = inventoryService.getItems();
    const updatedItems = items.filter(item => item.id !== id);
    localStorage.setItem('inventory', JSON.stringify(updatedItems));
    toast.success('Item removed from inventory');
    return updatedItems;
  },

  // Get all inventory items
  getItems: (): InventoryItem[] => {
    const items = localStorage.getItem('inventory');
    return items ? JSON.parse(items) : [];
  },

  // Filter inventory by status
  filterInventory: (status: string): InventoryItem[] => {
    const items = inventoryService.getItems();
    return items.filter(item => item.status === status);
  }
};