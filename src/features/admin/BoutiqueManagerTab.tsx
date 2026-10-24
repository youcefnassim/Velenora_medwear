import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/context';
import { useProducts } from '../catalog/productStore';
import type { Product } from '../../types/product';
import { CATEGORIES } from '../../data/products';
import { ProductFormModal } from './ProductFormModal';
import {
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Sparkles,
  Package,
  Search,
  CheckCircle,
  Copy,
  AlertTriangle,
} from 'lucide-react';

export const BoutiqueManagerTab: React.FC = () => {
  const { formatPrice } = useI18n();
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    clearCatalog,
    seedOfficialCatalog,
  } = useProducts();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleSaveProduct = (
    productData: Partial<Product> & { name: { fr: string; en?: string; ar?: string } }
  ) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      showToast(`Tenue "${productData.name.fr}" modifiée avec succès.`);
    } else {
      addProduct(productData);
      showToast(`Tenue "${productData.name.fr}" ajoutée à la boutique !`);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Voulez-vous vraiment supprimer "${name}" de la boutique ?`)) {
      deleteProduct(id);
      showToast(`Tenue "${name}" supprimée.`);
    }
  };

  const handleDuplicate = (prod: Product) => {
    const clone = {
      ...prod,
      id: undefined,
      slug: undefined,
      name: {
        ...prod.name,
        fr: `${prod.name.fr} (Copie)`,
      },
    };
    addProduct(clone);
    showToast(`Tenue dupliquée avec succès.`);
  };

  const handleClearAll = () => {
    clearCatalog();
    setConfirmClearOpen(false);
    showToast('Toutes les tenues ont été supprimées de la boutique.');
  };

  // Filtered list
  const filteredList = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.fr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.name.ar && p.name.ar.includes(searchQuery));
      const matchesCat = filterCategory === 'all' || p.categoryId === filterCategory;
      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, filterCategory]);

  // Metrics
  const totalProducts = products.length;
  const customizableCount = products.filter((p) => p.isCustomizable).length;
  const averagePrice =
    totalProducts > 0
      ? Math.round(products.reduce((acc, p) => acc + p.basePriceDZD, 0) / totalProducts)
      : 0;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-velenora-navy text-white px-5 py-3 rounded-2xl shadow-luxury flex items-center gap-2.5 text-xs font-semibold animate-fade-in border border-velenora-teal/30">
          <CheckCircle className="w-4 h-4 text-velenora-teal-light" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Confirmation Modal to Clear Catalog */}
      {confirmClearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-velenora-grey/80 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-serif font-bold text-velenora-navy">
              Vider tout le catalogue ?
            </h3>
            <p className="text-xs text-velenora-charcoal/70">
              Cette action supprimera toutes les tenues actuellement affichées dans la boutique. Vous pourrez ensuite en ajouter de nouvelles ou charger les modèles officiels.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmClearOpen(false)}
                className="flex-1 py-2.5 text-xs font-semibold rounded-xl border border-velenora-grey/80 text-velenora-charcoal hover:bg-velenora-grey/40 transition"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition"
              >
                Confirmer et vider
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Header & Tools */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-velenora-grey/80 shadow-luxury flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-velenora-teal">
            Gestion des Produits & Remplissage
          </span>
          <h2 className="text-2xl font-serif font-bold text-velenora-navy mt-1">
            Catalogue de la Boutique
          </h2>
          <p className="text-xs text-velenora-charcoal/70 mt-1 max-w-xl">
            Ajoutez de nouvelles tenues, ajustez les prix en DZD, choisissez les photos et contrôlez la disponibilité de la personnalisation 3D en direct.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-velenora-teal hover:bg-velenora-teal-light text-white text-xs font-bold rounded-xl shadow-luxury transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une Tenue</span>
          </button>

          <Link
            to="/catalog"
            target="_blank"
            className="px-4 py-2.5 bg-white border border-velenora-grey/80 hover:bg-velenora-grey/40 text-velenora-navy text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-velenora-teal" />
            <span>Voir la boutique</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              seedOfficialCatalog();
              showToast('Modèles officiels Velenora chargés !');
            }}
            className="px-3.5 py-2.5 bg-velenora-grey/30 hover:bg-velenora-grey/60 text-velenora-charcoal text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
            title="Charger les modèles officiels de démonstration"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Modèles Velenora</span>
          </button>

          {products.length > 0 && (
            <button
              type="button"
              onClick={() => setConfirmClearOpen(true)}
              className="px-3 py-2.5 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-xl border border-rose-200 transition flex items-center gap-1.5"
              title="Supprimer toutes les tenues"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Vider le catalogue</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-velenora-grey/80 shadow-sm space-y-1">
          <span className="text-[11px] text-velenora-charcoal/60 font-semibold block uppercase">
            Total Articles
          </span>
          <span className="text-2xl font-serif font-bold text-velenora-navy">
            {totalProducts}
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-velenora-grey/80 shadow-sm space-y-1">
          <span className="text-[11px] text-velenora-teal font-semibold block uppercase flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>3D Sur-Mesure</span>
          </span>
          <span className="text-2xl font-serif font-bold text-velenora-teal">
            {customizableCount}
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-velenora-grey/80 shadow-sm space-y-1">
          <span className="text-[11px] text-velenora-charcoal/60 font-semibold block uppercase">
            Catégories
          </span>
          <span className="text-2xl font-serif font-bold text-velenora-navy">
            {CATEGORIES.length}
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-velenora-grey/80 shadow-sm space-y-1">
          <span className="text-[11px] text-velenora-charcoal/60 font-semibold block uppercase">
            Prix Moyen
          </span>
          <span className="text-2xl font-serif font-bold text-velenora-navy">
            {formatPrice(averagePrice)}
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-velenora-grey/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-velenora-charcoal/40 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Rechercher par nom de tenue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-velenora-grey/80 focus:outline-none focus:ring-1 focus:ring-velenora-teal"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-velenora-charcoal/60 shrink-0">Catégorie :</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-velenora-grey/80 bg-white focus:outline-none focus:ring-1 focus:ring-velenora-teal"
          >
            <option value="all">Toutes ({products.length})</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name.fr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product List / Cards */}
      {products.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-velenora-grey/80 shadow-luxury space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-velenora-teal/10 text-velenora-teal flex items-center justify-center">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-serif font-bold text-velenora-navy">
            Le catalogue est actuellement vide
          </h3>
          <p className="text-xs text-velenora-charcoal/70 max-w-md mx-auto leading-relaxed">
            Remplissez votre boutique en ajoutant votre première tenue médicale sur-mesure ou en rechargeant les modèles d'atelier officiels.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-5 py-2.5 bg-velenora-teal hover:bg-velenora-teal-light text-white text-xs font-bold rounded-xl shadow-luxury transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Créer une tenue maintenant</span>
            </button>
            <button
              type="button"
              onClick={() => {
                seedOfficialCatalog();
                showToast('Modèles officiels chargés !');
              }}
              className="px-4 py-2.5 bg-velenora-grey/40 hover:bg-velenora-grey/60 text-velenora-navy text-xs font-semibold rounded-xl transition"
            >
              Charger 2 modèles officiels
            </button>
          </div>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-velenora-grey/80 shadow-sm space-y-2">
          <p className="text-sm font-semibold text-velenora-navy">Aucun résultat pour cette recherche</p>
          <p className="text-xs text-velenora-charcoal/60">
            Essayez de modifier votre mot-clé ou réinitialiser le filtre catégorie.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl border border-velenora-grey/80 shadow-luxury hover:shadow-luxury-lg transition duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Image and Badges */}
                <div className="relative h-56 bg-velenora-grey/20 overflow-hidden flex items-center justify-center">
                  <img
                    src={prod.images[0] || '/images/tryon/men-front-clean.jpg'}
                    alt={prod.name.fr}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/tryon/men-front-clean.jpg';
                    }}
                    className="w-full h-full object-contain p-2"
                  />

                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {prod.isCustomizable && (
                      <span className="bg-velenora-navy/90 backdrop-blur-sm text-velenora-ivory text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3 h-3 text-velenora-teal-light" />
                        <span>3D Sur-Mesure</span>
                      </span>
                    )}
                    {prod.isFeatured && (
                      <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        Vedette
                      </span>
                    )}
                  </div>

                  <span className="absolute bottom-3 right-3 text-[10px] font-bold bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-velenora-navy shadow-sm uppercase">
                    Coupe {prod.fit}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-velenora-teal">
                      {CATEGORIES.find((c) => c.id === prod.categoryId)?.name.fr || prod.categoryId}
                    </span>
                    <h3 className="text-base font-bold text-velenora-navy mt-0.5 line-clamp-1">
                      {prod.name.fr}
                    </h3>
                    {prod.name.ar && (
                      <p className="text-xs text-velenora-charcoal/60 font-arabic line-clamp-1 mt-0.5">
                        {prod.name.ar}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-serif font-bold text-velenora-navy">
                      {formatPrice(prod.basePriceDZD)}
                    </span>
                    {prod.originalPriceDZD && (
                      <span className="text-xs text-velenora-charcoal/50 line-through">
                        {formatPrice(prod.originalPriceDZD)}
                      </span>
                    )}
                  </div>

                  {/* Colors & Sizes Swatches */}
                  <div className="pt-2 border-t border-velenora-grey/60 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-velenora-charcoal/60">Couleurs :</span>
                      <div className="flex items-center gap-1">
                        {prod.colors.map((c, idx) => (
                          <span
                            key={idx}
                            className="w-3.5 h-3.5 rounded-full border border-black/20"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-velenora-charcoal/60">Tailles :</span>
                      <div className="flex items-center gap-1">
                        {prod.sizes.map((s) => (
                          <span
                            key={s}
                            className="text-[9px] font-bold px-1.5 py-0.5 bg-velenora-grey/40 text-velenora-navy rounded"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-4 bg-velenora-grey/20 border-t border-velenora-grey/60 flex items-center justify-between gap-2">
                <Link
                  to={`/products/${prod.slug}`}
                  target="_blank"
                  className="p-2 text-velenora-charcoal/60 hover:text-velenora-navy hover:bg-white rounded-xl transition"
                  title="Voir la fiche client"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDuplicate(prod)}
                    className="p-2 text-velenora-charcoal/70 hover:text-velenora-teal hover:bg-white rounded-xl transition"
                    title="Dupliquer la tenue"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(prod)}
                    className="px-3 py-1.5 bg-velenora-navy hover:bg-velenora-navy-light text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Modifier</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(prod.id, prod.name.fr)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="Supprimer la tenue"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
      />
    </div>
  );
};
