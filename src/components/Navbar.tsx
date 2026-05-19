import React, { useState } from 'react';
import { Menu, X, ShoppingCart, ShieldAlert, Settings } from 'lucide-react';
import { RestaurantConfig, OrderItem } from '../types';

interface NavbarProps {
  config: RestaurantConfig;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cart: OrderItem[];
  setCartOpen: (open: boolean) => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
}

export default function Navbar({
  config,
  activeTab,
  setActiveTab,
  cart,
  setCartOpen,
  isAdminMode,
  setIsAdminMode
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'menu', label: 'Catálogo & Tienda' },
    { id: 'reservas', label: 'Reservas' },
    { id: 'comentarios', label: 'Opiniones' },
    { id: 'contacto', label: 'Contacto & Legal' },
  ];

  const handleLinkClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full" id="site-header">
      {/* Alert / Notification Banner */}
      {config.alertBanner && (
        <div className="bg-editorial-gold text-editorial-dark text-[10px] uppercase tracking-[0.25em] text-center py-2 px-4 font-sans font-extrabold flex items-center justify-center gap-2" id="alert-banner">
          <ShieldAlert size={12} />
          <span>{config.alertBanner}</span>
        </div>
      )}

      <nav className="bg-editorial-bg/95 backdrop-blur-md border-b border-editorial-border text-editorial-cream px-6 py-4" id="navbar-container">
        <div className="max-w-7xl mx-auto flex items-end justify-between">
          
          {/* Logo & Brand Name */}
          <div 
            className="flex flex-col cursor-pointer group" 
            onClick={() => handleLinkClick('inicio')}
            id="brand-logo"
          >
            <span className="font-serif italic text-3xl sm:text-4xl tracking-tighter leading-none group-hover:text-editorial-gold transition-colors">
              {config.name}
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] mt-1.5 opacity-60">
              Bogotá, Colombia • La Candelaria
            </span>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-8 text-xs uppercase tracking-widest font-medium mb-1" id="desktop-nav-links">
            {navLinks.map((link) => (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => handleLinkClick(link.id)}
                className={`transition-colors hover:text-editorial-gold cursor-pointer relative pb-1 ${
                  activeTab === link.id ? 'text-editorial-gold font-bold' : 'text-editorial-cream/80'
                }`}
              >
                {link.label}
                {activeTab === link.id && (
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-editorial-gold"></span>
                )}
              </button>
            ))}
          </div>

          {/* Right Action Widgets */}
          <div className="flex items-center space-x-4 mb-0.5" id="right-actions-menu">
            {/* Owner Autogestion Option */}
            <button
              id="admin-toggle-btn"
              onClick={() => {
                handleLinkClick('admin');
              }}
              className={`p-2 rounded-sm transition-all cursor-pointer flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold border ${
                activeTab === 'admin'
                  ? 'bg-editorial-gold/10 border-editorial-gold text-editorial-gold'
                  : 'border-editorial-cream/20 text-editorial-cream/70 hover:text-editorial-cream hover:border-editorial-cream/40'
              }`}
              title="Panel Gestión para Administradores"
            >
              <Settings size={13} />
              <span className="hidden lg:inline">Gestión</span>
            </button>

            {/* Shopping Cart Selector */}
            <button
              id="open-cart-btn"
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-full border border-editorial-cream/10 hover:border-editorial-gold/40 text-editorial-cream/80 hover:text-editorial-gold transition-all cursor-pointer"
              title="Ver mi carrito"
            >
              <ShoppingCart size={16} />
              {totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-editorial-gold text-editorial-bg font-sans font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Mobile Hamburger menu */}
            <button
              id="mobile-drawer-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-editorial-slate text-editorial-cream/80 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-editorial-border flex flex-col space-y-3" id="mobile-nav-menu">
            {navLinks.map((link) => (
              <button
                key={link.id}
                id={`mobile-nav-link-${link.id}`}
                onClick={() => handleLinkClick(link.id)}
                className={`py-2 text-left text-xs uppercase tracking-widest font-medium transition-colors hover:text-editorial-gold ${
                  activeTab === link.id ? 'text-editorial-gold font-bold pl-2 border-l border-editorial-gold' : 'text-editorial-cream/80'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
