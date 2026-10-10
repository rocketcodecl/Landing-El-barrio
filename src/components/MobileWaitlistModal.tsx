import { FormEvent, useEffect, useState } from 'react';
import { Check, CheckCircle2, Copy, Share2, ShieldCheck, Store, Users, X } from 'lucide-react';
import { CHILEAN_COMMUNES } from '../data/mockData';
import { useSiteContent } from '../context/SiteContentContext';
import { BUSINESS_PORTAL_URL, isLandingPreviewPath } from '../lib/landingRuntime';

interface MobileWaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileWaitlistModal({ isOpen, onClose }: MobileWaitlistModalProps) {
  const { content } = useSiteContent();
  const ui = content.formUI;
  const formContent = content.waitlistForm;
  const isPreview = isLandingPreviewPath();
  const mobilePublicBase = isPreview ? '/preview-launch-20260916/' : '/';
  const brandIsoGreen = `${mobilePublicBase}brand/iso-el-barrio.svg`;
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [comuna, setComuna] = useState('Las Condes');
  const [otraComuna, setOtraComuna] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!nombre.trim() || !correo.trim() || !whatsapp.trim()) return;

    setIsSubmitting(true);
    setSubmitError(null);
    const selectedCommune = comuna === 'Otra comuna' ? (otraComuna.trim() || 'Las Condes') : comuna;

    if (isPreview) {
      setReferralCode('');
      setSubmitted(true);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantType: 'vecino',
          nombre: nombre.trim(),
          correo: correo.trim(),
          whatsapp: whatsapp.trim(),
          comuna: selectedCommune,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'No pudimos completar tu inscripción');
      setReferralCode(result.referralCode || '');
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'No pudimos completar tu inscripción');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://elbarrio.lat');
    setCopiedLink(true);
    window.setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(ui.whatsappMessage)}`, '_blank');
  };

  const fieldClass = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-[13px] text-slate-900 outline-none transition focus:border-[#18B68B] focus:ring-2 focus:ring-[#18B68B]/15';
  const labelClass = 'mb-1.5 block text-[10px] font-extrabold text-slate-600';

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/70 px-3 pb-3 pt-16 backdrop-blur-[3px] sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Lista de espera">
      <button type="button" onClick={onClose} className="absolute inset-0 cursor-default" aria-label="Cerrar formulario" />
      <div className="relative z-10 max-h-[92dvh] w-full max-w-[430px] overflow-y-auto rounded-[26px] bg-white shadow-2xl">
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <img src={brandIsoGreen} alt="El Barrio" className="h-8 w-8 object-contain" />
            <div>
              <h2 className="text-[14px] font-extrabold text-slate-950">{formContent.title}</h2>
              <p className="mt-0.5 text-[9px] font-medium text-slate-400">{content.branding.appName} · {content.branding.officialDomain}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          {!submitted ? (
            <>
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-3 text-[11px] font-extrabold text-emerald-900 ring-1 ring-emerald-200">
                <Users className="h-4 w-4 text-[#18B68B]" />
                <span>{ui.roleNeighbor}</span>
              </div>

              {isPreview && (
                <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-[10px] font-semibold leading-4 text-amber-900">
                  Vista previa: puedes probar el formulario, pero los datos no se guardarán.
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
                <div><label className={labelClass}>{ui.nameLabel}</label><input className={fieldClass} required value={nombre} onChange={e => setNombre(e.target.value)} placeholder={ui.namePlaceholder} /></div>
                <div><label className={labelClass}>{ui.emailLabel}</label><input type="email" className={fieldClass} required value={correo} onChange={e => setCorreo(e.target.value)} placeholder={ui.emailPlaceholder} /></div>
                <div><label className={labelClass}>{ui.phoneLabel}</label><input type="tel" className={fieldClass} required value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder={ui.phonePlaceholder} /></div>

                <div className={comuna === 'Otra comuna' ? 'grid grid-cols-2 gap-2.5' : ''}>
                  <div><label className={labelClass}>{ui.communeLabel}</label><select className={fieldClass} value={comuna} onChange={e => setComuna(e.target.value)}>{CHILEAN_COMMUNES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                  {comuna === 'Otra comuna' && <div><label className={labelClass}>{ui.otherCommuneLabel}</label><input className={fieldClass} required value={otraComuna} onChange={e => setOtraComuna(e.target.value)} placeholder={ui.otherCommunePlaceholder} /></div>}
                </div>

                <div className="flex gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-[10px] leading-4 text-emerald-900">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#18B68B]" />
                  <span>{formContent.privacyText}</span>
                </div>

                {submitError && <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-[11px] font-semibold text-red-700">{submitError}</div>}

                <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#18B68B] px-4 py-3.5 text-[12px] font-extrabold text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50">
                  {isSubmitting ? ui.submittingText : formContent.btnVecino}
                </button>
              </form>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="text-[10px] leading-4 text-slate-500">{content.businessSection.subtitle}</p>
                <button type="button" onClick={() => window.location.assign(BUSINESS_PORTAL_URL)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-900 px-4 py-3 text-[11px] font-extrabold text-white">
                  <Store className="h-4 w-4 text-[#18B68B]" />
                  {content.navigation.mobileBusinessCta}
                </button>
              </div>
            </>
          ) : (
            <div className="py-5 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-[#18B68B]"><CheckCircle2 className="h-8 w-8" /></div>
              <h3 className="mt-4 text-xl font-extrabold text-slate-950">{ui.successTitle.replace('{nombre}', nombre.split(' ')[0] || nombre)}</h3>
              <p className="mx-auto mt-2 max-w-sm text-[12px] leading-5 text-slate-500">
                {isPreview
                  ? 'Prueba completada. Esta inscripción no fue guardada porque estás en el entorno de revisión.'
                  : ui.successMessage.replace('{comuna}', comuna === 'Otra comuna' ? otraComuna : comuna).replace('{rol}', 'vecino')}
              </p>
              {!isPreview && (
                <>
                  <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-[11px] text-emerald-900">{ui.savedText}{referralCode && <> Tu código de invitación es <strong>{referralCode}</strong>.</>}</div>
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <button type="button" onClick={handleShareWhatsApp} className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-3 text-[11px] font-bold text-white"><Share2 className="h-4 w-4" /> {ui.shareWhatsapp}</button>
                    <button type="button" onClick={handleCopyLink} className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-3 text-[11px] font-bold text-slate-700">{copiedLink ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />} {copiedLink ? ui.copiedLink : ui.copyLink}</button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
