import React, { useState } from 'react';
import { Search, ShoppingCart, Info, Flame, Leaf, Award } from 'lucide-react';
import { Dish, OrderItem } from '../types';

interface MenuProps {
  dishes: Dish[];
  cart: OrderItem[];
  onAddToCart: (dish: Dish, quantity: number) => void;
  onNavigateToCart: () => void;
}

const CATEGORIES = [
  { id: 'todos', label: 'Todo el Menú' },
  { id: 'entradas', label: 'Entradas' },
  { id: 'fuertes', label: 'Platos Fuertes' },
  { id: 'bebidas', label: 'Bebidas' },
  { id: 'postres', label: 'Postres / Dulces' },
];

export default function Menu({ dishes, cart, onAddToCart, onNavigateToCart }: MenuProps) {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // format Colombian Pesos
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price) + ' COP';
  };

  // Filter conditions
  const filteredDishes = dishes.filter((dish) => {
    const matchesCategory = selectedCategory === 'todos' || dish.category === selectedCategory;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      dish.name.toLowerCase().includes(searchLower) ||
      dish.description.toLowerCase().includes(searchLower) ||
      dish.tags?.some(tag => tag.toLowerCase().includes(searchLower));
    
    return matchesCategory && matchesSearch;
  });

  const getTagIcon = (tag: string) => {
    const lower = tag.toLowerCase();
    if (lower.includes('veggie') || lower.includes('vegetariano') || lower.includes('fresco')) {
      return <Leaf size={11} className="text-emerald-400 inline mr-1" />;
    }
    if (lower.includes('picante')) {
      return <Flame size={11} className="text-red-400 inline mr-1 animate-pulse" />;
    }
    if (lower.includes('especialidad') || lower.includes('estrella') || lower.includes('recomendado')) {
      return <Award size={11} className="text-editorial-gold inline mr-1" />;
    }
    return null;
  };

  return (
    <section className="bg-editorial-bg border-t border-editorial-border text-editorial-cream py-16 px-6" id="menu-catalog-section">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12" id="menu-header">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold block mb-2">Carta Digital de Selección</span>
          <h2 className="font-serif italic text-4xl sm:text-5xl text-editorial-cream tracking-tight">
            Nuestra Carta & Tienda Online
          </h2>
          <p className="font-serif italic text-editorial-cream/60 mt-3 text-sm max-w-xl mx-auto">
            Disfruta en nuestro restaurante colonial o recíbelo directamente en tu mesa o puerta en Bogotá. Precios transparentes con IVA e impuesto al consumo.
          </p>
        </div>

        {/* Search & Filter bar container */}
        <div className="flex flex-col md:flex-row items-stretch md:items-end justify-between gap-6 mb-12 border-b border-editorial-border pb-6" id="menu-controls">
          
          {/* Category tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none" id="category-tabs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                id={`cat-button-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-sm text-[10px] uppercase tracking-widest font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  selectedCategory === cat.id
                    ? 'bg-editorial-gold text-editorial-bg border-editorial-gold font-bold'
                    : 'bg-editorial-slate/50 text-editorial-cream/70 border-editorial-cream/10 hover:border-editorial-cream/30 hover:text-editorial-cream'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input Widget */}
          <div className="relative w-full md:max-w-xs" id="menu-search-wrapper">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-editorial-cream/40 pointer-events-none">
              <Search size={14} />
            </span>
            <input
              type="text"
              id="dish-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar un plato, ingrediente..."
              className="w-full pl-9 pr-4 py-2.5 bg-editorial-slate/60 text-editorial-cream border border-editorial-border rounded-sm text-xs font-sans focus:outline-none focus:border-editorial-gold"
            />
          </div>
        </div>

        {/* Dynamic Food Grid */}
        {filteredDishes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="dishes-cards-grid">
            {filteredDishes.map((dish) => {
              const inCartQty = cart.find(item => item.dishId === dish.id)?.quantity || 0;
              return (
                <div 
                  key={dish.id} 
                  id={`dish-card-${dish.id}`}
                  className="bg-editorial-slate/40 rounded-sm border border-editorial-border hover:border-editorial-gold/30 overflow-hidden transition-all group flex flex-col h-full"
                >
                  {/* Dish visual thumbnail */}
                  <div className="relative h-56 overflow-hidden bg-editorial-dark border-b border-editorial-border-light">
                    <img 
                      src={dish.image} 
                      alt={dish.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    
                    {!dish.available && (
                      <div className="absolute inset-0 bg-editorial-dark/90 backdrop-blur-xs flex items-center justify-center">
                        <span className="border border-red-500 text-red-500 font-sans text-[10px] uppercase font-bold px-3 py-1.5 tracking-wider rounded-sm bg-red-500/10">
                          Agotado Temporalmente
                        </span>
                      </div>
                    )}

                    <div className="absolute top-3 right-3 flex flex-wrap gap-1">
                      {dish.tags?.map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="bg-editorial-dark/90 text-editorial-gold text-[9px] font-sans font-semibold tracking-wider uppercase px-2 py-1 rounded-sm border border-editorial-border"
                        >
                          {getTagIcon(tag)}
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Content body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-serif italic text-lg sm:text-xl text-editorial-cream group-hover:text-editorial-gold transition-colors leading-tight">
                          {dish.name}
                        </h3>
                        <span className="font-serif italic text-base text-editorial-gold text-right whitespace-nowrap">
                          {formatPrice(dish.price)}
                        </span>
                      </div>
                      <p className="font-sans text-xs text-editorial-cream/70 leading-relaxed mt-2 mb-6">
                        {dish.description}
                      </p>
                    </div>

                    {/* Card Footer interaction button */}
                    <div className="pt-4 border-t border-editorial-border-light flex items-center justify-between gap-2 mt-auto">
                      <span className="text-[10px] text-editorial-cream/40 font-mono">
                        REF {dish.id.toUpperCase()}
                      </span>
                      
                      {dish.available ? (
                        <div className="flex items-center gap-2">
                          {inCartQty > 0 && (
                            <span className="text-editorial-gold text-[9px] font-sans font-bold uppercase tracking-wider bg-editorial-gold/10 px-2 py-1 rounded-sm border border-editorial-gold/20">
                              {inCartQty} activo
                            </span>
                          )}
                          <button
                            id={`add-to-cart-btn-${dish.id}`}
                            onClick={() => onAddToCart(dish, 1)}
                            className="bg-editorial-gold hover:bg-editorial-gold-dark text-editorial-bg px-4 py-2 rounded-sm text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                          >
                            <ShoppingCart size={12} />
                            <span>Ordenar</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          disabled
                          className="bg-editorial-slate/50 text-editorial-cream/30 border border-editorial-border-light px-4 py-2 rounded-sm text-[10px] uppercase tracking-wider font-medium cursor-not-allowed"
                        >
                          No Disponible
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-editorial-slate/20 rounded-sm border border-editorial-border mt-6 animate-fade-in" id="no-dishes-state">
            <Info className="mx-auto text-editorial-gold mb-2" size={28} />
            <p className="text-sm font-sans text-editorial-cream/80">No encontramos platos que coincidan con tu búsqueda.</p>
            <p className="text-xs font-sans text-editorial-cream/40 mt-1">Intenta ajustando los filtros o escribiendo otra palabra.</p>
          </div>
        )}

        {/* Dynamic bottom CTA button if cart is not empty */}
        {cart.length > 0 && (
          <div className="fixed bottom-6 right-6 z-30" id="floating-cart-anchor">
            <button
              id="view-cart-floating-btn"
              onClick={onNavigateToCart}
              className="bg-editorial-gold hover:bg-editorial-gold-dark text-editorial-bg px-6 py-4 rounded-sm font-sans font-bold text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <ShoppingCart size={14} />
              <span>Ver Pedido ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
