'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Site } from '@/types';

interface CMSContextType {
  currentRole: 'super_admin' | 'admin_situs' | 'publik';
  setCurrentRole: (role: 'super_admin' | 'admin_situs' | 'publik') => void;
  sites: Site[];
  activeSite: Site | null;
  setActiveSiteBySlug: (slug: string) => void;
  notification: string | null;
  setNotification: (msg: string | null) => void;
  refreshSites: () => Promise<void>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<'super_admin' | 'admin_situs' | 'publik'>('publik');
  const [sites, setSites] = useState<Site[]>([]);
  const [activeSite, setActiveSite] = useState<Site | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const refreshSites = async () => {
    try {
      const res = await fetch('/api/sites');
      const data = await res.json();
      if (data.sites) {
        setSites(data.sites);
        if (!activeSite && data.sites.length > 0) {
          setActiveSite(data.sites[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const setActiveSiteBySlug = (slug: string) => {
    const found = sites.find((s) => s.slug === slug);
    if (found) {
      setActiveSite(found);
    }
  };

  useEffect(() => {
    refreshSites();
  }, []);

  return (
    <CMSContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        sites,
        activeSite,
        setActiveSiteBySlug,
        notification,
        setNotification,
        refreshSites,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
