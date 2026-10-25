import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/context';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Ruler,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="relative min-h-screen text-velenora-navy bg-[#F9F7F5]">
      {/* ======================================================== */}
      {/* 1. HERO SECTION (Video background contained STRICTLY)    */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden pt-8 pb-10 sm:pt-14 sm:pb-16 lg:pt-20 lg:pb-24 border-b border-white/40 min-h-[70vh] sm:min-h-[75vh] flex items-center justify-center">
        {/* Luxury Background Video centered perfectly */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-[center_20%] sm:object-[center_25%]"
            src="/velenora.mp4"
          />
          {/* Crystal-clear luxury scrim */}
          <div className="absolute inset-0 bg-white/20 sm:bg-white/15 backdrop-blur-[0.5px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-white/60" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          {/* Centered Glassmorphic Showcase Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-velenora-teal/30 text-velenora-teal text-[11px] sm:text-xs font-semibold tracking-wide uppercase shadow-sm mb-4">
            <Sparkles className="w-3.5 h-3.5 text-velenora-teal" />
            <span>{t.hero.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-velenora-navy tracking-tight leading-[1.15] drop-shadow-sm">
            {t.hero.title}
          </h1>

          <p className="text-xs sm:text-base lg:text-lg text-velenora-charcoal/90 leading-relaxed max-w-2xl mx-auto font-light mt-3 sm:mt-4 bg-white/70 sm:bg-white/50 backdrop-blur-sm p-3.5 sm:p-4 rounded-2xl border border-white/60 shadow-sm">
            {t.hero.subtitle}
          </p>

          {/* Centered Action CTAs */}
          <div className="pt-4 sm:pt-5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/customizer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-velenora-teal hover:bg-velenora-teal-light text-white font-semibold text-xs sm:text-sm shadow-luxury hover:shadow-luxury-lg transition-all flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
              <span>{t.hero.ctaPrimary}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/catalog"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/95 hover:bg-white text-velenora-navy font-semibold text-xs sm:text-sm border border-velenora-grey/80 shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>{t.hero.ctaSecondary}</span>
            </Link>
          </div>

          {/* Centered Trust Indicators */}
          <div className="mt-6 pt-3 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] sm:text-xs text-velenora-charcoal/90 font-medium bg-white/75 sm:bg-white/45 backdrop-blur-sm py-2 px-5 sm:px-6 rounded-2xl mx-auto w-fit border border-white/60 shadow-sm">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-velenora-navy">58 Wilayas</span>
              <span className="text-velenora-charcoal/70 hidden sm:inline">Paiement à la livraison</span>
            </div>
            <span className="text-velenora-navy/30">•</span>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-velenora-teal" />
              <span className="font-bold text-velenora-navy">3D Live</span>
              <span className="text-velenora-charcoal/70 hidden sm:inline">Broderie temps réel</span>
            </div>
            <span className="text-velenora-navy/30">•</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-velenora-teal" />
              <span className="font-bold text-velenora-navy">VeloTech™ 4D</span>
              <span className="text-velenora-charcoal/70 hidden sm:inline">Tissu antibactérien</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. HOW CUSTOMIZATION WORKS (4 Steps) - Seamless Section  */}
      {/* ======================================================== */}
      <section className="relative z-10 py-8 sm:py-12 bg-white border-b border-[#E1E5E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <span className="text-[11px] uppercase tracking-widest font-bold text-velenora-teal">
              Expérience Unique
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-velenora-navy mt-0.5">
              {t.steps.title}
            </h2>
            <p className="text-xs text-velenora-charcoal/80 mt-1 font-light">
              {t.steps.subtitle}
            </p>
          </div>

          {/* 2x2 Grid of Step Cards (2 par 2) */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 max-w-4xl mx-auto">
            {[
              {
                num: '01',
                title: t.steps.step1Title,
                desc: t.steps.step1Desc,
                icon: Layers,
              },
              {
                num: '02',
                title: t.steps.step2Title,
                desc: t.steps.step2Desc,
                icon: Cpu,
              },
              {
                num: '03',
                title: t.steps.step3Title,
                desc: t.steps.step3Desc,
                icon: Sparkles,
              },
              {
                num: '04',
                title: t.steps.step4Title,
                desc: t.steps.step4Desc,
                icon: ShieldCheck,
              },
            ].map((step, idx) => {
              const IconComp = step.icon;
              return (
                <div
                  key={idx}
                  className="p-3.5 sm:p-5 bg-[#F9F7F5] rounded-xl sm:rounded-2xl border border-[#E1E5E8] shadow-sm hover:shadow-md transition duration-300 relative group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-velenora-teal/10 text-velenora-teal flex items-center justify-center transition group-hover:bg-velenora-teal group-hover:text-white">
                        <IconComp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <span className="text-base sm:text-xl font-serif font-bold text-[#8A9BA8]">
                        {step.num}
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-velenora-navy mb-1 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-velenora-charcoal/70 leading-relaxed font-light">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. BRAND DISTINCTION & BENEFITS - Continuous Section     */}
      {/* ======================================================== */}
      <section className="relative z-10 bg-[#10263B] text-velenora-ivory py-8 sm:py-12 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <span className="text-[11px] uppercase tracking-widest font-bold text-[#4FE3C1]">
              Signature Velenora
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-0.5">
              {t.benefits.title}
            </h2>
            <p className="text-xs text-velenora-ivory/80 mt-1 font-light">
              {t.benefits.subtitle}
            </p>
          </div>

          {/* 2x2 Grid of Luxury Benefit Cards (2 par 2) */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 max-w-4xl mx-auto">
            {[
              {
                title: t.benefits.b1Title,
                desc: t.benefits.b1Desc,
                icon: Sparkles,
              },
              {
                title: t.benefits.b2Title,
                desc: t.benefits.b2Desc,
                icon: Layers,
              },
              {
                title: t.benefits.b3Title,
                desc: t.benefits.b3Desc,
                icon: Ruler,
              },
              {
                title: t.benefits.b4Title,
                desc: t.benefits.b4Desc,
                icon: ShieldCheck,
              },
            ].map((b, idx) => {
              const IconComp = b.icon;
              return (
                <div
                  key={idx}
                  className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm hover:bg-white/15 hover:border-velenora-teal-light/50 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3.5 group"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-velenora-teal/25 text-[#4FE3C1] border border-velenora-teal/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                    <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#4FE3C1] transition-colors leading-tight">
                      {b.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-velenora-ivory/80 leading-relaxed font-light">
                      {b.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. Signature Footer Note                                  */}
      {/* ======================================================== */}
      <div className="relative z-10 text-center py-3 bg-[#0D1F30] border-t border-white/10">
        <p className="text-[11px] font-serif tracking-widest text-[#4FE3C1]/80 uppercase font-semibold">
          designed by Velenora Med Wear 2026
        </p>
      </div>
    </div>
  );
};
