import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useI18n } from '../i18n/context';
import { useCart } from '../features/cart/context/CartContext';
import { ALGERIAN_WILAYAS } from '../data/wilayas';
import type { Order, OrderItemRecord } from '../types/order';
import {
  Truck,
  Lock,
  Clock,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { t, formatPrice } = useI18n();
  const { items, subtotalDZD, clearCart } = useCart();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [wilayaCode, setWilayaCode] = useState('16');
  const [commune, setCommune] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentWilaya = ALGERIAN_WILAYAS.find((w) => w.code === wilayaCode) || ALGERIAN_WILAYAS[15];
  const shippingFeeDZD = currentWilaya.shippingFeeDZD;
  const totalDZD = subtotalDZD + shippingFeeDZD;

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-velenora-navy">Votre panier est vide</h2>
        <p className="text-xs text-velenora-charcoal/70">
          Veuillez ajouter des articles avant de passer à la caisse.
        </p>
        <Link
          to="/catalog"
          className="inline-block px-5 py-2.5 rounded-xl bg-velenora-teal text-white text-xs font-semibold"
        >
          Voir le catalogue
        </Link>
      </div>
    );
  }

  const validateForm = () => {
    const err: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().length < 3) {
      err.fullName = 'Veuillez saisir votre nom et prénom complet';
    }
    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (!cleanPhone || !/^(0|\+213)[567]\d{8}$/.test(cleanPhone)) {
      err.phone = 'Numéro de téléphone algérien valide requis (ex: 0550123456)';
    }
    if (!commune.trim()) {
      err.commune = 'Veuillez indiquer votre commune ou localité';
    }
    if (!address.trim() || address.trim().length < 8) {
      err.address = 'Adresse exacte requise (Rue, bâtiment, étage...)';
    }
    if (!termsAccepted) {
      err.terms = 'Vous devez accepter les conditions de commande';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const orderNumber = `VEL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const orderItems: OrderItemRecord[] = items.map((item, idx) => ({
        id: `oi-${orderNumber}-${idx + 1}`,
        orderId: orderNumber,
        productId: item.productId,
        productNameSnapshot: item.product.name.fr,
        skuSnapshot: item.product.slug,
        quantity: item.quantity,
        unitPriceDZD: item.unitPriceDZD,
        totalPriceDZD: item.subtotalDZD,
        size: item.size,
        configurationSnapshot: item.customization,
      }));

      const newOrder: Order = {
        id: orderNumber,
        orderNumber,
        customerDetails: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          wilayaCode: currentWilaya.code,
          wilayaName: currentWilaya.nameFr,
          commune: commune.trim(),
          deliveryAddress: address.trim(),
          deliveryNotes: deliveryNotes.trim() || undefined,
        },
        items: orderItems,
        subtotalDZD,
        shippingFeeDZD,
        totalDZD,
        orderStatus: 'pending_confirmation',
        paymentMethod: 'cash_on_delivery',
        paymentStatus: 'pending',
        estimatedProductionDays: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const existingOrdersRaw = localStorage.getItem('velenora_orders');
      const existingOrders = existingOrdersRaw ? JSON.parse(existingOrdersRaw) : [];
      existingOrders.unshift(newOrder);
      localStorage.setItem('velenora_orders', JSON.stringify(existingOrders));

      clearCart();
      navigate(`/order-confirmation/${orderNumber}`);
    } catch {
      alert('Une erreur est survenue lors de l’enregistrement de votre commande.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="pb-6 border-b border-velenora-grey/80">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-velenora-navy">
          {t.checkout.title}
        </h1>
        <p className="text-xs text-velenora-charcoal/70 mt-1">
          Paiement sécurisé en espèces à la livraison partout en Algérie.
        </p>
      </div>

      <form onSubmit={handleOrderSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="p-4 bg-velenora-teal/10 rounded-2xl border border-velenora-teal/20 flex items-start gap-3">
            <Truck className="w-5 h-5 text-velenora-teal shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-bold text-velenora-navy block">
                {t.checkout.cod}
              </span>
              <p className="text-velenora-charcoal/80">
                {t.checkout.codDesc} Aucun paiement par carte bancaire requis en ligne.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-velenora-grey/80 p-6 shadow-luxury space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-velenora-navy pb-2 border-b border-velenora-grey/60">
              {t.checkout.customerInfo}
            </h2>

            <div>
              <label className="block text-xs font-semibold text-velenora-navy mb-1">
                {t.checkout.fullName} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="ex: Dr. Amine Mansouri"
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-velenora-teal ${
                  errors.fullName ? 'border-rose-400 bg-rose-50' : 'border-velenora-grey/80'
                }`}
              />
              {errors.fullName && (
                <span className="text-[11px] text-rose-600 mt-1 block">{errors.fullName}</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-velenora-navy mb-1">
                  {t.checkout.phone} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0550 12 34 56"
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-velenora-teal ${
                    errors.phone ? 'border-rose-400 bg-rose-50' : 'border-velenora-grey/80'
                  }`}
                />
                {errors.phone && (
                  <span className="text-[11px] text-rose-600 mt-1 block">{errors.phone}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-velenora-navy mb-1">
                  {t.checkout.email} (Facultatif)
                </label>
                <input
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="docteur@exemple.com"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-velenora-grey/80 bg-white focus:outline-none focus:ring-2 focus:ring-velenora-teal"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-velenora-navy mb-1">
                {t.checkout.wilaya} <span className="text-rose-500">*</span>
              </label>
              <select
                value={wilayaCode}
                onChange={(e) => setWilayaCode(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-velenora-grey/80 bg-white focus:outline-none focus:ring-2 focus:ring-velenora-teal font-medium"
              >
                {ALGERIAN_WILAYAS.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.nameFr} — Frais de livraison : {formatPrice(w.shippingFeeDZD)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-velenora-navy mb-1">
                {t.checkout.commune} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                placeholder={t.checkout.communePlaceholder}
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-velenora-teal ${
                  errors.commune ? 'border-rose-400 bg-rose-50' : 'border-velenora-grey/80'
                }`}
              />
              {errors.commune && (
                <span className="text-[11px] text-rose-600 mt-1 block">{errors.commune}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-velenora-navy mb-1">
                {t.checkout.address} <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t.checkout.addressPlaceholder}
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-velenora-teal ${
                  errors.address ? 'border-rose-400 bg-rose-50' : 'border-velenora-grey/80'
                }`}
              />
              {errors.address && (
                <span className="text-[11px] text-rose-600 mt-1 block">{errors.address}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-velenora-navy mb-1">
                {t.checkout.deliveryNotes}
              </label>
              <input
                type="text"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="ex: Cabinet médical 2ème étage, sonner à l’accueil..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-velenora-grey/80 bg-white focus:outline-none focus:ring-2 focus:ring-velenora-teal"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2 text-xs text-velenora-charcoal/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-velenora-teal rounded focus:ring-velenora-teal cursor-pointer"
                />
                <span>{t.checkout.termsAccept}</span>
              </label>
              {errors.terms && (
                <span className="text-[11px] text-rose-600 mt-1 block">{errors.terms}</span>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-velenora-grey/80 p-6 shadow-luxury space-y-5 sticky top-28">
            <h2 className="text-base font-serif font-bold text-velenora-navy pb-3 border-b border-velenora-grey/60">
              {t.checkout.orderSummary}
            </h2>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {items.map((it) => (
                <div key={it.id} className="flex items-center justify-between text-xs gap-3">
                  <div className="flex-1 line-clamp-1">
                    <span className="font-bold text-velenora-navy">
                      {it.quantity}x {it.product.name.fr}
                    </span>
                    <span className="text-[11px] text-velenora-charcoal/60 block">
                      Taille {it.size} {it.customization ? '• Broderie sur-mesure' : ''}
                    </span>
                  </div>
                  <span className="font-semibold text-velenora-navy whitespace-nowrap">
                    {formatPrice(it.subtotalDZD)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-velenora-grey/60 space-y-2 text-xs">
              <div className="flex items-center justify-between text-velenora-charcoal/70">
                <span>{t.cart.subtotal}</span>
                <span className="font-medium text-velenora-navy">{formatPrice(subtotalDZD)}</span>
              </div>
              <div className="flex items-center justify-between text-velenora-charcoal/70">
                <span>Frais de livraison ({currentWilaya.nameFr.split('-')[1]?.trim()})</span>
                <span className="font-medium text-velenora-navy">{formatPrice(shippingFeeDZD)}</span>
              </div>
              <div className="pt-3 border-t border-velenora-grey/60 flex items-center justify-between text-base font-bold text-velenora-navy">
                <span>{t.checkout.totalDue}</span>
                <span className="font-serif text-xl text-velenora-teal font-bold">
                  {formatPrice(totalDZD)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-xl text-white font-bold text-xs shadow-luxury transition flex items-center justify-center gap-2 ${
                isSubmitting
                  ? 'bg-velenora-grey-dark cursor-not-allowed'
                  : 'bg-velenora-teal hover:bg-velenora-teal-light hover:shadow-luxury-lg'
              }`}
            >
              {isSubmitting ? (
                <span>{t.checkout.submitting}</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>{t.checkout.confirmOrderBtn}</span>
                </>
              )}
            </button>

            <div className="space-y-1.5 text-[11px] text-velenora-charcoal/70 pt-2 border-t border-velenora-grey/60">
              <div className="flex items-center gap-1.5 text-velenora-navy font-semibold">
                <Clock className="w-3.5 h-3.5 text-velenora-teal" />
                <span>Fabrication en atelier sous 3 à 5 jours ouvrés</span>
              </div>
              <p>
                Notre équipe vous contactera par téléphone pour confirmer la mise en fabrication avant l’expédition.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
