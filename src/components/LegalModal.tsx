import { X, Shield, FileText, HeartHandshake } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface LegalModalProps {
  type: 'privacidad' | 'terminos' | 'normas';
  onClose: () => void;
}

export function LegalModal({ type, onClose }: LegalModalProps) {
  const { content: siteContent } = useSiteContent();
  const document = type === 'privacidad' ? siteContent.legal.privacy : type === 'terminos' ? siteContent.legal.terms : siteContent.legal.community;
  const icon = type === 'privacidad' ? <Shield className="w-5 h-5 text-[#18B68B]" /> : type === 'terminos' ? <FileText className="w-5 h-5 text-[#18B68B]" /> : <HeartHandshake className="w-5 h-5 text-[#18B68B]" />;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div role="dialog" aria-modal="true" aria-labelledby="legal-modal-title" className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[85vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50">
              {icon}
            </div>
            <h3 id="legal-modal-title" className="font-extrabold text-slate-900 text-xl">{document.title}</h3>
          </div>
          <button 
            onClick={onClose}
            aria-label="Cerrar información legal"
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 pr-2">
          <div className="space-y-4 text-sm leading-relaxed text-slate-700">
            <p>{document.intro}</p>
            {document.blocks.map((block, index) => <div key={`${block.heading}-${index}`} className="space-y-1.5"><h4 className="text-base font-bold text-slate-900">{block.heading}</h4><p>{block.body}</p></div>)}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#18B68B] text-white font-bold px-6 py-2.5 rounded-xl text-sm cursor-pointer hover:bg-[#15a27c]"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
}
