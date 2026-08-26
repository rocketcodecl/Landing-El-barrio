import { useState } from 'react';
import { Menu, X, ShieldCheck, ArrowRight, Store, Users } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useSiteContent } from '../context/SiteContentContext';

interface HeaderProps {
  onScrollToSection: (sectionId: string) => void;
  onSelectRoleForm?: (role: 'vecino' | 'comercio' | 'servicio') => void;
}

export function Header({ onScrollToSection, onSelectRoleForm }: HeaderProps) {
  const { content } = useSiteContent();
  const navigation = content.navigation;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onScrollToSection(id);
    setMobileMenuOpen(false);
  };

  const handleRoleClick = (role: 'vecino' | 'comercio' | 'servicio') => {
    if (onSelectRoleForm) {
      onSelectRoleForm(role);
    }
    onScrollToSection('registro');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAFDFB]/95 backdrop-blur-md border-b border-emerald-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Official Brand Logo */}
          <a 
            href="#" 
            className="flex items-center gap-2 group focus:outline-none cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <BrandLogo size="md" />
          </a>

          {/* Desktop Navigation Links */}
          <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button 
              onClick={() => handleNavClick('asi-se-vive')} 
              className="hover:text-[#18B68B] transition-colors cursor-pointer py-1"
            >
              {navigation.sceneLabel}
            </button>
            <button 
              onClick={() => handleNavClick('beneficios')} 
              className="hover:text-[#18B68B] transition-colors cursor-pointer py-1"
            >
              {navigation.benefitsLabel}
            </button>
            <button 
              onClick={() => handleNavClick('seguridad')} 
              className="hover:text-[#18B68B] transition-colors cursor-pointer py-1 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-[#18B68B]" />
              {navigation.trustLabel}
            </button>
            <button 
              onClick={() => handleNavClick('comercios')} 
              className="hover:text-[#18B68B] transition-colors cursor-pointer py-1"
            >
              {navigation.businessesLabel}
            </button>
            <button 
              onClick={() => handleNavClick('faq')} 
              className="hover:text-[#18B68B] transition-colors cursor-pointer py-1"
            >
              {navigation.faqLabel}
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleRoleClick('vecino')}
              className="bg-[#18B68B] hover:bg-[#15a27c] text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-[#18B68B]/25 hover:shadow-lg hover:shadow-[#18B68B]/35 transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span>{navigation.desktopCta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:bg-emerald-50 focus:outline-none"
              aria-label={mobileMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-navigation" className="md:hidden bg-white border-b border-emerald-900/10 px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => handleNavClick('asi-se-vive')}
              className="text-left py-2.5 px-3 rounded-lg text-slate-700 hover:bg-emerald-50 font-medium"
            >
              {navigation.sceneLabel}
            </button>
            <button
              onClick={() => handleNavClick('beneficios')}
              className="text-left py-2.5 px-3 rounded-lg text-slate-700 hover:bg-emerald-50 font-medium"
            >
              {navigation.benefitsLabel}
            </button>
            <button
              onClick={() => handleNavClick('seguridad')}
              className="text-left py-2.5 px-3 rounded-lg text-slate-700 hover:bg-emerald-50 font-medium flex items-center justify-between"
            >
              <span>{navigation.trustLabel}</span>
              <ShieldCheck className="w-4 h-4 text-[#18B68B]" />
            </button>
            <button
              onClick={() => handleNavClick('comercios')}
              className="text-left py-2.5 px-3 rounded-lg text-slate-700 hover:bg-emerald-50 font-medium"
            >
              {navigation.businessesLabel}
            </button>
            <button
              onClick={() => handleNavClick('faq')}
              className="text-left py-2.5 px-3 rounded-lg text-slate-700 hover:bg-emerald-50 font-medium"
            >
              {navigation.faqLabel}
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => handleRoleClick('vecino')}
              className="w-full bg-[#18B68B] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md"
            >
              <Users className="w-4 h-4" />
              <span>{navigation.mobileNeighborCta}</span>
            </button>

            <button
              onClick={() => handleRoleClick('comercio')}
              className="w-full bg-slate-900 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2"
            >
              <Store className="w-4 h-4 text-[#18B68B]" />
              <span>{navigation.mobileBusinessCta}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
