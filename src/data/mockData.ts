import { FAQItem, LocalBusiness, NeighborhoodPost, SiteAnalytics, WaitlistEntry } from '../types';

export const CHILEAN_COMMUNES = [
  'Las Condes',
  'Providencia',
  'Vitacura',
  'Lo Barnechea',
  'La Reina',
  'Santiago Centro',
  'Ñuñoa',
  'La Florida',
  'Maipú',
  'San Miguel',
  'Macul',
  'Peñalolén',
  'Quilicura',
  'Pudahuel',
  'Viña del Mar',
  'Concepción',
  'Valparaíso',
  'Temuco',
  'Antofagasta',
  'Otra comuna'
];

export const INITIAL_POSTS: NeighborhoodPost[] = [
  {
    id: 'post-1',
    author: {
      name: 'Carlos Mendoza',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      commune: 'Las Condes',
      verified: true,
      badge: 'Vecino Activo',
      reputation: 4.9,
    },
    type: 'arriendo',
    title: 'Arriendo cortadora de césped eléctrica para el fin de semana',
    description: 'En perfecto estado con extensión de 15m. Sin pago en la app, nos coordinamos directamente por chat.',
    price: '$5.000 / día',
    distance: 'A 250m de ti',
    timeAgo: 'Hace 15 min',
    likes: 12,
    commentsCount: 4,
    tags: ['Herramientas', 'Jardín'],
    image: '/landing-media/barrio-comunidad.jpg',
  },
  {
    id: 'post-2',
    author: {
      name: 'María Paz Silva',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      commune: 'Las Condes',
      verified: true,
      badge: 'Vecino Fundador',
      reputation: 5.0,
    },
    type: 'regalo',
    title: 'Regalo 4 maceteros de greda y suculentas para balcón',
    description: 'Remodelé la terraza y me quedaron estos maceteros impecables. Quien los necesite viene a buscar.',
    price: '¡Gratis!',
    distance: 'A 180m de ti',
    timeAgo: 'Hace 42 min',
    likes: 24,
    commentsCount: 8,
    tags: ['Regalo', 'Plantas'],
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'post-3',
    author: {
      name: 'Don José (Panadería Tradición)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      commune: 'Las Condes',
      verified: true,
      badge: 'Comercio Destacado',
      reputation: 4.9,
    },
    type: 'comercio',
    title: '🥐 Promo Vecinal: 20% dcto en empanadas de pino y queso',
    description: 'Solo mostrando tu app El Barrio en caja. Recién saliditas del horno a las 18:30 hrs.',
    price: 'Promoción Local',
    distance: 'A 400m de ti',
    timeAgo: 'Hace 1 hora',
    likes: 45,
    commentsCount: 11,
    tags: ['Panadería', 'Oferta'],
    image: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'post-4',
    author: {
      name: 'Felipe Arancibia',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      commune: 'Las Condes',
      verified: true,
      badge: 'Vecino Verificado',
      reputation: 4.8,
    },
    type: 'ayuda',
    title: '¿Alguien conoce un gasfiter o técnico de calefón confiable por la zona?',
    description: 'Se apagó el piloto esta mañana. Agradezco datos de profesionales con buenas recomendaciones de vecinos.',
    distance: 'A 320m de ti',
    timeAgo: 'Hace 2 horas',
    likes: 9,
    commentsCount: 15,
    tags: ['Datos', 'Hogar'],
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'post-5',
    author: {
      name: 'Alerta Vecinal Cuadrante 4',
      avatar: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=150&q=80',
      commune: 'Las Condes',
      verified: true,
      badge: 'Moderación Territorial',
      reputation: 5.0,
    },
    type: 'alerta',
    title: '⚠️ Corte programado de agua potable mañana de 14:00 a 18:00',
    description: 'Afectará sector entre Av. Manquehue y Av. Apoquindo. Junten agua limpia con anticipación.',
    distance: 'En tu cuadrante',
    timeAgo: 'Hace 3 horas',
    likes: 88,
    commentsCount: 22,
    urgent: true,
    tags: ['Alerta', 'Servicio Básico'],
    image: 'https://images.unsplash.com/photo-1584727638096-042c45049ebe?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'post-6',
    author: {
      name: 'Verónica Gómez',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      commune: 'Las Condes',
      verified: true,
      badge: 'Técnico Vecinal',
      reputation: 5.0,
    },
    type: 'servicio',
    title: 'Servicio de mantención y reparación de bicicletas a domicilio',
    description: 'Soy vecina del sector El Golf. Ajuste de frenos, cambios y parchado rápido sin salir del barrio.',
    price: 'Desde $8.000',
    distance: 'A 500m de ti',
    timeAgo: 'Hace 4 horas',
    likes: 31,
    commentsCount: 9,
    tags: ['Servicio', 'Ciclismo'],
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
  }
];

