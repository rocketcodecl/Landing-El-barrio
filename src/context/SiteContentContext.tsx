import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { FAQItem, LocalBusiness, NeighborhoodPost, SiteContent } from '../types';
import { DEFAULT_SITE_CONTENT } from '../data/defaultSiteContent';

interface SiteContentContextType {
  content: SiteContent;
  updateContent: (newContent: SiteContent) => void;
  updateSection: <K extends keyof SiteContent>(section: K, data: Partial<SiteContent[K]>) => void;
  
  // Post operations
  updatePost: (id: string, updated: Partial<NeighborhoodPost>) => void;
  addPost: (newPost: NeighborhoodPost) => void;
  deletePost: (id: string) => void;

  // Business operations
  updateBusiness: (id: string, updated: Partial<LocalBusiness>) => void;
  addBusiness: (newBusiness: LocalBusiness) => void;
  deleteBusiness: (id: string) => void;

  // FAQ operations
  updateFAQ: (id: string, updated: Partial<FAQItem>) => void;
  addFAQ: (newFaq: FAQItem) => void;
  deleteFAQ: (id: string) => void;

  // Reset / Backup
  resetToDefaults: () => void;
  exportContentJSON: () => void;
  importContentJSON: (jsonStr: string) => boolean;

  // Visual in-page edit mode
  isVisualEditMode: boolean;
  setIsVisualEditMode: (active: boolean) => void;
  activeEditSection: string | null;
  setActiveEditSection: (section: string | null) => void;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  saveError: string | null;
}

const STORAGE_KEY = 'elbarrio_live_site_content_v2';

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

function mergeContent<T>(defaults: T, saved: unknown): T {
  if (Array.isArray(defaults)) return (Array.isArray(saved) ? saved : defaults) as T;
  if (defaults && typeof defaults === 'object') {
    const source = saved && typeof saved === 'object' && !Array.isArray(saved) ? saved as Record<string, unknown> : {};
    return Object.fromEntries(
      Object.entries(defaults as Record<string, unknown>).map(([key, value]) => [key, mergeContent(value, source[key])]),
    ) as T;
  }
  return (saved === undefined || saved === null ? defaults : saved) as T;
}

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const remoteReadyRef = useRef(false);
  const lastRemoteContentRef = useRef(JSON.stringify(DEFAULT_SITE_CONTENT));

  const [isVisualEditMode, setIsVisualEditMode] = useState<boolean>(false);
  const [activeEditSection, setActiveEditSection] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/site-content', { signal: AbortSignal.timeout(8000) })
      .then(async (response) => {
        if (!response.ok) throw new Error('No fue posible cargar el contenido publicado');
        return response.json();
      })
      .then(({ content: remoteContent }) => {
        if (cancelled) return;
        if (remoteContent && typeof remoteContent === 'object') {
          const merged = mergeContent(DEFAULT_SITE_CONTENT, remoteContent);
          lastRemoteContentRef.current = JSON.stringify(merged);
          setContent(merged);
        }
        remoteReadyRef.current = true;
      })
      .catch((error) => {
        console.error(error);
        remoteReadyRef.current = true;
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!remoteReadyRef.current) return;
    const serialized = JSON.stringify(content);
    if (serialized === lastRemoteContentRef.current) return;
    setSaveStatus('saving');
    setSaveError(null);
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch('/api/site-content', {
          method: 'PUT',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
          signal: AbortSignal.timeout(8000),
        });
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body.error || 'No fue posible guardar el contenido');
        lastRemoteContentRef.current = serialized;
        localStorage.setItem(STORAGE_KEY, serialized);
        setSaveStatus('saved');
      } catch (error) {
        setSaveStatus('error');
        setSaveError(error instanceof Error ? error.message : 'Error al guardar');
      }
    }, 700);
    return () => window.clearTimeout(timer);
  }, [content]);

  const updateContent = (newContent: SiteContent) => {
    setContent(newContent);
  };

  const updateSection = <K extends keyof SiteContent>(section: K, data: Partial<SiteContent[K]>) => {
    setContent(prev => {
      const current = prev[section];
      if (typeof current === 'object' && !Array.isArray(current)) {
        return {
          ...prev,
          [section]: {
            ...current,
            ...data
          }
        };
      }
      return {
        ...prev,
        [section]: data as any
      };
    });
  };

  // Posts operations
  const updatePost = (id: string, updated: Partial<NeighborhoodPost>) => {
    setContent(prev => ({
      ...prev,
      posts: prev.posts.map(p => p.id === id ? { ...p, ...updated } : p)
    }));
  };

  const addPost = (newPost: NeighborhoodPost) => {
    setContent(prev => ({
      ...prev,
      posts: [newPost, ...prev.posts]
    }));
  };

  const deletePost = (id: string) => {
    setContent(prev => ({
      ...prev,
      posts: prev.posts.filter(p => p.id !== id)
    }));
  };

  // Business operations
  const updateBusiness = (id: string, updated: Partial<LocalBusiness>) => {
    setContent(prev => ({
      ...prev,
      businesses: prev.businesses.map(b => b.id === id ? { ...b, ...updated } : b)
    }));
  };

  const addBusiness = (newBusiness: LocalBusiness) => {
    setContent(prev => ({
      ...prev,
      businesses: [newBusiness, ...prev.businesses]
    }));
  };

  const deleteBusiness = (id: string) => {
    setContent(prev => ({
      ...prev,
      businesses: prev.businesses.filter(b => b.id !== id)
    }));
  };

  // FAQ operations
  const updateFAQ = (id: string, updated: Partial<FAQItem>) => {
    setContent(prev => ({
      ...prev,
      faqs: prev.faqs.map(f => f.id === id ? { ...f, ...updated } : f)
    }));
  };

  const addFAQ = (newFaq: FAQItem) => {
    setContent(prev => ({
      ...prev,
      faqs: [...prev.faqs, newFaq]
    }));
  };

  const deleteFAQ = (id: string) => {
    setContent(prev => ({
      ...prev,
      faqs: prev.faqs.filter(f => f.id !== id)
    }));
  };

  const resetToDefaults = () => {
    setContent(DEFAULT_SITE_CONTENT);
    localStorage.removeItem(STORAGE_KEY);
  };

  const exportContentJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(content, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `elbarrio_content_${new Date().toISOString().substring(0, 10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  const importContentJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && typeof parsed === 'object') {
        setContent(parsed);
        return true;
      }
    } catch (e) {
      console.error('Error importing JSON content:', e);
    }
    return false;
  };

  return (
    <SiteContentContext.Provider
      value={{
        content,
        updateContent,
        updateSection,
        updatePost,
        addPost,
        deletePost,
        updateBusiness,
        addBusiness,
        deleteBusiness,
        updateFAQ,
        addFAQ,
        deleteFAQ,
        resetToDefaults,
        exportContentJSON,
        importContentJSON,
        isVisualEditMode,
        setIsVisualEditMode,
        activeEditSection,
        setActiveEditSection,
        saveStatus,
        saveError,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
}
