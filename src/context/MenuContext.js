import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Central store for menu items. Using Context + useState keeps the app simple
// (no external state library) while giving every screen live access to the
// same list, so adds, edits and deletes show up everywhere immediately.

const MenuContext = createContext(undefined);
const STORAGE_KEY = 'chefs-menu-items';

let nextId = 1;

export function MenuProvider({ children }) {
  const [menuItems, setMenuItems] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadMenu = async () => {
      try {
        const savedMenu = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedMenu && !cancelled) {
          const parsedMenu = JSON.parse(savedMenu);
          if (Array.isArray(parsedMenu)) setMenuItems(parsedMenu);
        }
      } catch {
        if (!cancelled) setStorageError(true);
      } finally {
        if (!cancelled) setIsReady(true);
      }
    };

    loadMenu();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(menuItems))
      .then(() => setStorageError(false))
      .catch(() => setStorageError(true));
  }, [menuItems, isReady]);

  const addMenuItem = useCallback((item) => {
    setMenuItems((prev) => [
      { id: `${Date.now()}-${nextId++}`, createdAt: Date.now(), ...item },
      ...prev,
    ]);
  }, []);

  const updateMenuItem = useCallback((id, changes) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...changes } : item))
    );
  }, []);

  const deleteMenuItem = useCallback((id) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const value = useMemo(
    () => ({ menuItems, addMenuItem, updateMenuItem, deleteMenuItem, isReady, storageError }),
    [menuItems, addMenuItem, updateMenuItem, deleteMenuItem, isReady, storageError]
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return ctx;
}
