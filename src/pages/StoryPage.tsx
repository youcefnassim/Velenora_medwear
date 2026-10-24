import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export const StoryPage: React.FC = () => {
  return (
    <div className="space-y-16 py-12">
      {/* Hero Banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <span className="text-xs uppercase tracking-widest font-bold text-velenora-teal">
          La Maison Velenora
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-velenora-navy leading-tight">
          Redéfinir le Vêtement Médical par l’Élégance et la Technologie
        </h1>
        <p className="text-base text-velenora-charcoal/80 font-light leading-relaxed">
          Née de la rencontre entre l’exigence hospitalière et la haute confection, Velenora Medwear permet aux médecins, chirurgiens et professionnels de santé d’incarner leur excellence quotidienne à travers des tenues conçues pour eux et par eux.
        </p>
      </section>

      {/* Visual Split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[420px] sm:h-[500px]">
            <img
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop"
              alt="Atelier Velenora Medwear"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-velenora-navy/80 via-transparent to-transparent flex items-end p-8 text-white">
              <div>
                <span className="text-xs uppercase tracking-widest text-velenora-teal-light font-bold">
                  Savoir-Faire & Confection
                </span>
                <p className="font-serif text-lg font-bold mt-1">
                  Atelier de confection et de broderie spécialisé
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-velenora-navy">
              Une Tenue Qui Reflète Votre Vocation
            </h2>
            <p className="text-xs sm:text-sm text-velenora-charcoal/80 leading-relaxed font-light">
              Pendant trop longtemps, les tenues médicales ont été réduites à des uniformes génériques, sans coupe flatteuse et fabriqués dans des matières rêches. Nous pensons que ceux qui prennent soin des autres méritent le plus grand soin dans ce qu’ils portent.
            </p>
            <p className="text-xs sm:text-sm text-velenora-charcoal/80 leading-relaxed font-light">
              Notre configurateur 3D interactif marque une rupture : chaque professionnel peut choisir son col, ses poches de garde, la longueur de ses manches et apposer sa broderie personnalisée en temps réel avant le lancement de la coupe.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-velenora-grey/60 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-velenora-navy block">Algérie & International</span>
                <span className="text-velenora-charcoal/70">Lancé en Algérie avec livraison sur 58 wilayas, prêt pour l'international.</span>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-velenora-navy block">Textile VeloTech™ 4D</span>
                <span className="text-velenora-charcoal/70">Mélange soyeux infroissable résistant à 60°C.</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/customizer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-velenora-teal hover:bg-velenora-teal-light text-white font-semibold text-xs shadow-luxury transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>Concevoir ma tenue personnalisée</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
