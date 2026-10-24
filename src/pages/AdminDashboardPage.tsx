import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useI18n } from '../i18n/context';
import type { Order, OrderStatus, PaymentStatus, OrderItemRecord } from '../types/order';
import { ProductionWorksheetModal } from '../features/admin/ProductionWorksheetModal';
import { BoutiqueManagerTab } from '../features/admin/BoutiqueManagerTab';
import {
  Shield,
  ShoppingBag,
  Clock,
  Scissors,
  Truck,
  Printer,
  Filter,
  DollarSign,
  Package,
  ExternalLink,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { t, formatPrice } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'products';

  const [isAdminAuth, setIsAdminAuth] = useState<boolean>(() => {
    return sessionStorage.getItem('velenora_admin_auth') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const raw = localStorage.getItem('velenora_orders');
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return [
      {
        id: 'VEL-2026-1042',
        orderNumber: 'VEL-2026-1042',
        customerDetails: {
          fullName: 'Dr. Sarah Benali',
          phone: '0550123456',
          email: 'dr.benali@clinique-alger.dz',
          wilayaCode: '16',
          wilayaName: '16 - Alger',
          commune: 'Hydra',
          deliveryAddress: '14 Boulevard des Martyrs, Cabinet Dentaire',
        },
        items: [
          {
            id: 'oi-1',
            orderId: 'VEL-2026-1042',
            productId: 'velenora-signature-homme',
            productNameSnapshot: 'Ensemble Médical Signature Velenora',
            skuSnapshot: 'ensemble-signature-homme',
            quantity: 1,
            unitPriceDZD: 9800,
            totalPriceDZD: 9800,
            size: 'M',
            configurationSnapshot: {
              config: {
                garmentType: 'set',
                fit: 'women',
                size: 'M',
                topColor: { id: 'teal', name: { fr: 'Teal Médical', en: 'Teal', ar: 'تركواز' }, hex: '#2A7776' },
                pantsColor: { id: 'teal', name: { fr: 'Teal Médical', en: 'Teal', ar: 'تركواز' }, hex: '#2A7776' },
                accentColor: { id: 'navy', name: { fr: 'Bleu Marine', en: 'Navy', ar: 'كحلي' }, hex: '#142C46' },
                neckline: 'v_neck',
                sleeve: 'long',
                pocket: 'cargo_combo',
                pantsFit: 'jogger_cuff',
                waistband: 'elastic_drawstring',
                embroidery: {
                  enabled: true,
                  line1: 'Dr. Sarah Benali',
                  line2: 'Chirurgien Dentiste',
                  position: 'left_chest',
                  font: 'classic_serif',
                  colorHex: '#FFFFFF',
                  colorName: 'Blanc Pur',
                },
                productId: 'velenora-signature-custom',
                productName: 'Ensemble Médical Sur-Mesure 3D',
              },
              pricing: {
                basePriceDZD: 8200,
                sleevePriceDZD: 800,
                pocketPriceDZD: 0,
                embroideryPriceDZD: 800,
                totalPriceDZD: 9800,
              },
            },
          },
        ],
        subtotalDZD: 9800,
        shippingFeeDZD: 400,
        totalDZD: 10200,
        orderStatus: 'in_production',
        paymentMethod: 'cash_on_delivery',
        paymentStatus: 'pending',
        estimatedProductionDays: 3,
        createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'VEL-2026-1041',
        orderNumber: 'VEL-2026-1041',
        customerDetails: {
          fullName: 'Dr. Karim Meziani',
          phone: '0661987654',
          wilayaCode: '31',
          wilayaName: '31 - Oran',
          commune: 'Oran Centre',
          deliveryAddress: 'Avenue de l’ALN, Clinique El Chifaa',
        },
        items: [
          {
            id: 'oi-2',
            orderId: 'VEL-2026-1041',
            productId: 'velenora-signature-homme',
            productNameSnapshot: 'Tunique Médicale Col Officier Prestige',
            skuSnapshot: 'tunique-col-officier-prestige',
            quantity: 2,
            unitPriceDZD: 4800,
            totalPriceDZD: 9600,
            size: 'L',
          },
        ],
        subtotalDZD: 9600,
        shippingFeeDZD: 600,
        totalDZD: 10200,
        orderStatus: 'shipped',
        paymentMethod: 'cash_on_delivery',
        paymentStatus: 'pending',
        estimatedProductionDays: 3,
        createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  });

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeWorksheetOrder, setActiveWorksheetOrder] = useState<{
    order: Order;
    item: OrderItemRecord;
  } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('velenora_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'velenora2026' || passcode === 'admin' || passcode === '') {
      setIsAdminAuth(true);
      sessionStorage.setItem('velenora_admin_auth', 'true');
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleQuickLogin = () => {
    setIsAdminAuth(true);
    sessionStorage.setItem('velenora_admin_auth', 'true');
    setAuthError(false);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus, updatedAt: new Date().toISOString() } : o))
    );
  };

  const handleUpdatePaymentStatus = (orderId: string, newPaymentStatus: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: newPaymentStatus, updatedAt: new Date().toISOString() } : o))
    );
  };

  const setTab = (tab: string) => {
    searchParams.set('tab', tab);
    setSearchParams(searchParams);
  };

  // Metrics for orders
  const totalOrdersCount = orders.length;
  const pendingCount = orders.filter((o) => o.orderStatus === 'pending_confirmation').length;
  const inProductionCount = orders.filter((o) => o.orderStatus === 'in_production').length;
  const shippedCount = orders.filter((o) => o.orderStatus === 'shipped').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalDZD, 0);

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter((o) => o.orderStatus === statusFilter);

  if (!isAdminAuth) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 space-y-6">
        <div className="bg-white rounded-3xl border border-velenora-grey/80 p-8 shadow-luxury text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-velenora-navy text-white flex items-center justify-center">
            <Shield className="w-7 h-7 text-velenora-teal-light" />
          </div>
          <h1 className="text-xl font-serif font-bold text-velenora-navy">
            Administration & Boutique Velenora
          </h1>
          <p className="text-xs text-velenora-charcoal/70">
            Espace de gestion du catalogue produit et des commandes atelier.
          </p>

          <form onSubmit={handleAuthSubmit} className="space-y-3 pt-2">
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Code d'accès (ex: admin)"
              className="w-full px-3.5 py-2.5 text-xs text-center rounded-xl border border-velenora-grey/80 focus:outline-none focus:ring-2 focus:ring-velenora-teal"
            />
            {authError && (
              <span className="text-xs text-rose-600 block">Code incorrect. Réessayez avec &quot;admin&quot;.</span>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-velenora-teal hover:bg-velenora-teal-light text-white text-xs font-bold rounded-xl shadow-luxury transition"
            >
              Déverrouiller l’Administration
            </button>
          </form>

          <div className="pt-2 border-t border-velenora-grey/60">
            <button
              type="button"
              onClick={handleQuickLogin}
              className="w-full py-2.5 bg-velenora-grey/40 hover:bg-velenora-grey/60 text-velenora-navy text-xs font-semibold rounded-xl transition"
            >
              Connexion Rapide (1 clic)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-velenora-grey/80 gap-4">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-velenora-teal uppercase">
            Espace d&apos;Administration Velenora
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-velenora-navy mt-1">
            Tableau de Bord &amp; Pilotage
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/catalog"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-white border border-velenora-grey/80 text-xs font-semibold text-velenora-navy hover:bg-velenora-grey/40 transition flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-velenora-teal" />
            <span>Voir la boutique</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              setIsAdminAuth(false);
              sessionStorage.removeItem('velenora_admin_auth');
            }}
            className="text-xs font-semibold text-velenora-charcoal/60 hover:text-rose-600 transition"
          >
            Se déconnecter
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-velenora-grey/80 pb-1">
        <button
          type="button"
          onClick={() => setTab('products')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold rounded-t-2xl border-b-2 transition ${
            activeTab === 'products'
              ? 'border-velenora-teal text-velenora-teal bg-velenora-teal/5'
              : 'border-transparent text-velenora-charcoal/70 hover:text-velenora-navy hover:bg-velenora-grey/30'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Remplir &amp; Gérer la Boutique</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('orders')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold rounded-t-2xl border-b-2 transition ${
            activeTab === 'orders'
              ? 'border-velenora-teal text-velenora-teal bg-velenora-teal/5'
              : 'border-transparent text-velenora-charcoal/70 hover:text-velenora-navy hover:bg-velenora-grey/30'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Commandes Atelier &amp; Fiches ({orders.length})</span>
        </button>
      </div>

      {/* Tab 1: Boutique Manager Tab */}
      {activeTab === 'products' && <BoutiqueManagerTab />}

      {/* Tab 2: Orders & Atelier Worksheet Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-velenora-grey/80 shadow-luxury space-y-2">
              <div className="flex items-center justify-between text-velenora-charcoal/60">
                <span className="text-xs font-semibold uppercase">{t.admin.totalOrders}</span>
                <ShoppingBag className="w-4 h-4 text-velenora-navy" />
              </div>
              <span className="text-2xl font-serif font-bold text-velenora-navy block">{totalOrdersCount}</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-velenora-grey/80 shadow-luxury space-y-2">
              <div className="flex items-center justify-between text-amber-700">
                <span className="text-xs font-semibold uppercase">{t.admin.pending}</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-2xl font-serif font-bold text-amber-600 block">{pendingCount}</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-velenora-grey/80 shadow-luxury space-y-2">
              <div className="flex items-center justify-between text-velenora-teal">
                <span className="text-xs font-semibold uppercase">{t.admin.inProduction}</span>
                <Scissors className="w-4 h-4 text-velenora-teal" />
              </div>
              <span className="text-2xl font-serif font-bold text-velenora-teal block">{inProductionCount}</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-velenora-grey/80 shadow-luxury space-y-2">
              <div className="flex items-center justify-between text-blue-700">
                <span className="text-xs font-semibold uppercase">{t.admin.shipped}</span>
                <Truck className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-2xl font-serif font-bold text-blue-600 block">{shippedCount}</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-velenora-grey/80 shadow-luxury space-y-2 col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between text-emerald-700">
                <span className="text-xs font-semibold uppercase">{t.admin.revenue}</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-lg font-serif font-bold text-emerald-700 block whitespace-nowrap">
                {formatPrice(totalRevenue)}
              </span>
            </div>
          </div>

          {/* Orders Filter Strip */}
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-velenora-grey/80 shadow-sm text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-velenora-teal" />
              <span className="font-semibold text-velenora-navy">{t.admin.filterStatus} :</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border border-velenora-grey/80 rounded-lg px-3 py-1.5 font-medium text-velenora-navy focus:outline-none"
            >
              <option value="all">{t.admin.all}</option>
              <option value="pending_confirmation">En attente de confirmation</option>
              <option value="confirmed">Confirmée</option>
              <option value="in_production">En confection atelier</option>
              <option value="ready_for_dispatch">Prête pour expédition</option>
              <option value="shipped">Expédiée</option>
              <option value="delivered">Livrée</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-2xl border border-velenora-grey/80 shadow-luxury overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-velenora-grey/40 text-velenora-navy uppercase font-semibold">
                  <tr>
                    <th className="p-4">{t.admin.orderId}</th>
                    <th className="p-4">{t.admin.customer}</th>
                    <th className="p-4">{t.admin.destination}</th>
                    <th className="p-4">{t.admin.amount}</th>
                    <th className="p-4">{t.admin.status}</th>
                    <th className="p-4">{t.admin.paymentStatus}</th>
                    <th className="p-4 text-right">{t.admin.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-velenora-grey/60">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-velenora-ivory/50 transition">
                      <td className="p-4">
                        <span className="font-mono font-bold text-velenora-navy block">
                          {ord.orderNumber}
                        </span>
                        <span className="text-[11px] text-velenora-charcoal/60">
                          {new Date(ord.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-velenora-navy block">{ord.customerDetails.fullName}</span>
                        <span className="text-[11px] text-velenora-charcoal/60" dir="ltr">{ord.customerDetails.phone}</span>
                      </td>

                      <td className="p-4">
                        <span className="font-medium text-velenora-navy block">{ord.customerDetails.wilayaName}</span>
                        <span className="text-[11px] text-velenora-charcoal/60">{ord.customerDetails.commune}</span>
                      </td>

                      <td className="p-4 font-serif font-bold text-velenora-navy">
                        {formatPrice(ord.totalDZD)}
                      </td>

                      <td className="p-4">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className="px-2 py-1 rounded-lg border border-velenora-grey/80 bg-white font-medium text-[11px]"
                        >
                          <option value="pending_confirmation">En attente confirmation</option>
                          <option value="confirmed">Confirmée</option>
                          <option value="in_production">En confection</option>
                          <option value="ready_for_dispatch">Prête à expédier</option>
                          <option value="shipped">Expédiée</option>
                          <option value="delivered">Livrée</option>
                          <option value="cancelled">Annulée</option>
                        </select>
                      </td>

                      <td className="p-4">
                        <select
                          value={ord.paymentStatus}
                          onChange={(e) => handleUpdatePaymentStatus(ord.id, e.target.value as PaymentStatus)}
                          className={`px-2 py-1 rounded-lg border font-semibold text-[11px] ${
                            ord.paymentStatus === 'paid'
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                              : 'border-amber-300 bg-amber-50 text-amber-800'
                          }`}
                        >
                          <option value="pending">En attente (COD)</option>
                          <option value="paid">Payé (Encaissé)</option>
                          <option value="failed">Échec</option>
                          <option value="refunded">Remboursé</option>
                        </select>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => setActiveWorksheetOrder({ order: ord, item: ord.items[0] })}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-velenora-teal hover:bg-velenora-teal-light text-white text-xs font-semibold shadow-sm transition"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Fiche d’Atelier</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeWorksheetOrder && (
        <ProductionWorksheetModal
          order={activeWorksheetOrder.order}
          item={activeWorksheetOrder.item}
          onClose={() => setActiveWorksheetOrder(null)}
        />
      )}
    </div>
  );
};
