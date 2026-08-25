import { useState } from 'react';
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
import { Edit3, Sparkles } from 'lucide-react';

import { INITIAL_ANALYTICS, INITIAL_WAITLIST } from './data/mockData';
import { RegistrationType, WaitlistEntry } from './types';

export default function App() {
  const [selectedRole, setSelectedRole] = useState<RegistrationType>('vecino');
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>(INITIAL_WAITLIST);
  const [analytics, setAnalytics] = useState(INITIAL_ANALYTICS);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminDefaultTab, setAdminDefaultTab] = useState<'cms' | 'registros' | 'analytics' | 'integraciones'>('cms');

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleAddRegistration = (newEntry: WaitlistEntry) => {
    setWaitlistEntries(prev => [newEntry, ...prev]);
    setAnalytics(prev => ({
      ...prev,
      dailyVisits: prev.dailyVisits + 1,
      totalVisits: prev.totalVisits + 1,
    }));
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Nombre', 'Correo', 'WhatsApp', 'Comuna', 'Tipo Registro', 'Fecha'];
    const rows = waitlistEntries.map(e => [
      e.id,
      `"${e.nombre.replace(/"/g, '""')}"`,
      `"${e.correo.replace(/"/g, '""')}"`,
      `"${e.whatsapp.replace(/"/g, '""')}"`,
      `"${e.comuna.replace(/"/g, '""')}"`,
      `"${e.tipo_registro}"`,
      `"${e.fecha}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `elbarrio_registros_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          onOpenAdmin={() => {
            setAdminDefaultTab('cms');
            setAdminModalOpen(true);
          }}
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
            onAddRegistration={handleAddRegistration}
          />
        </main>

        {/* 10. Footer */}
        <Footer />

        {/* Floating Quick CMS Access Button for Administrator */}
        <div className="fixed bottom-5 right-5 z-40">
          <button
            onClick={handleOpenCMS}
            className="group flex items-center gap-2.5 bg-slate-900 hover:bg-[#18B68B] text-white px-4 py-3 rounded-full shadow-2xl border border-slate-700 hover:border-[#18B68B] transition-all cursor-pointer text-xs font-bold active:scale-95"
            title="Abrir editor CMS en vivo"
          >
            <div className="w-6 h-6 rounded-full bg-[#18B68B] group-hover:bg-white text-white group-hover:text-[#18B68B] flex items-center justify-center transition-colors">
              <Edit3 className="w-3.5 h-3.5" />
            </div>
            <span className="hidden sm:inline">Modo Admin / Editar Textos e Imágenes</span>
            <span className="sm:hidden">CMS</span>
          </button>
        </div>

        {/* Admin Panel Modal (CMS, Analytics & Waitlist Manager) */}
        {adminModalOpen && (
          <AdminPanelModal
            analytics={analytics}
            waitlistEntries={waitlistEntries}
            defaultTab={adminDefaultTab}
            onClose={() => setAdminModalOpen(false)}
            onExportCSV={handleExportCSV}
          />
        )}
      </div>
    </SiteContentProvider>
  );
}
