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
      <section className="relative overflow-hidden pt-6 pb-8 lg:pt-12 lg:pb-16 border-b border-white/40">
        {/* Luxury Background Video confined to Hero only (no leaking between sections) */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center"
            src="/velenora.mp4"
          />
          {/* Crystal-clear luxury scrim */}
          <div className="absolute inset-0 bg-white/25 backdrop-blur-[0.5px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 bg-white/85 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-5 sm:p-7 lg:p-0 rounded-2xl sm:rounded-3xl border border-white/60 lg:border-none shadow-luxury lg:shadow-none">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-velenora-teal/15 border border-velenora-teal/30 text-velenora-teal text-[11px] font-semibold tracking-wide uppercase shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.hero.badge}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-velenora-navy tracking-tight leading-[1.15]">
                {t.hero.title}
              </h1>

              <p className="text-xs sm:text-base text-velenora-charcoal/90 leading-relaxed max-w-2xl font-light">
                {t.hero.subtitle}
              </p>

              {/* CTAs */}
              <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                <Link
                  to="/customizer"
                  className="px-6 py-3.5 rounded-xl bg-velenora-teal hover:bg-velenora-teal-light text-white font-semibold text-xs sm:text-sm shadow-luxury hover:shadow-luxury-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
                  <span>{t.hero.ctaPrimary}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/catalog"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-velenora-grey/50 text-velenora-navy font-semibold text-xs sm:text-sm border border-velenora-grey/80 shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>{t.hero.ctaSecondary}</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-3 border-t border-velenora-navy/15 grid grid-cols-3 gap-2 sm:gap-4 text-[11px] sm:text-xs text-velenora-charcoal/90 font-medium">
                <div>
                  <span className="font-bold text-velenora-navy block text-xs sm:text-sm">58 Wilayas</span>
                  <span>Paiement à la livraison</span>
                </div>
                <div>
                  <span className="font-bold text-velenora-navy block text-xs sm:text-sm">3D Live</span>
                  <span>Broderie temps réel</span>
                </div>
                <div>
                  <span className="font-bold text-velenora-navy block text-xs sm:text-sm">VeloTech™ 4D</span>
                  <span>Tissu antibactérien</span>
                </div>
              </div>
            </div>

            {/* Right Visual Stage (5 cols) -> Dedicated 'Personnalisez votre tenue' Atelier card */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="w-full max-w-md p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#142C46]/95 via-[#10263B]/95 to-[#0D1F30]/95 backdrop-blur-md text-white shadow-xl border border-white/20 text-center relative overflow-hidden group">
                {/* Decorative background glow */}
                <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#087A83]/30 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#087A83]/25 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-3 sm:space-y-3.5">
                  <div className="w-14 h-14 mx-auto rounded-full overflow-hidden shadow-lg border-2 border-amber-300/40 p-0.5 bg-[#0D1F30]">
                    <img src="/logo.jpg" alt="Velenora Medical Wear" className="w-full h-full object-cover rounded-full" />
                  </div>

                  <div>
                    <span className="text-[11px] uppercase tracking-widest text-[#4FE3C1] font-bold">
                      Atelier 3D Interactif
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mt-0.5">
                      Confectionnez Votre Tenue
                    </h3>
                    <p className="text-xs text-[#F9F7F5]/80 mt-1 leading-relaxed">
                      Visualisez votre uniforme médical sous tous les angles avec notre configurateur 360° en temps réel.
                    </p>
                  </div>

                  <div className="pt-1">
                    <Link
                      to="/customizer"
                      className="w-full py-3.5 px-5 rounded-xl bg-[#087A83] hover:bg-[#0aa2ae] text-white font-bold text-xs sm:text-sm shadow-luxury transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>Personnalisez votre tenue</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </Link>
                  </div>

                  <div className="pt-1.5 flex items-center justify-center gap-2 text-[10px] sm:text-[11px] text-[#F9F7F5]/70 border-t border-white/10">
                    <span>Rotation 360°</span>
                    <span>•</span>
                    <span>Broderie en Direct</span>
                    <span>•</span>
                    <span>58 Wilayas</span>
                  </div>
                </div>
              </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
                  className="p-5 bg-[#F9F7F5] rounded-xl sm:rounded-2xl border border-[#E1E5E8] shadow-sm hover:shadow-md transition duration-300 relative group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg bg-velenora-teal/10 text-velenora-teal flex items-center justify-center transition group-hover:bg-velenora-teal group-hover:text-white">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="text-lg sm:text-xl font-serif font-bold text-[#8A9BA8]">
                        {step.num}
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-velenora-navy mb-1">
                      {step.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-velenora-charcoal/70 leading-relaxed font-light">
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
