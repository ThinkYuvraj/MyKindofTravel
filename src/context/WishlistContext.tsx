import React, { createContext, useContext, useState, useEffect } from 'react';
import { DESTINATIONS, POPULAR_PACKAGES } from '../data/travelData';
import { DestinationItem, TravelPackage } from '../types';

interface WishlistContextType {
  savedDestinationIds: string[];
  savedPackageIds: string[];
  toggleDestinationWishlist: (id: string) => void;
  togglePackageWishlist: (id: string) => void;
  isDestinationSaved: (id: string) => boolean;
  isPackageSaved: (id: string) => boolean;
  savedDestinations: DestinationItem[];
  savedPackages: TravelPackage[];
  totalSavedCount: number;
  clearWishlist: () => void;
  isWishlistOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  items: any[];
  setIsOpen: (open: boolean) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const DEST_STORAGE_KEY = 'mkot_saved_destinations';
const PKG_STORAGE_KEY = 'mkot_saved_packages';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedDestinationIds, setSavedDestinationIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(DEST_STORAGE_KEY);
      return stored ? JSON.parse(stored) : ['bali', 'switzerland'];
    } catch {
      return ['bali', 'switzerland'];
    }
  });

  const [savedPackageIds, setSavedPackageIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(PKG_STORAGE_KEY);
      return stored ? JSON.parse(stored) : ['pkg-1'];
    } catch {
      return ['pkg-1'];
    }
  });

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(DEST_STORAGE_KEY, JSON.stringify(savedDestinationIds));
    } catch (e) {
      console.warn('Failed to save destination wishlist to localStorage', e);
    }
  }, [savedDestinationIds]);

  useEffect(() => {
    try {
      localStorage.setItem(PKG_STORAGE_KEY, JSON.stringify(savedPackageIds));
    } catch (e) {
      console.warn('Failed to save package wishlist to localStorage', e);
    }
  }, [savedPackageIds]);

  const toggleDestinationWishlist = (id: string) => {
    setSavedDestinationIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const togglePackageWishlist = (id: string) => {
    setSavedPackageIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isDestinationSaved = (id: string) => savedDestinationIds.includes(id);
  const isPackageSaved = (id: string) => savedPackageIds.includes(id);

  const clearWishlist = () => {
    setSavedDestinationIds([]);
    setSavedPackageIds([]);
  };

  const savedDestinations = DESTINATIONS.filter((d) => savedDestinationIds.includes(d.id));
  const savedPackages = POPULAR_PACKAGES.filter((p) => savedPackageIds.includes(p.id));
  const totalSavedCount = savedDestinationIds.length + savedPackageIds.length;

  return (
    <WishlistContext.Provider
      value={{
        savedDestinationIds,
        savedPackageIds,
        toggleDestinationWishlist,
        togglePackageWishlist,
        isDestinationSaved,
        isPackageSaved,
        savedDestinations,
        savedPackages,
        totalSavedCount,
        clearWishlist,
        isWishlistOpen,
        openWishlist: () => setIsWishlistOpen(true),
        closeWishlist: () => setIsWishlistOpen(false),
        items: [...savedDestinations, ...savedPackages],
        setIsOpen: (open: boolean) => setIsWishlistOpen(open),
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
