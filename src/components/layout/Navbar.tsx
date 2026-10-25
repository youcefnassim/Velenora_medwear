import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../../i18n/context';
import { useCart } from '../../features/cart/context/CartContext';
import { ShoppingBag, Search, User, Menu, X, Globe, PhoneCall } from 'lucide-react';
import type { Language } from '../../i18n/translations';

export const Navbar: React.FC = () => {
  const { language, setLanguage, isRtl } = useI18n();
  const { itemCount } = useCart();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#E1E5E8] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Brand Logo & Subtitle */}
          <Link to="/" className="flex items-center gap-2 group py-1 shrink-0">
            <img
              src="/logo.jpg"
              alt="Velenora Medical Wear"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover shadow-sm border border-amber-300/30 group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#10263B] leading-tight">
                VELENORA
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.22em] sm:tracking-[0.26em] font-semibold text-[#667586] uppercase">
                MEDWEAR
              </span>
            </div>
          </Link>

          {/* Centered Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs sm:text-sm font-medium text-[#10263B]">
            <Link
              to="/catalog"
              className={`pb-1 transition hover:text-[#087A83] ${
                isActive('/catalog') ? 'font-semibold text-[#142C46] border-b-2 border-[#142C46]' : ''
              }`}
            >
              Boutique
            </Link>

            <Link
              to="/customizer"
              className={`pb-1 transition hover:text-[#087A83] ${
                isActive('/customizer') ? 'font-semibold text-[#142C46] border-b-2 border-[#142C46]' : ''
              }`}
            >
              Personnaliser en 3D
            </Link>

            <Link
              to="/catalog"
              className="pb-1 transition hover:text-[#087A83]"
            >
              Collections
            </Link>

            <Link
              to="/story"
              className={`pb-1 transition hover:text-[#087A83] ${
                isActive('/story') ? 'font-semibold text-[#142C46] border-b-2 border-[#142C46]' : ''
              }`}
            >
              Notre histoire
            </Link>

            <button
              type="button"
              onClick={() => setContactOpen(true)}
              className="pb-1 transition hover:text-[#087A83]"
            >
              Contact
            </button>
          </nav>

          {/* Right Header Actions: Search, Account, Cart, Language, Mobile */}
          <div className="flex items-center gap-1 sm:gap-2.5">
            {/* Search Icon */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="p-1.5 sm:p-2 text-[#10263B] hover:text-[#087A83] rounded-lg transition"
              aria-label="Rechercher"
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>

            {/* Account Icon */}
            <button
              type="button"
              onClick={() => setAccountOpen(true)}
              className="p-1.5 sm:p-2 text-[#10263B] hover:text-[#087A83] rounded-lg transition"
              aria-label="Mon Compte"
            >
              <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#10263B] border border-[#E1E5E8] hover:bg-[#F1F2F3] transition"
                aria-label="Changer de langue"
              >
                <Globe className="w-3.5 h-3.5 text-[#087A83]" />
                <span className="uppercase">{language}</span>
              </button>

              {langMenuOpen && (
                <div className={`absolute top-full mt-2 w-32 bg-white rounded-xl shadow-lg border border-[#E1E5E8] py-1.5 z-50 ${isRtl ? 'left-0' : 'right-0'}`}>
                  {(['fr', 'en', 'ar'] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        setLanguage(lang as Language);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-1.5 text-xs transition flex items-center justify-between ${
                        language === lang ? 'text-[#087A83] font-bold bg-[#F1F2F3]' : 'text-[#10263B] hover:bg-[#F1F2F3]'
                      }`}
                    >
                      <span>{lang === 'fr' ? 'Français' : lang === 'en' ? 'English' : 'العربية'}</span>
                      {language === lang && <span className="w-1.5 h-1.5 rounded-full bg-[#087A83]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Shopping Cart Icon with Quantity Badge */}
            <Link
              to="/cart"
              className="relative p-2 text-[#10263B] hover:text-[#087A83] transition"
              aria-label="Panier"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#142C46] text-white rounded-full text-[11px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#10263B] hover:bg-[#F1F2F3] rounded-lg transition"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E1E5E8] bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#10263B] border-b border-[#E1E5E8]"
          >
            Boutique
          </Link>
          <Link
            to="/customizer"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-[#142C46] border-b border-[#E1E5E8]"
          >
            Personnaliser en 3D
          </Link>
          <Link
            to="/catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#10263B] border-b border-[#E1E5E8]"
          >
            Collections
          </Link>
          <Link
            to="/story"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#10263B] border-b border-[#E1E5E8]"
          >
            Notre histoire
          </Link>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setContactOpen(true);
            }}
            className="block w-full text-left py-2 text-sm font-semibold text-[#10263B]"
          >
            Contact
          </button>
        </div>
      )}

      {/* Quick Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm pt-20 px-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E1E5E8] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E5E8]">
              <h3 className="text-sm font-bold text-[#10263B]">Recherche Velenora</h3>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-[#667586] hover:text-[#10263B] font-bold text-sm"
              >
                ✕
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-[#667586]" />
              <input
                type="text"
                autoFocus
                placeholder="Rechercher une blouse, pantalon, col..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-[#E1E5E8] focus:outline-none focus:ring-2 focus:ring-[#087A83]"
              />
            </div>
            <div className="text-xs text-[#667586]">
              Recherches fréquentes : <span className="text-[#087A83] font-semibold cursor-pointer">Ensemble Signature</span>, <span className="text-[#087A83] font-semibold cursor-pointer">Col Officier</span>, <span className="text-[#087A83] font-semibold cursor-pointer">Pantalon Jogger</span>
            </div>
          </div>
        </div>
      )}

      {/* Account Info Modal */}
      {accountOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#E1E5E8] space-y-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#F1F2F3] flex items-center justify-center text-[#10263B]">
              <User className="w-6 h-6" />
            </div>
            <h3 className="text-base font-serif font-bold text-[#10263B]">
              Espace Professionnel Santé
            </h3>
            <p className="text-xs text-[#667586]">
              Retrouvez vos designs sur-mesure enregistrés, l’historique de vos commandes et vos fiches d'atelier.
            </p>
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => setAccountOpen(false)}
                className="w-full py-2.5 bg-[#142C46] text-white text-xs font-semibold rounded-xl hover:bg-[#10263B] transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {contactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E1E5E8] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E5E8]">
              <h3 className="text-sm font-bold text-[#10263B] flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#087A83]" />
                <span>Contacter l'Atelier Velenora</span>
              </h3>
              <button
                type="button"
                onClick={() => setContactOpen(false)}
                className="text-[#667586] hover:text-[#10263B] font-bold text-sm"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#667586]">
              Notre équipe d'atelier et de stylisme médical vous accompagne dans vos commandes personnalisées et pour les commandes de cliniques.
            </p>
            <div className="p-3.5 bg-[#F1F2F3] rounded-xl space-y-2 text-xs text-[#10263B]">
              <p><b>Téléphone & WhatsApp :</b> <span dir="ltr">+213 (0) 550 12 34 56</span></p>
              <p><b>Email :</b> contact@velenora.com</p>
              <p><b>Horaires d'ouverture :</b> Samedi au Jeudi, 8h30 - 17h30</p>
              <p><b>Siège & Atelier :</b> Alger, Algérie</p>
            </div>
            <button
              type="button"
              onClick={() => setContactOpen(false)}
              className="w-full py-2.5 bg-[#142C46] text-white text-xs font-semibold rounded-xl"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
