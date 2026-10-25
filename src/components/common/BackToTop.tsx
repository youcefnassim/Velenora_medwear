import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 280) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Retour en haut"
      title="Retour en haut"
      className={`fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#10263B]/90 hover:bg-[#087A83] text-white backdrop-blur-md shadow-luxury hover:shadow-2xl border border-white/20 hover:border-[#4FE3C1]/50 flex items-center justify-center transition-all duration-300 transform group active:scale-95 ${
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
          : 'opacity-0 translate-y-4 pointer-events-none scale-90'
      }`}
    >
      <ArrowUp className="w-5 h-5 text-[#4FE3C1] group-hover:text-white transition-transform group-hover:-translate-y-0.5 duration-200" />
      {/* Subtle pulse ring on hover */}
      <span className="absolute inset-0 rounded-full border border-[#4FE3C1]/30 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 pointer-events-none" />
    </button>
  );
};
