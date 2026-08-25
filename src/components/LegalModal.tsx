import { X, Shield, FileText, HeartHandshake } from 'lucide-react';

interface LegalModalProps {
  type: 'privacidad' | 'terminos' | 'normas';
  onClose: () => void;
}

export function LegalModal({ type, onClose }: LegalModalProps) {
  const getContent = () => {
    switch (type) {
      case 'privacidad':
        return {
          title: 'Política de Privacidad',
          icon: <Shield className="w-5 h-5 text-[#18B68B]" />,
          text: (
            <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
              <p><strong>Dominio Oficial:</strong> https://elbarrio.lat</p>
              <h4 className="font-bold text-slate-900 text-base">1. Protección de tu Ubicación Exacta</h4>
              <p>En El Barrio entendemos la importancia crítica del resguardo del hogar. Tu dirección exacta de residencia NUNCA será visible públicamente para otros usuarios o comercios. El sistema solo proyectará una aproximación por cuadrante o radio de cercanía (ej: "A 250 metros").</p>
              <h4 className="font-bold text-slate-900 text-base">2. Datos Recopilados</h4>
              <p>Solo solicitamos tu nombre, correo electrónico, teléfono de contacto y comuna para fines de verificación de residencia y coordinación de la lista de apertura comunitaria.</p>
              <h4 className="font-bold text-slate-900 text-base">3. Uso de la Información</h4>
              <p>Tus datos no serán vendidos, comercializados ni cedidos a empresas de publicidad masiva. Serán utilizados estrictamente para notificarte sobre la activación de tu barrio y permitir la interacción entre vecinos verificados.</p>
            </div>
          )
        };
      case 'terminos':
        return {
          title: 'Términos y Condiciones de Uso',
          icon: <FileText className="w-5 h-5 text-[#18B68B]" />,
          text: (
            <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
              <h4 className="font-bold text-slate-900 text-base">1. Transacciones y Pagos Directos</h4>
              <p>El Barrio no es una pasarela de pago ni procesador financiero. Los acuerdos de compra, venta, regalo, arriendo de herramientas o contratación de servicios se convienen y liquidan de forma directa entre los usuarios en persona o por transferencia privada.</p>
              <h4 className="font-bold text-slate-900 text-base">2. Responsabilidad sobre los Acuerdos</h4>
              <p>El Barrio facilita la plataforma de contacto e insignias de reputación, pero no se responsabiliza por el estado de los objetos usados o desacuerdos comerciales entre particulares.</p>
              <h4 className="font-bold text-slate-900 text-base">3. Verificación de Identidad</h4>
              <p>Para mantener los permisos activos en la red, los usuarios deben cumplir con el proceso de verificación exigido para su sector.</p>
            </div>
          )
        };
      case 'normas':
        return {
          title: 'Normas de la Comunidad El Barrio',
          icon: <HeartHandshake className="w-5 h-5 text-[#18B68B]" />,
          text: (
            <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
              <h4 className="font-bold text-slate-900 text-base">1. Respeto y Buena Convivencia</h4>
              <p>El Barrio es un espacio de encuentro positivo. Queda estrictamente prohibido el uso de lenguaje de odio, acoso, discriminación o difamación entre vecinos.</p>
              <h4 className="font-bold text-slate-900 text-base">2. Prohibición de Spam</h4>
              <p>No se permite el envío de publicidad repetitiva no solicitada ni la publicación de artículos prohibidos por ley.</p>
              <h4 className="font-bold text-slate-900 text-base">3. Alertas Responsables</h4>
              <p>Las alertas de seguridad o emergencia deben emitirse con responsabilidad y veracidad comprobable. Las falsas alarmas conllevan la suspensión inmediata de la cuenta.</p>
            </div>
          )
        };
    }
  };

  const content = getContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[85vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50">
              {content.icon}
            </div>
            <h3 className="font-extrabold text-slate-900 text-xl">{content.title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 pr-2">
          {content.text}
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
