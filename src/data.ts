import { Dish, Review, RestaurantConfig } from './types';

export const INITIAL_DISHES: Dish[] = [
  {
    id: '1',
    name: 'Empanadas de Ajiaco',
    description: 'Tres crocantes empanadas de maíz rellenas con el tradicional guiso de ajiaco (pollo y papa criolla), acompañadas de nuestra salsa artesanal de ají de aguacate.',
    price: 18000,
    category: 'entradas',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    available: true,
    tags: ['Especialidad', 'Picante Suave', 'Tradición']
  },
  {
    id: '2',
    name: 'Ceviche de Trucha de Tota',
    description: 'Trucha fresca de la Laguna de Tota marinada en cítricos andinos, dados de mango maduro, cebolla roja, cilantro fresco y acompañada de crujientes patacones de plátano verde.',
    price: 24000,
    category: 'entradas',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    available: true,
    tags: ['Fresco', 'Citrico', 'Boyacá']
  },
  {
    id: '3',
    name: 'Chicharrones en Melao de Panela',
    description: 'Crocantes dados de tocino glaseados en melao de panela anisada con clavo de olor, acompañados de tiernas mini arepas boyacenses asadas.',
    price: 22000,
    category: 'entradas',
    image: 'https://images.unsplash.com/photo-1594950195709-a14f66c242d7?w=600&auto=format&fit=crop&q=80',
    available: true,
    tags: ['Crocante', 'Dulce y Salado']
  },
  {
    id: '4',
    name: 'Ajiaco Santafereño Premium',
    description: 'Sopa insignia de Bogotá elaborada con tres variedades de papas nativas, pollo campesino desmechado, mazorca tierna, acompañada de crema de leche fresca, alcaparras selectas y aguacate regional.',
    price: 38000,
    category: 'fuertes',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80',
    available: true,
    tags: ['Especialidad', 'Bogotano', 'Familiar']
  },
  {
    id: '5',
    name: 'Posta Negra sobre Puré de Mote',
    description: 'Posta de res cocida lentamente en reducción espesa de panela, especias y cola de la casa. Servida sobre un cremoso puré de mote de queso caribeño y finos chips de yuca frita.',
    price: 48000,
    category: 'fuertes',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    available: true,
    tags: ['Recomendado', 'Fusión', 'Atractivo']
  },
  {
    id: '6',
    name: 'Salmón en Costra de Quinua',
    description: 'Filete de salmón fresco con costra crujiente de quinua tostada de la sabana, servido sobre puré rústico de arracacha y vegetales orgánicos salteados al wok.',
    price: 52000,
    category: 'fuertes',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop&q=80',
    available: true,
    tags: ['Nutritivo', 'Estrella', 'Costra']
  },
  {
    id: '7',
    name: 'Risotto de Champiñones del Sumapaz',
    description: 'Arroz arborio cremoso preparado con setas, portobellos y setas ostra recolectadas en el Páramo de Sumapaz, queso doblecrema artesanal y un toque aromático de aceite de trufa.',
    price: 44000,
    category: 'fuertes',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&auto=format&fit=crop&q=80',
    available: true,
    tags: ['Vegetariano', 'Cremoso', 'Setas']
  },
  {
    id: '8',
    name: 'Limonada de Coco Monserrate',
    description: 'Cremosa limonada elaborada con crema de coco natural batida con zumo de limones frescos de Villeta y hielo frappé.',
    price: 12000,
    category: 'bebidas',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
    available: true,
    tags: ['Fresco', 'Sin Alcohol', 'Favorito']
  },
  {
    id: '9',
    name: 'Refajo de la Casa Astado',
    description: 'Nuestra combinación tradicional de cerveza artesanal rubia premium de Bogotá y gaseosa Kola Román con toques de naranja confitada y clavo de olor.',
    price: 10000,
    category: 'bebidas',
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600&auto=format&fit=crop&q=80',
    available: true,
    tags: ['Tradicional', 'Refrescante', 'Ligeramente Alcohólico']
  },
  {
    id: '10',
    name: 'Volcán de Arequipe con Helado de Cuajada',
    description: 'Volcán de bizcocho tibio relleno de arequipe santafereño fundido y fluido, servido con helado artesanal de queso cuajada bogotana.',
    price: 16000,
    category: 'postres',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80',
    available: true,
    tags: ['Dulce', 'Caliente y Frío', 'Inolvidable']
  },
  {
    id: '11',
    name: 'Milhoja de Sabana con Fresas',
    description: 'Finas y crujientes capas de hojaldre artesanal rellenas de crema pastelera ligera aromatizada con vainilla y fresas frescas de la Sabana de Bogotá.',
    price: 14000,
    category: 'postres',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&auto=format&fit=crop&q=80',
    available: true,
    tags: ['Crujiente', 'Clásico']
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'review-1',
    name: 'Alejandro Restrepo',
    rating: 5,
    comment: '¡Una experiencia insuperable! El ajiaco santafereño es el mejor que he probado en Bogotá. El ambiente colonial de La Candelaria y la música de fondo te transportan. Recomiendo reservar antes.',
    date: '15 de Mayo de 2026'
  },
  {
    id: 'review-2',
    name: 'María Camila Castro',
    rating: 5,
    comment: 'Increíble propuesta de cocina fusión. Chicharrones en melao de panela espectaculares y servicio inmejorable. El asistente del sitio web me ayudó a reservar en Segundos y me aclaró las dudas de intolerancias alimenticias.',
    date: '10 de Mayo de 2026'
  },
  {
    id: 'review-3',
    name: 'Carlos Mendoza',
    rating: 4,
    comment: 'Muy buena comida, precios honestos e información de procedencia clara, excelente para verificar y saber qué comes. Pedimos a domicilio el salmón en costra de quinua y llegó caliente y perfecto.',
    date: '02 de Mayo de 2026'
  }
];

export const INITIAL_CONFIG: RestaurantConfig = {
  name: 'Monserrate Bistro',
  slogan: 'Sabores Ancestrales, Técnicas Contemporáneas',
  address: 'Calle 11 # 2-15, Centro Histórico La Candelaria, Bogotá, Colombia',
  whatsapp: '+57 321 987 6543',
  email: 'reservas@monserratebistro.com',
  phone: '+57 (1) 345-6789',
  schedule: 'Lunes a Sábado: 12:00 PM - 10:00 PM | Domingos y Festivos: 12:00 PM - 6:00 PM',
  instagram: 'https://instagram.com/monserratebistrobog',
  facebook: 'https://facebook.com/monserratebistrobog',
  tripadvisor: 'https://tripadvisor.com/monserratebistrobog',
  alertBanner: '🎉 ¡Celebra con nosotros! Reserva en línea para tus eventos especiales y obtén una copa de bienvenida de cortesía.'
};
