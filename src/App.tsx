import { Fragment, useEffect, useState } from 'react';
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
import { SiteRuntimeSettings } from './components/SiteRuntimeSettings';
import { SiteContentProvider, useSiteContent } from './context/SiteContentContext';
import { RegistrationType } from './types';

export default function App() {
  return <SiteContentProvider><LandingPage /></SiteContentProvider>;
}

function LandingPage() {
  const { content } = useSiteContent();
  const [selectedRole, setSelectedRole] = useState<RegistrationType>('vecino');
  const adminRoute = window.location.pathname === '/admin' || window.location.pathname === '/admin/';

  useEffect(() => {
    if (adminRoute) return;
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
  }, [adminRoute]);

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'hero': return <Hero onSelectRole={setSelectedRole} onScrollToForm={() => handleScrollToSection('registro')} />;
      case 'scene': return <LiveNeighborhoodScene />;
      case 'benefits': return <ThreeBenefits onSelectRole={setSelectedRole} onScrollToForm={() => handleScrollToSection('registro')} />;
      case 'trust': return <TrustSection />;
      case 'businesses': return <BusinessSection onSelectRole={setSelectedRole} onScrollToForm={() => handleScrollToSection('registro')} />;
      case 'localAds': return <LocalAdSection onSelectRole={setSelectedRole} onScrollToForm={() => handleScrollToSection('registro')} />;
      case 'faq': return <FAQSection />;
      case 'waitlist': return <WaitlistFormSection selectedRole={selectedRole} onRoleChange={setSelectedRole} />;
      default: return null;
    }
  };

  if (adminRoute) {
    return (
      <div className="min-h-screen bg-slate-950 font-sans">
        <SiteRuntimeSettings includeCustomCss={false} />
        <AdminPanelModal defaultTab="cms" onClose={() => window.location.assign('/')} />
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-[#FAFDFB] text-slate-800 flex flex-col font-sans selection:bg-[#18B68B]/20 selection:text-[#18B68B] relative">
        <SiteRuntimeSettings />
        
        {/* 1. Header */}
        {content.layout.headerVisible && <Header
          onScrollToSection={handleScrollToSection}
          onSelectRoleForm={(role) => setSelectedRole(role)}
        />}

        <main className="flex-1">
          {content.layout.sections.filter((section) => section.visible).map((section) => (
            <Fragment key={section.id}>{renderSection(section.id)}</Fragment>
          ))}
        </main>

        {/* 10. Footer */}
        {content.layout.footerVisible && <Footer />}

      </div>
  );
}
