import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useI18n } from '../i18n/context';
import type { Order } from '../types/order';
import {
  CheckCircle2,
  Clock,
  Phone,
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { t, formatPrice } = useI18n();

  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#142C46', '#2A7776', '#D4AF37', '#8EA89D'],
    });
  }, []);

  const order: Order | null = (() => {
    try {
      const raw = localStorage.getItem('velenora_orders');
      if (!raw) return null;
      const list: Order[] = JSON.parse(raw);
      return list.find((o) => o.orderNumber === orderNumber) || list[0] || null;
    } catch {
      return null;
    }
  })();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-fade-in">
      <div className="bg-white rounded-3xl border border-velenora-grey/80 p-8 sm:p-10 shadow-luxury text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-mono font-bold tracking-widest text-velenora-teal uppercase">
          {t.orderConfirmation.orderNumber} : {orderNumber}
        </span>

        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-velenora-navy">
          {t.orderConfirmation.title}
        </h1>

        <p className="text-sm text-velenora-charcoal/80 max-w-lg mx-auto font-light leading-relaxed">
          {t.orderConfirmation.subtitle}
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-velenora-ivory border border-velenora-grey text-xs font-semibold text-velenora-navy">
          <Clock className="w-3.5 h-3.5 text-velenora-teal" />
          <span>Statut : En attente de confirmation atelier</span>
        </div>
      </div>

      {order && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-velenora-grey/80 p-6 shadow-luxury space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-velenora-navy pb-2 border-b border-velenora-grey/60">
              Coordonnées de Livraison
            </h3>
            <div className="space-y-2 text-xs text-velenora-charcoal/80">
              <p>
                <span className="font-semibold text-velenora-navy">Destinataire :</span> {order.customerDetails.fullName}
              </p>
              <p>
                <span className="font-semibold text-velenora-navy">Téléphone :</span> <span dir="ltr">{order.customerDetails.phone}</span>
              </p>
              <p>
                <span className="font-semibold text-velenora-navy">Wilaya :</span> {order.customerDetails.wilayaName}
              </p>
              <p>
                <span className="font-semibold text-velenora-navy">Commune :</span> {order.customerDetails.commune}
              </p>
              <p>
                <span className="font-semibold text-velenora-navy">Adresse :</span> {order.customerDetails.deliveryAddress}
              </p>
              <div className="pt-2 text-velenora-teal font-semibold">
                Mode : Paiement en espèces à la livraison (COD)
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-velenora-grey/80 p-6 shadow-luxury space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-velenora-navy pb-2 border-b border-velenora-grey/60">
              Articles Commandés
            </h3>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {order.items.map((it) => (
                <div key={it.id} className="text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-velenora-navy">
                    <span>{it.quantity}x {it.productNameSnapshot}</span>
                    <span>{formatPrice(it.totalPriceDZD)}</span>
                  </div>
                  <div className="text-[11px] text-velenora-charcoal/70">
                    Taille : {it.size}
                    {it.configurationSnapshot?.config.embroidery.enabled && (
                      <span className="text-velenora-teal block">
                        • Broderie : “{it.configurationSnapshot.config.embroidery.line1}”
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-velenora-grey/60 space-y-1.5 text-xs">
              <div className="flex justify-between text-velenora-charcoal/70">
                <span>Sous-total</span>
                <span>{formatPrice(order.subtotalDZD)}</span>
              </div>
              <div className="flex justify-between text-velenora-charcoal/70">
                <span>Frais d’expédition</span>
                <span>{formatPrice(order.shippingFeeDZD)}</span>
              </div>
              <div className="pt-2 border-t border-velenora-grey/60 flex justify-between font-bold text-velenora-navy text-sm">
                <span>Total à régler à la livraison</span>
                <span className="font-serif text-base text-velenora-teal">{formatPrice(order.totalDZD)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 bg-velenora-ivory rounded-2xl border border-velenora-grey/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-velenora-navy block">Une question sur votre commande ?</span>
            <span className="text-velenora-charcoal/70">Notre atelier est joignable directement par téléphone & WhatsApp.</span>
          </div>
        </div>

        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-velenora-navy hover:bg-velenora-navy-light text-white font-semibold transition"
        >
          {t.orderConfirmation.backHome}
        </Link>
      </div>
    </div>
  );
};
