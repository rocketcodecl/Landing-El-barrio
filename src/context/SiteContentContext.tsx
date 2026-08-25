import React, { createContext, useContext, useState, useEffect } from 'react';
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
}

const STORAGE_KEY = 'elbarrio_live_site_content_v2';

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SITE_CONTENT,
          ...parsed,
          branding: { ...DEFAULT_SITE_CONTENT.branding, ...(parsed.branding || {}) },
          hero: { ...DEFAULT_SITE_CONTENT.hero, ...(parsed.hero || {}) },
          benefits: { ...DEFAULT_SITE_CONTENT.benefits, ...(parsed.benefits || {}) },
          trust: { ...DEFAULT_SITE_CONTENT.trust, ...(parsed.trust || {}) },
          localAds: { ...DEFAULT_SITE_CONTENT.localAds, ...(parsed.localAds || {}) },
          waitlistForm: { ...DEFAULT_SITE_CONTENT.waitlistForm, ...(parsed.waitlistForm || {}) },
          footer: { ...DEFAULT_SITE_CONTENT.footer, ...(parsed.footer || {}) },
          posts: parsed.posts || DEFAULT_SITE_CONTENT.posts,
          businesses: parsed.businesses || DEFAULT_SITE_CONTENT.businesses,
          faqs: parsed.faqs || DEFAULT_SITE_CONTENT.faqs,
        };
      }
    } catch (e) {
      console.error('Error loading stored content:', e);
    }
    return DEFAULT_SITE_CONTENT;
  });

  const [isVisualEditMode, setIsVisualEditMode] = useState<boolean>(false);
  const [activeEditSection, setActiveEditSection] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch (e) {
      console.error('Error saving content to localStorage:', e);
    }
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
