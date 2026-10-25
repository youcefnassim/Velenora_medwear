import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/context';
import { MapPin, Phone, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useI18n();

  return (
    <footer className="bg-velenora-navy text-velenora-ivory pt-16 pb-12 border-t border-velenora-navy-light no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info & Vision (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.jpg"
                alt="Velenora Medical Wear"
                className="w-10 h-10 rounded-full object-cover shadow-sm border border-amber-300/40"
              />
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                VELENORA
              </span>
            </div>
            <p className="text-xs text-velenora-ivory/80 leading-relaxed pr-6">
              {t.footer.about}
            </p>
            <p className="text-xs font-serif italic text-velenora-teal-light">
              “{t.brand.tagline}”
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-velenora-teal-light">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs text-velenora-ivory/80">
              <li>
                <Link to="/catalog" className="hover:text-white transition">
                  {t.nav.shop}
                </Link>
              </li>
              <li>
                <Link to="/customizer" className="hover:text-white transition">
                  {t.nav.customizer}
                </Link>
              </li>
              <li>
                <Link to="/story" className="hover:text-white transition">
                  {t.nav.story}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal and Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-velenora-teal-light">
              {t.footer.legal}
            </h4>
            <ul className="space-y-2 text-xs text-velenora-ivory/80">
              <li>
                <Link to="/terms" className="hover:text-white transition">
                  {t.footer.terms}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition">
                  {t.footer.privacy}
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-white transition">
                  {t.footer.shippingPolicy}
                </Link>
              </li>
              <li>
                <span className="text-velenora-ivory/60">Confection personnalisée certifiée</span>
              </li>
            </ul>
          </div>

          {/* Contact Details in Algeria */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-velenora-teal-light">
              Atelier & Contact
            </h4>
            <ul className="space-y-2.5 text-xs text-velenora-ivory/80">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-velenora-teal-light shrink-0 mt-0.5" />
                <span>Alger, Algérie • Livraison assurée sur les 58 wilayas</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-velenora-teal-light shrink-0" />
                <span dir="ltr">+213 (0) 550 12 34 56</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-velenora-teal-light shrink-0" />
                <span>contact@velenora.com</span>
              </li>
            </ul>

            {/* Social Icons SVG */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-velenora-teal transition text-white"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-velenora-teal transition text-white"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-velenora-ivory/60 gap-4">
          <p>© 2026 Velenora Med Wear. Tous droits réservés.</p>
          <p className="text-xs font-semibold text-velenora-teal-light tracking-wide">
            designed by Velenora Med Wear 2026
          </p>
          <p className="flex items-center gap-2">
            <span>Paiement à la livraison (58 Wilayas)</span>
            <span>•</span>
            <span>Made with precision in Algeria</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
