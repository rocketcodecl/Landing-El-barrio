import { useState } from 'react';
import { Mail, Shield, FileText, Heart, Globe } from 'lucide-react';
import { LegalModal } from './LegalModal';
import { BrandLogo } from './BrandLogo';
import { useSiteContent } from '../context/SiteContentContext';

export function Footer() {
  const { content } = useSiteContent();
  const [modalType, setModalType] = useState<'privacidad' | 'terminos' | 'normas' | null>(null);

  const branding = content.branding || {};
  const footer = content.footer || {};

  const domain = branding.officialDomain || (branding as any).domain || 'https://elbarrio.lat';
  const supportEmail = branding.supportEmail || (branding as any).contactEmail || 'contacto@elbarrio.lat';
  const description = footer.description || 'La super-app hiperlocal para conectar con tus vecinos de a pie, comprar, vender, regalar, arrendar herramientas y enterarte de la vida de tu entorno.';
  const locationNotice = footer.locationNotice || (footer as any).cityNote || 'Santiago, Chile • Proyecto en proceso de activación comunitaria en Las Condes.';
  const copyrightText = footer.copyrightText || 'El Barrio (elbarrio.lat). Todos los derechos reservados.';

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="lg" light={true} />

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm pt-2">
              {description}
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-slate-800/80 w-fit px-3 py-1.5 rounded-lg border border-slate-700">
              <Globe className="w-3.5 h-3.5" />
              <span>Dominio oficial: {domain}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navegación</h4>
            <ul className="space-y-2 text-sm text-slate-400 font-medium">
              <li><a href="#asi-se-vive" className="hover:text-[#18B68B] transition-colors">Así se vive</a></li>
              <li><a href="#beneficios" className="hover:text-[#18B68B] transition-colors">Beneficios</a></li>
              <li><a href="#seguridad" className="hover:text-[#18B68B] transition-colors">Seguridad</a></li>
              <li><a href="#comercios" className="hover:text-[#18B68B] transition-colors">Comercios</a></li>
              <li><a href="#faq" className="hover:text-[#18B68B] transition-colors">Preguntas Frecuentes</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Legales & Comunidad</h4>
            <ul className="space-y-2 text-sm text-slate-400 font-medium">
              <li>
                <button 
                  onClick={() => setModalType('privacidad')}
                  className="hover:text-[#18B68B] transition-colors flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-[#18B68B]" />
                  <span>Política de Privacidad</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setModalType('terminos')}
                  className="hover:text-[#18B68B] transition-colors flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-[#18B68B]" />
                  <span>Términos y Condiciones</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setModalType('normas')}
                  className="hover:text-[#18B68B] transition-colors flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 text-[#18B68B]" />
                  <span>Normas de la Comunidad</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Contacto Oficial</h4>
            <div className="space-y-2 text-sm text-slate-400 font-medium">
              <a href={`mailto:${supportEmail}`} className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-[#18B68B]" />
                <span>{supportEmail}</span>
              </a>
              <p className="text-xs text-slate-500 pt-2">
                {locationNotice}
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{copyrightText}</p>
          <p className="flex items-center gap-1">
            Diseñado para fortalecer comunidades en Chile
          </p>
        </div>

      </div>

      {/* Legal Modal Component */}
      {modalType && (
        <LegalModal type={modalType} onClose={() => setModalType(null)} />
      )}
    </footer>
  );
}
