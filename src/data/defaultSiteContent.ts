import { SiteContent } from '../types';
import { INITIAL_POSTS, MOCK_BUSINESSES, FAQ_ITEMS } from './mockData';

export const DEFAULT_SITE_CONTENT: SiteContent = {
  branding: {
    appName: 'El Barrio',
    slogan: 'Super-app hiperlocal para comunidades y comercios de barrio',
    customLogoUrl: '',
    customIsotypeUrl: '',
    primaryColor: '#18B68B',
    supportEmail: 'contacto@elbarrio.lat',
    supportWhatsapp: '+56912345678',
    officialDomain: 'https://elbarrio.lat',
  },
  hero: {
    badge: 'La Super-App Hiperlocal para tu Vida Cotidiana',
    titlePart1: 'Todo lo que pasa en',
    titleHighlight: 'tu barrio',
    titlePart2: ', en la palma de tu mano.',
    description: 'Conecta con vecinos reales verificados de tu sector. Compra, vende, regala, arrienda herramientas por el fin de semana, encuentra datos de confianza y apoya al comercio local sin comisiones.',
    ctaVecino: 'Sumarme a la lista de mi sector',
    ctaComercio: 'Soy comercio o servicio local',
    communesHighlight: 'Activando cuadrantes prioritarios en Las Condes (El Golf, Plaza Perú, Manquehue, Colón y San Damián)',
    simulatorSector: 'Sector El Golf • Las Condes',
    simulatorNeighborsCount: '342 vecinos activos en tu cuadrante',
  },
  posts: INITIAL_POSTS,
  benefits: {
    badge: 'Pilares Fundamentales',
    title: 'Tres grandes beneficios en una sola aplicación',
    subtitle: 'Todo lo que necesitas para tu vida cotidiana a pasos de tu hogar.',
    benefit1: {
      tag: '01. Conecta',
      title: 'Conoce a las personas que realmente viven cerca de ti',
      description: 'El Barrio organiza la interacción por cuadrantes territoriales delimitados. Te conectas con vecinos reales de tu pasaje, edificio o manzana, fortaleciendo el tejido social de tu entorno.',
      points: [
        'Vecinos verificados mediante comprobación de residencia.',
        'Perfiles transparentes con reputación comunitaria acumulada.',
        'Redes comunitarias libres de ruido publicitario o spam masivo.'
      ],
      sampleTitle: 'Javier Valdés',
      sampleSubtitle: 'Vecino Fundador • Sector El Golf, Las Condes',
      sampleTag: '★ 5.0 reputación'
    },
    benefit2: {
      tag: '02. Resuelve',
      title: 'Mercado, arriendos, favores, regalos y servicios locales',
      description: 'Resuelve tus necesidades diarias sin salir de la zona. Encuentra desde una escalera para arrendar por el fin de semana hasta un gasfiter recomendado por tus propios vecinos.',
      points: [
        'Arriendos de objetos y herramientas: No compres lo que solo usarás una vez.',
        'Regalos y trueques: Dale segunda vida a muebles o plantas cerca.',
        'Pagos directos: 0% comisión de la app, tratos por chat directo entre personas.'
      ],
      sampleTitle: 'Escalera telescópica 3.8m',
      sampleSubtitle: 'Arriendo por día • A 200m de ti',
      samplePrice: '$4.000 / día'
    },
    benefit3: {
      tag: '03. Cuida',
      title: 'Alertas comunitarias, información territorial y prevención',
      description: 'Mantén a tu familia y vecinos informados sobre eventos de interés público, cortes de suministros, emergencias o mascotas extraviadas con prioridad de alerta.',
      points: [
        'Alertas jerarquizadas: Prioridad crítica, moderada o informativa.',
        'Moderación y filtro: Retiro inmediato de falsas alarmas o spam.',
        'Privacidad garantizada: Tu hogar resguardado en el cuadrante.'
      ],
      sampleTitle: 'Corte programado de agua potable por reparaciones',
      sampleSubtitle: 'Sector Apoquindo / Manquehue • Aviso municipal verificado',
      sampleTag: 'Confirmado por moderador'
    }
  },
  trust: {
    badge: 'Escudo de Confianza',
    title: 'Seguridad pensada para que te sientas tranquilo',
    subtitle: 'Sabemos que la confianza es la base de todo trato local. Diseñamos un entorno protegido donde sabes exactamente con quién estás hablando.',
    pillars: [
      {
        id: 'p-1',
        title: 'Vecinos Verificados',
        description: 'Proceso de validación de identidad y comprobante de residencia para asegurar que quienes interactúan realmente habiten en el sector.'
      },
      {
        id: 'p-2',
        title: 'Privacidad de Dirección Exacta',
        description: 'Tu dirección física nunca se muestra públicamente. La app solo proyecta tu cuadrante aproximado (ej: "A 200m") para resguardar tu hogar.'
      },
      {
        id: 'p-3',
        title: 'Comunidades Delimitadas',
        description: 'Redes locales acotadas por manzanas y cuadrantes reales. Evitamos los grupos masivos o caóticos con desconocidos de otras ciudades.'
      },
      {
        id: 'p-4',
        title: 'Reputación & Insignias',
        description: 'Sistema transparente de valoraciones tras cada trato o favor realizado, destacando a vecinos comprometidos y comercios honestos.'
      },
      {
        id: 'p-5',
        title: 'Moderación & Reportes',
        description: 'Herramientas de reporte en 1 clic y revisión activa 24/7. Retiro inmediato de contenido inapropiado o conducta abusiva.'
      },
      {
        id: 'p-6',
        title: 'Trazabilidad & Control',
        description: 'Registro seguro de interacciones y alertas para mantener un ambiente de convivencia sano, directo y confiable.'
      }
    ],
    transparencyTitle: 'Compromiso de Transparencia',
    transparencyText: 'El Barrio es un sistema independiente de interacción vecinal directa. Todos los tratos, coordinaciones y pagos son gestionados libremente por las personas involucradas, sin comisiones de intermediación.'
  },
  businesses: MOCK_BUSINESSES,
  localAds: {
    badge: 'Difusión Local Dirigida',
    title: 'Publicidad local hiperlocal sin desperdiciar presupuesto',
    description: 'Promociona tu marca, servicio o evento con alta visibilidad en cuadrantes específicos. Todo el contenido patrocinado está claramente identificado con transparencia comunitaria.',
    ctaButton: 'Consultar opciones de visibilidad',
    bullet1: 'Banners destacados en feed',
    bullet2: 'Posts patrocinados geolocalizados',
    bullet3: 'Filtro por cuadrante exacto'
  },
  faqs: FAQ_ITEMS,
  waitlistForm: {
    badge: 'Activación Comunitaria Territorial',
    title: 'Asegura tu cupo en el lanzamiento de tu cuadrante',
    subtitle: 'El Barrio se habilitará primero en los sectores de Las Condes con mayor cantidad de vecinos y comercios inscritos.',
    quadrantsTitle: 'ESTADO DE ACTIVACIÓN',
    quadrant1Name: 'El Golf & Plaza Perú (Las Condes)',
    quadrant1Progress: '92% de la meta vecinal alcanzada',
    quadrant2Name: 'Av. Manquehue & Apumanque',
    quadrant2Progress: '78% de la meta vecinal alcanzada',
    quadrant3Name: 'Colón Oriente & Rotonda Atenas',
    quadrant3Progress: '65% de la meta vecinal alcanzada',
    privacyText: 'Tus datos son 100% privados y solo se utilizarán para validar tu cuadrante y notificarte el día de activación oficial de tu sector.',
    btnVecino: 'Inscribirme como Vecino',
    btnComercio: 'Inscribir mi Comercio Local',
    btnServicio: 'Inscribir mi Servicio Vecinal'
  },
  footer: {
    description: 'La super-app hiperlocal para conectar con tus vecinos de a pie, comprar, vender, regalar, arrendar herramientas y enterarte de la vida de tu entorno.',
    officialDomainText: 'Dominio oficial: https://elbarrio.lat',
    supportEmail: 'contacto@elbarrio.lat',
    locationNotice: 'Santiago, Chile • Proyecto en proceso de activación comunitaria en Las Condes.',
    copyrightText: 'El Barrio (elbarrio.lat). Todos los derechos reservados.'
  }
};
