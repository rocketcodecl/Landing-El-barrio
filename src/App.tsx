import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LiveNeighborhoodScene } from './components/LiveNeighborhoodScene';
import { ThreeBenefits } from './components/ThreeBenefits';
import { TrustSection } from './components/TrustSection';
import { BusinessSection } from './components/BusinessSection';
import { LocalAdSection } from './components/LocalAdSection';
import { FAQSection } from './components/FAQSection';
import { WaitlistFormSection } from './components/WaitlistFormSection';
import { Footer } from './components/Footer';
import { AdminPanelModal } from './components/AdminPanelModal';
import { SiteContentProvider } from './context/SiteContentContext';
import { Edit3 } from 'lucide-react';

import { RegistrationType } from './types';

export default function App() {
  const [selectedRole, setSelectedRole] = useState<RegistrationType>('vecino');
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminDefaultTab, setAdminDefaultTab] = useState<'cms' | 'registros' | 'analytics' | 'integraciones'>('cms');
  const adminPreviewEnabled = new URLSearchParams(window.location.search).get('admin') === '1';

  useEffect(() => {
    const storageKey = 'elbarrio_visitor_session';
    let sessionId = localStorage.getItem(storageKey);
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem(storageKey, sessionId);
    }
    const payload = () => ({
      sessionId,
      path: window.location.pathname,
      referrer: document.referrer || 'direct',
    });
    fetch('/api/analytics/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload()),
      keepalive: true,
    }).catch(() => undefined);
    const sendHeartbeat = () => fetch('/api/analytics/live', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload()),
      keepalive: true,
    }).catch(() => undefined);
    sendHeartbeat();
    const interval = window.setInterval(sendHeartbeat, 30000);
    return () => window.clearInterval(interval);
  }, []);

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenCMS = () => {
    setAdminDefaultTab('cms');
    setAdminModalOpen(true);
  };

  return (
    <SiteContentProvider>
      <div className="min-h-screen bg-[#FAFDFB] text-slate-800 flex flex-col font-sans selection:bg-[#18B68B]/20 selection:text-[#18B68B] relative">
        
        {/* 1. Header */}
        <Header
          onScrollToSection={handleScrollToSection}
          onSelectRoleForm={(role) => setSelectedRole(role)}
        />

        <main className="flex-1">
          {/* 2. Hero Section */}
          <Hero
            onSelectRole={(role) => setSelectedRole(role)}
            onScrollToForm={() => handleScrollToSection('registro')}
          />

          {/* 3. Live Neighborhood Scene ("Así se vive El Barrio") */}
          <LiveNeighborhoodScene />

          {/* 4. Three Benefits (Conecta • Resuelve • Cuida) */}
          <ThreeBenefits
            onSelectRole={(role) => setSelectedRole(role)}
            onScrollToForm={() => handleScrollToSection('registro')}
          />

          {/* 5. Trust & Security */}
          <TrustSection />

          {/* 6. Shops & Service Providers */}
          <BusinessSection
            onSelectRole={(role) => setSelectedRole(role)}
            onScrollToForm={() => handleScrollToSection('registro')}
          />

          {/* 7. Targeted Hyperlocal Visibility */}
          <LocalAdSection
            onSelectRole={(role) => setSelectedRole(role)}
            onScrollToForm={() => handleScrollToSection('registro')}
          />

          {/* 8. FAQ Accordion */}
          <FAQSection />

          {/* 9. Final Call to Action & Waitlist Form */}
          <WaitlistFormSection
            selectedRole={selectedRole}
            onRoleChange={(role) => setSelectedRole(role)}
          />
        </main>

        {/* 10. Footer */}
        <Footer />

        {/* Floating Quick CMS Access Button for Administrator */}
        {adminPreviewEnabled && (
          <div className="fixed bottom-5 right-5 z-40">
            <button
              onClick={handleOpenCMS}
              className="group flex items-center gap-2.5 bg-slate-900 hover:bg-[#0E8067] text-white px-4 py-3 rounded-full shadow-2xl border border-slate-700 hover:border-[#0E8067] transition-all cursor-pointer text-xs font-bold active:scale-95"
              aria-label="Abrir el panel de administración"
              title="Abrir panel de administración"
            >
              <div className="w-6 h-6 rounded-full bg-[#0E8067] group-hover:bg-white text-white group-hover:text-[#0E8067] flex items-center justify-center transition-colors">
                <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
              </div>
              <span className="hidden sm:inline">CMS local · Demo</span>
              <span className="sm:hidden">CMS</span>
            </button>
          </div>
        )}

        {/* Admin Panel Modal (CMS, Analytics & Waitlist Manager) */}
        {adminPreviewEnabled && adminModalOpen && (
          <AdminPanelModal
            defaultTab={adminDefaultTab}
            onClose={() => setAdminModalOpen(false)}
          />
        )}
      </div>
    </SiteContentProvider>
  );
}
