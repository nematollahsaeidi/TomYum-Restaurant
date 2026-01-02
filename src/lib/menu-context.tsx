"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { initialMenuItems, MenuItem } from "@/lib/menu-data";

interface MenuContextType {
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: number) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: Math.max(0, ...menuItems.map(i => i.id)) + 1
    };
    setMenuItems(prev => [...prev, newItem]);
  };

  const updateMenuItem = (item: MenuItem) => {
    setMenuItems(prev => prev.map(i => i.id === item.id ? item : i));
  };

  const deleteMenuItem = (id: number) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <MenuContext.Provider value={{ menuItems, addMenuItem, updateMenuItem, deleteMenuItem }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
}