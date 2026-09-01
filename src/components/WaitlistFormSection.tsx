import { useState, FormEvent } from 'react';
import { CHILEAN_COMMUNES } from '../data/mockData';
import { RegistrationType } from '../types';
import { Users, Store, Wrench, ArrowRight, CheckCircle2, Sparkles, Share2, Copy, Check, MapPin, ShieldCheck, AlertCircle } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface WaitlistFormProps {
  selectedRole: RegistrationType;
  onRoleChange: (role: RegistrationType) => void;
}

export function WaitlistFormSection({ selectedRole, onRoleChange }: WaitlistFormProps) {
  const { content } = useSiteContent();
  const formContent = content.waitlistForm || {
    badge: 'Activación Comunitaria Territorial',
    title: 'Asegura tu cupo en el lanzamiento de tu cuadrante',
    subtitle: 'El Barrio se habilitará primero en los sectores de Las Condes con mayor cantidad de vecinos y comercios inscritos.',
    quadrantsTitle: 'Estado de Activación Territorial en Las Condes',
    quadrant1Name: 'El Golf & Plaza Perú (Las Condes)',
    quadrant1Progress: 'Meta referencial: 92%',
    quadrant2Name: 'Av. Manquehue & Apumanque',
    quadrant2Progress: 'Meta referencial: 78%',
    quadrant3Name: 'Colón Oriente & Rotonda Atenas',
    quadrant3Progress: 'Meta referencial: 65%',
    privacyText: 'Tus datos se usarán únicamente para gestionar tu inscripción y avisarte de la activación de tu cuadrante.',
    btnVecino: 'Quiero ser parte de mi barrio en Las Condes',
    btnComercio: 'Registrar mi comercio en el cuadrante',
    btnServicio: 'Registrar mi servicio profesional'
  };
  const ui = content.formUI;

  const quadrants = [
    { id: 'q-1', name: formContent.quadrant1Name || 'El Golf & Plaza Perú (Las Condes)', progress: formContent.quadrant1Progress || '92%' },
    { id: 'q-2', name: formContent.quadrant2Name || 'Av. Manquehue & Apumanque', progress: formContent.quadrant2Progress || '78%' },
    { id: 'q-3', name: formContent.quadrant3Name || 'Colón Oriente & Rotonda Atenas', progress: formContent.quadrant3Progress || '65%' },
  ];

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [comuna, setComuna] = useState('Las Condes');
  const [otraComuna, setOtraComuna] = useState('');
  const [nombreNegocio, setNombreNegocio] = useState('');
  const [rubro, setRubro] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !correo.trim() || !whatsapp.trim()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const selectedCommune = comuna === 'Otra comuna' ? (otraComuna.trim() || 'Las Condes') : comuna;

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantType: selectedRole,
          nombre: nombre.trim(),
          correo: correo.trim(),
          whatsapp: whatsapp.trim(),
          comuna: selectedCommune,
          nombreNegocio: nombreNegocio.trim() || undefined,
          rubro: rubro.trim() || undefined,
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
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(ui.whatsappMessage);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <section id="registro" className="py-24 bg-gradient-to-b from-[#FAFDFB] via-[#EAF7F2]/60 to-[#FAFDFB] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Context, Benefits & Quadrant Progress */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-[#18B68B] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>{formContent.badge || 'Activación Comunitaria Territorial'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              {formContent.title || 'Asegura tu cupo en el lanzamiento de tu cuadrante'}
            </h2>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              {formContent.subtitle || 'El Barrio se habilitará primero en los sectores de Las Condes con mayor cantidad de vecinos y comercios inscritos.'}
            </p>

            {/* Active Quadrants Status in Las Condes */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#18B68B]" />
                  <span>{formContent.quadrantsTitle || ui.activationLabel}</span>
                </span>
              </div>

              <div className="space-y-2.5 text-sm">
                {quadrants.map(q => (
                  <div key={q.id} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-800">{q.name}</span>
                    <span className="text-xs font-bold text-[#18B68B]">{q.progress}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-4 text-xs text-slate-500 font-medium pt-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#18B68B]" />
                <span>{ui.privacyBadge}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#18B68B]" />
                <span>{ui.noHiddenCostsBadge}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Wide Registration Form Container */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-emerald-900/10 shadow-xl">

            {/* Role Selection Tabs */}
            <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl mb-8 text-xs sm:text-sm font-bold">
              <button
                type="button"
                onClick={() => onRoleChange('vecino')}
                className={`py-3 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  selectedRole === 'vecino'
                    ? 'bg-[#18B68B] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>{ui.roleNeighbor}</span>
              </button>

              <button
                type="button"
                onClick={() => onRoleChange('comercio')}
                className={`py-3 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  selectedRole === 'comercio'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>{ui.roleBusiness}</span>
              </button>

              <button
                type="button"
                onClick={() => onRoleChange('servicio')}
                className={`py-3 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  selectedRole === 'servicio'
                    ? 'bg-teal-700 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span>{ui.roleService}</span>
              </button>
            </div>

            {!submitted ? (
              /* Registration Form */
              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      {ui.nameLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder={ui.namePlaceholder}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#18B68B] focus:border-transparent text-sm bg-slate-50/50"
                    />
                  </div>

                  {selectedRole === 'comercio' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          {ui.businessNameLabel} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={nombreNegocio}
                          onChange={(e) => setNombreNegocio(e.target.value)}
                          placeholder={ui.businessNamePlaceholder}
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#18B68B] focus:border-transparent text-sm bg-slate-50/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          {ui.businessCategoryLabel} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={rubro}
                          onChange={(e) => setRubro(e.target.value)}
                          placeholder={ui.businessCategoryPlaceholder}
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#18B68B] focus:border-transparent text-sm bg-slate-50/50"
                        />
                      </div>
                    </>
                  )}

                  {selectedRole === 'servicio' && (
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        {ui.serviceCategoryLabel} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={rubro}
                        onChange={(e) => setRubro(e.target.value)}
                        placeholder={ui.serviceCategoryPlaceholder}
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#18B68B] focus:border-transparent text-sm bg-slate-50/50"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      {ui.emailLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      placeholder={ui.emailPlaceholder}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#18B68B] focus:border-transparent text-sm bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      {ui.phoneLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder={ui.phonePlaceholder}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#18B68B] focus:border-transparent text-sm bg-slate-50/50"
                    />
                  </div>

                  <div className={comuna === 'Otra comuna' ? 'sm:col-span-1' : 'sm:col-span-2'}>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Comuna <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={comuna}
                      onChange={(e) => setComuna(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#18B68B] focus:border-transparent text-sm bg-slate-50/50 font-semibold text-slate-800"
                    >
                      {CHILEAN_COMMUNES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {comuna === 'Otra comuna' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        {ui.otherCommuneLabel} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={otraComuna}
                        onChange={(e) => setOtraComuna(e.target.value)}
                        placeholder={ui.otherCommunePlaceholder}
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#18B68B] focus:border-transparent text-sm bg-slate-50/50"
                      />
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                {submitError && (
                  <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{submitError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#18B68B] hover:bg-[#15a27c] text-white font-extrabold py-4 px-6 rounded-xl shadow-lg shadow-[#18B68B]/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 text-base cursor-pointer disabled:opacity-50 mt-4"
                >
                  {isSubmitting ? (
                    <span>{ui.submittingText}</span>
                  ) : (
                    <>
                      <span>
                        {selectedRole === 'vecino' && (formContent.btnVecino || 'Quiero ser parte de mi barrio en Las Condes')}
                        {selectedRole === 'comercio' && (formContent.btnComercio || 'Registrar mi comercio en el cuadrante')}
                        {selectedRole === 'servicio' && (formContent.btnServicio || 'Registrar mi servicio profesional')}
                      </span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-xs text-slate-500 text-center font-medium pt-1">
                  {formContent.privacyText || '🔒 Cero spam. Solo te avisaremos cuando abramos tu cuadrante específico.'}
                </p>

              </form>
            ) : (
              /* Success State */
              <div className="text-center space-y-6 py-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#18B68B] flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {ui.successTitle.replace('{nombre}', nombre.split(' ')[0] || nombre)}
                  </h3>
                  <p className="text-slate-600 text-base leading-relaxed max-w-lg mx-auto">
                    {ui.successMessage.replace('{comuna}', comuna === 'Otra comuna' ? otraComuna : comuna).replace('{rol}', selectedRole)}
                  </p>
                </div>

                <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 text-sm text-emerald-900 font-medium space-y-2 max-w-lg mx-auto">
                  <p>
                    {ui.savedText}{referralCode && <> Tu código de invitación es <strong>{referralCode}</strong>.</>}
                  </p>
                </div>

                {/* Share & Viral Loop */}
                <div className="pt-6 border-t border-slate-100 space-y-4 max-w-lg mx-auto">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {ui.shareEyebrow}
                  </p>
                  <p className="text-xs text-slate-500">
                    {ui.shareText}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={handleShareWhatsApp}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>{ui.shareWhatsapp}</span>
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedLink ? ui.copiedLink : ui.copyLink}</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