export const MOCK_BUSINESSES: LocalBusiness[] = [
  {
    id: 'b-1',
    name: 'Cafetería & Pastelería La Esquina',
    category: 'Gastronomía Local',
    owner: 'Camila & Esteban',
    commune: 'Las Condes',
    addressApprox: 'Av. Apoquindo con El Golf',
    avatar: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=120&q=80',
    coverImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    discount: '15% de descuento para vecinos del cuadrante',
    description: 'Café de especialidad y bollería francesa horneada cada mañana.',
    verified: true,
    whatsapp: '+56912345678',
    rating: 4.9,
    reviewsCount: 38
  },
  {
    id: 'b-2',
    name: 'Almacén Don Lucho & Verdulería',
    category: 'Minimarket & Abarrotes',
    owner: 'Luis Morales',
    commune: 'Las Condes',
    addressApprox: 'Plaza Perú',
    avatar: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&q=80',
    coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    discount: 'Reparto a pie sin costo dentro de 500m',
    description: 'Frutas y verduras frescas seleccionadas a diario en La Vega.',
    verified: true,
    whatsapp: '+56923456789',
    rating: 4.8,
    reviewsCount: 52
  },
  {
    id: 'b-3',
    name: 'Taller Bicicletas Barrio Urbano',
    category: 'Servicios & Reparación',
    owner: 'Matías Rivas',
    commune: 'Las Condes',
    addressApprox: 'Av. Las Condes con Manquehue',
    avatar: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=120&q=80',
    coverImage: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=600&q=80',
    discount: 'Chequeo preventivo de presión y frenos gratis',
    description: 'Servicio técnico especializado en bicicletas de ruta, mtb y urbanas.',
    verified: true,
    whatsapp: '+56934567890',
    rating: 5.0,
    reviewsCount: 29
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    question: '¿Qué es El Barrio y en qué se diferencia de un grupo de redes sociales?',
    answer: 'El Barrio es una aplicación móvil diseñada exclusivamente para la vida hiperlocal cotidiana. A diferencia de redes abiertas o grupos masivos ruidosos, El Barrio delimita tu comunidad por cuadrantes territoriales reales, exige verificación de vecinos y reúne en un solo lugar compras, arriendos, trueques, favores, comercios del barrio y alertas sin algoritmo ni spam.'
  },
  {
    id: 'faq-2',
    category: 'seguridad',
    question: '¿Quién puede registrarse y cómo se verifica a los vecinos?',
    answer: 'El registro está abierto a personas que residen, trabajan o tienen un negocio en el sector. Para acceder al cuadrante residencial completo, cada usuario valida su ubicación aproximada para certificar que realmente es parte de la zona comunitaria.'
  },
  {
    id: 'faq-3',
    category: 'general',
    question: '¿La aplicación procesa pagos o cobra comisiones entre vecinos?',
    answer: 'No. El Barrio no retiene pagos ni cobra comisión por préstamos, arriendos o compras entre vecinos. La plataforma funciona como el punto de encuentro vecinal para coordinar y acordar el trato directamente entre personas del mismo sector.'
  },
  {
    id: 'faq-4',
    category: 'seguridad',
    question: '¿Cómo se protege mi dirección exacta y privacidad?',
    answer: 'Tu dirección exacta, número de depto o casa nunca se hace pública. En las publicaciones solo se muestra tu nombre de pila, una distancia aproximada (ej. "a 300m de ti") y tu cuadrante comunal.'
  },
  {
    id: 'faq-5',
    category: 'comercios',
    question: '¿Cómo pueden participar los almacenes, locales y prestadores de servicios?',
    answer: 'Los comercios y profesionales locales pueden crear su perfil de negocio para ofrecer promociones exclusivas para vecinos del sector, publicar horarios y recibir pedidos directos por WhatsApp.'
  },
  {
    id: 'faq-6',
    category: 'general',
    question: '¿Cuándo se habilita la aplicación en mi sector?',
    answer: 'Abrimos cuadrantes progresivamente. Los sectores con mayor número de personas registradas en la lista de espera se activan primero. Al registrarte te notificamos de inmediato el día de lanzamiento oficial de tu cuadrante.'
  }
];

export const INITIAL_ANALYTICS: SiteAnalytics = {
  activeVisitors: 348,
  dailyVisits: 1420,
  totalVisits: 8930,
  uniqueVisitors: 6420,
  topPages: [
    { path: '/', visits: 5410 },
    { path: '#registro', visits: 2320 },
    { path: '#comercios', visits: 1200 }
  ],
  visitorSources: [
    { source: 'WhatsApp Directo', percentage: 48 },
    { source: 'Búsqueda Orgánica', percentage: 32 },
    { source: 'Recomendación Vecinal', percentage: 20 }
  ],
  pathsViewed24h: 0,
  visitsLast7: [],
  liveVisitors: [],
  recentVisitors: [],
};

export const INITIAL_WAITLIST: WaitlistEntry[] = [
  { id: 'w-1', nombre: 'Gonzalo Morales', correo: 'g.morales@example.com', whatsapp: '+56987654321', comuna: 'Las Condes', tipo_registro: 'vecino', fecha: '2026-08-25 10:14' },
  { id: 'w-2', nombre: 'Andrea Valenzuela', correo: 'andrea.v@example.com', whatsapp: '+56976543210', comuna: 'Las Condes', tipo_registro: 'comercio', nombreNegocio: 'Café de Barrio', rubro: 'Cafetería', fecha: '2026-08-25 11:20' },
  { id: 'w-3', nombre: 'Rodrigo Fuentes', correo: 'r.fuentes@example.com', whatsapp: '+56965432109', comuna: 'Las Condes', tipo_registro: 'servicio', rubro: 'Gasfitería certificada SEC', fecha: '2026-08-25 12:05' },
  { id: 'w-4', nombre: 'Marcela Castillo', correo: 'marcela.c@example.com', whatsapp: '+56954321098', comuna: 'Providencia', tipo_registro: 'vecino', fecha: '2026-08-25 13:40' },
  { id: 'w-5', nombre: 'Cristián Araya', correo: 'c.araya@example.com', whatsapp: '+56943210987', comuna: 'Vitacura', tipo_registro: 'comercio', nombreNegocio: 'Panadería La Barra', rubro: 'Panadería', fecha: '2026-08-25 14:15' }
];

export const INITIAL_REGISTRATIONS = INITIAL_WAITLIST;
