export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'entradas' | 'fuertes' | 'bebidas' | 'postres';
  image: string;
  available: boolean;
  tags?: string[];
}

export interface Reservation {
  id: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  guests: number;
  specialRequests: string;
  status: 'pendiente' | 'confirmada' | 'cancelada';
  createdAt: string;
}

export interface OrderItem {
  dishId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: 'efectivo' | 'transferencia' | 'tarjeta';
  notes?: string;
  status: 'pendiente' | 'preparando' | 'en_camino' | 'completado' | 'cancelado';
  createdAt: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface RestaurantConfig {
  name: string;
  slogan: string;
  address: string;
  whatsapp: string;
  email: string;
  phone: string;
  schedule: string;
  instagram: string;
  facebook: string;
  tripadvisor: string;
  alertBanner?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}
