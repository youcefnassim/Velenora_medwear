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
    <div className="relative min-h-screen text-velenora-navy pb-20 space-y-20">
      {/* ======================================================== */}
      {/* 1. CONTINUOUS HOMEPAGE BACKGROUND VIDEO (Full Page)      */}
      {/* ======================================================== */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center"
          src="/velenora.mp4"
        />
        {/* Crystal-clear luxury scrim: light & transparent so video is vividly visible everywhere */}
        <div className="absolute inset-0 bg-white/20 sm:bg-white/15 backdrop-blur-[0.5px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/40" />
      </div>

      {/* ======================================================== */}
      {/* 2. HERO SECTION                                          */}
      {/* ======================================================== */}
      <section className="relative z-10 pt-6 pb-12 lg:pt-16 lg:pb-24 border-b border-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6 bg-white/75 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-6 sm:p-8 lg:p-0 rounded-3xl border border-white/60 lg:border-none shadow-luxury lg:shadow-none">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-velenora-teal/15 border border-velenora-teal/30 text-velenora-teal text-xs font-semibold tracking-wide uppercase shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.hero.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-velenora-navy tracking-tight leading-[1.15]">
                {t.hero.title}
              </h1>

              <p className="text-sm sm:text-lg text-velenora-charcoal/90 leading-relaxed max-w-2xl font-light">
                {t.hero.subtitle}
              </p>

              {/* Mobile Complete Video Showcase (16:9 uncropped, shows both doctors clearly on phone) */}
              <div className="block lg:hidden w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-white/80 relative my-4 bg-black">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  ref={(el) => {
                    if (el) {
                      el.muted = true;
                      el.play().catch(() => {});
                    }
                  }}
                  className="w-full h-full object-cover object-center"
                  src="/velenora.mp4"
                />
                <div className="absolute bottom-2.5 left-2.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1.5 border border-white/20 pointer-events-none">
                  <Sparkles className="w-3 h-3 text-velenora-teal-light" />
                  <span>Présentation Velenora HD</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  to="/customizer"
                  className="px-7 py-4 rounded-xl bg-velenora-teal hover:bg-velenora-teal-light text-white font-semibold text-sm shadow-luxury hover:shadow-luxury-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
                  <span>{t.hero.ctaPrimary}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/catalog"
                  className="px-7 py-4 rounded-xl bg-white hover:bg-velenora-grey/50 text-velenora-navy font-semibold text-sm border border-velenora-grey/80 shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>{t.hero.ctaSecondary}</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-velenora-navy/15 grid grid-cols-3 gap-4 text-xs text-velenora-charcoal/90 font-medium">
                <div>
                  <span className="font-bold text-velenora-navy block text-sm">58 Wilayas</span>
                  <span>Paiement à la livraison</span>
                </div>
                <div>
                  <span className="font-bold text-velenora-navy block text-sm">3D Live</span>
                  <span>Broderie temps réel</span>
                </div>
                <div>
                  <span className="font-bold text-velenora-navy block text-sm">VeloTech™ 4D</span>
                  <span>Tissu antibactérien</span>
                </div>
              </div>
            </div>

            {/* Right Visual Stage (5 cols) -> Dedicated 'Personnalisez votre tenue' Atelier card */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="w-full max-w-md p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-[#142C46]/95 via-[#10263B]/95 to-[#0D1F30]/95 backdrop-blur-md text-white shadow-2xl border border-white/20 text-center relative overflow-hidden group">
                {/* Decorative background glow */}
                <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#087A83]/30 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#087A83]/25 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-[#087A83]/20 border border-[#087A83]/40 flex items-center justify-center text-[#4FE3C1] shadow-lg">
                    <Sparkles className="w-7 h-7" />
                  </div>

                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#4FE3C1] font-bold">
                      Atelier 3D Interactif
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                      Confectionnez Votre Tenue
                    </h3>
                    <p className="text-xs sm:text-sm text-[#F9F7F5]/80 mt-2 leading-relaxed">
                      Visualisez votre uniforme médical sous tous les angles avec notre configurateur 360° en temps réel.
                    </p>
                  </div>

                  <div className="pt-2">
                    <Link
                      to="/customizer"
                      className="w-full py-4 px-6 rounded-xl bg-[#087A83] hover:bg-[#0aa2ae] text-white font-bold text-sm sm:text-base shadow-luxury transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>Personnalisez votre tenue</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </Link>
                  </div>

                  <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-[#F9F7F5]/70 border-t border-white/10">
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
      {/* 2. HOW CUSTOMIZATION WORKS (4 Steps)                     */}
      {/* ======================================================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest font-bold text-velenora-teal">
            Expérience Unique
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-velenora-navy mt-1">
            {t.steps.title}
          </h2>
          <p className="text-sm text-velenora-charcoal/80 mt-2 font-light">
            {t.steps.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                className="p-6 bg-white/85 backdrop-blur-md rounded-2xl border border-white/60 shadow-luxury hover:shadow-luxury-lg transition duration-300 relative group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-velenora-teal/10 text-velenora-teal flex items-center justify-center transition group-hover:bg-velenora-teal group-hover:text-white">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-2xl font-serif font-bold text-velenora-grey">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-velenora-navy mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-velenora-charcoal/70 leading-relaxed font-light">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. BRAND DISTINCTION & BENEFITS                          */}
      {/* ======================================================== */}
      <section className="relative z-10 bg-velenora-navy/85 backdrop-blur-md text-velenora-ivory py-16 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest font-bold text-velenora-teal-light">
              Signature Velenora
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              {t.benefits.title}
            </h2>
            <p className="text-sm text-velenora-ivory/80 mt-2 font-light">
              {t.benefits.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                <div key={idx} className="space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-velenora-teal/20 text-velenora-teal-light flex items-center justify-center">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">{b.title}</h3>
                  <p className="text-xs text-velenora-ivory/70 leading-relaxed font-light">
                    {b.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
