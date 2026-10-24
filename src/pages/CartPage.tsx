import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/context';
import { useCart } from '../features/cart/context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, Sparkles, ShieldCheck, ShoppingBag } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { t, formatPrice } = useI18n();
  const { items, itemCount, subtotalDZD, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-velenora-teal/10 text-velenora-teal flex items-center justify-center">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-velenora-navy">
          {t.cart.empty}
        </h1>
        <p className="text-sm text-velenora-charcoal/70 max-w-md mx-auto">
          Découvrez nos collections de tenues médicales et créez votre pièce unique dans notre atelier 3D.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/customizer"
            className="px-6 py-3 rounded-xl bg-velenora-teal text-white font-semibold text-xs shadow-luxury hover:bg-velenora-teal-light transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.nav.customizer}</span>
          </Link>
          <Link
            to="/catalog"
            className="px-6 py-3 rounded-xl bg-white border border-velenora-grey/80 text-velenora-navy font-semibold text-xs shadow-sm hover:bg-velenora-grey/40 transition"
          >
            <span>{t.cart.startShopping}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="pb-6 border-b border-velenora-grey/80">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-velenora-navy">
          {t.cart.title} ({itemCount} {itemCount > 1 ? 'articles' : 'article'})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8">
        {/* Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const hasCustomization = Boolean(item.customization);
            const cust = item.customization?.config;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-velenora-grey/80 p-5 shadow-luxury flex flex-col sm:flex-row gap-5"
              >
                {/* Thumbnail */}
                <div className="relative w-full sm:w-32 h-36 rounded-xl overflow-hidden bg-velenora-grey/30 shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name.fr}
                    className="w-full h-full object-cover"
                  />
                  {hasCustomization && (
                    <span className="absolute bottom-1.5 left-1.5 right-1.5 bg-velenora-navy/90 text-white text-[9px] font-bold py-0.5 px-1.5 rounded text-center">
                      Sur-Mesure 3D
                    </span>
                  )}
                </div>

                {/* Info & Customization specs */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-velenora-navy">
                          {item.product.name.fr}
                        </h3>
                        <p className="text-xs text-velenora-teal font-semibold mt-0.5">
                          Taille : {item.size} • Coupe {item.product.fit === 'men' ? 'Homme' : 'Femme'}
                        </p>
                      </div>
                      <span className="text-sm font-serif font-bold text-velenora-navy whitespace-nowrap">
                        {formatPrice(item.subtotalDZD)}
                      </span>
                    </div>

                    {/* Customization Details Pills */}
                    {hasCustomization && cust && (
                      <div className="mt-3 p-3 bg-velenora-ivory/60 rounded-xl border border-velenora-grey/60 space-y-1 text-xs">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-velenora-charcoal/80">
                          <span className="flex items-center gap-1">
                            <span className="text-velenora-charcoal/60">Haut:</span>
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black/20"
                              style={{ backgroundColor: cust.topColor.hex }}
                            />
                            <b>{cust.topColor.name.fr}</b>
                          </span>

                          {cust.garmentType !== 'top' && (
                            <span className="flex items-center gap-1">
                              <span className="text-velenora-charcoal/60">Bas:</span>
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-black/20"
                                style={{ backgroundColor: cust.pantsColor.hex }}
                              />
                              <b>{cust.pantsColor.name.fr}</b>
                            </span>
                          )}

                          <span>
                            Col : <b>{cust.neckline}</b>
                          </span>
                          <span>
                            Manches : <b>{cust.sleeve === 'long' ? 'Longues' : 'Courtes'}</b>
                          </span>
                        </div>

                        {/* Embroidery Pill */}
                        {cust.embroidery.enabled && (
                          <div className="pt-1.5 mt-1 border-t border-velenora-grey/60 flex items-center gap-2 text-velenora-navy">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>
                              Broderie fil {cust.embroidery.colorName} :{' '}
                              <b>“{cust.embroidery.line1}”</b>
                              {cust.embroidery.line2 ? ` — ${cust.embroidery.line2}` : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Quantity & Remove Toolbar */}
                  <div className="flex items-center justify-between pt-4 mt-2 border-t border-velenora-grey/60">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-velenora-grey/80 rounded-lg overflow-hidden bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 text-velenora-charcoal hover:bg-velenora-grey/40 transition"
                          aria-label="Diminuer la quantité"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-velenora-navy">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 text-velenora-charcoal hover:bg-velenora-grey/40 transition"
                          aria-label="Augmenter la quantité"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-[11px] text-velenora-charcoal/60">
                        {formatPrice(item.unitPriceDZD)} / unité
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t.cart.remove}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Checkout Card (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl border border-velenora-grey/80 p-6 shadow-luxury space-y-6 sticky top-28">
            <h2 className="text-base font-serif font-bold text-velenora-navy pb-3 border-b border-velenora-grey/60">
              {t.checkout.orderSummary}
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-velenora-charcoal/70">
                <span>{t.cart.subtotal}</span>
                <span className="font-semibold text-velenora-navy">{formatPrice(subtotalDZD)}</span>
              </div>
              <div className="flex items-center justify-between text-velenora-charcoal/70">
                <span>Livraison (58 wilayas)</span>
                <span className="text-velenora-teal font-medium">Calculée à l’étape suivante</span>
              </div>
              <div className="pt-3 border-t border-velenora-grey/60 flex items-center justify-between text-base font-bold text-velenora-navy">
                <span>Total estimé</span>
                <span className="font-serif text-lg text-velenora-teal">{formatPrice(subtotalDZD)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 px-6 rounded-xl bg-velenora-teal hover:bg-velenora-teal-light text-white font-bold text-xs shadow-luxury hover:shadow-luxury-lg transition flex items-center justify-center gap-2"
            >
              <span>{t.cart.checkoutBtn}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>

            <div className="pt-2 border-t border-velenora-grey/60 space-y-2 text-[11px] text-velenora-charcoal/70">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-velenora-teal shrink-0" />
                <span>Paiement en espèces à la livraison (Cash on Delivery)</span>
              </div>
              <p>
                Chaque pièce personnalisée fait l’objet d’un contrôle rigoureux avant emballage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
