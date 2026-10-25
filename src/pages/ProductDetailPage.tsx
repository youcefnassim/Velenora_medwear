import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/context';
import { useCart } from '../features/cart/context/CartContext';
import { useProducts, DEFAULT_FALLBACK_PRODUCT } from '../features/catalog/productStore';
import {
  Sparkles,
  ShoppingBag,
  Check,
  Ruler,
  Truck,
  Clock,
  ArrowLeft,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, formatPrice } = useI18n();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const { products } = useProducts();

  const product = products.find((p) => p.slug === slug || p.id === slug) || products[0] || DEFAULT_FALLBACK_PRODUCT;
  const [selectedSize, setSelectedSize] = useState<'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'>(product.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || '#142C46');
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [showSizeModal, setShowSizeModal] = useState<boolean>(false);
  const [addedToast, setAddedToast] = useState(false);

  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 3);

  const handleAddToCart = () => {
    addItem({
      product,
      size: selectedSize,
      quantity: 1,
    });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <div>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-velenora-teal hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
          <span>{t.productDetail.backToCatalog}</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#FAFBFD] to-[#F1F3F5] border border-velenora-grey/80 shadow-luxury h-[520px] sm:h-[620px] flex items-center justify-center p-4">
            <img
              src={product.images[activeImageIndex] || product.images[0] || '/images/tryon/men-front-clean.jpg'}
              alt={product.name.fr}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/tryon/men-front-clean.jpg';
              }}
              className="w-full h-full object-contain object-center"
            />
            {product.isCustomizable && (
              <span className="absolute top-4 left-4 bg-velenora-navy/95 backdrop-blur-sm text-velenora-ivory text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-velenora-teal-light" />
                <span>{t.productDetail.customizableBadge}</span>
              </span>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex items-center gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                    activeImageIndex === idx ? 'border-velenora-teal scale-105' : 'border-velenora-grey/60'
                  }`}
                >
                  <img src={img} alt="Aperçu" className="w-full h-full object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-velenora-teal">
              Haute Confection • Coupe {product.fit === 'men' ? 'Homme' : product.fit === 'women' ? 'Femme' : 'Unisexe'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-velenora-navy mt-1">
              {product.name.fr}
            </h1>

            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-velenora-teal">
                {formatPrice(product.basePriceDZD)}
              </span>
              {product.originalPriceDZD && (
                <span className="text-sm text-velenora-charcoal/50 line-through">
                  {formatPrice(product.originalPriceDZD)}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-velenora-charcoal/80 leading-relaxed font-light">
            {product.description.fr}
          </p>

          <div className="pt-4 border-t border-velenora-grey/60">
            <label className="block text-xs font-semibold uppercase tracking-wider text-velenora-navy mb-2.5">
              Couleurs Disponibles en Atelier
            </label>
            <div className="flex items-center gap-2.5">
              {product.colors.map((col, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedColor(col)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition ${
                    selectedColor === col ? 'border-velenora-teal scale-110 shadow-sm' : 'border-black/20'
                  }`}
                  style={{ backgroundColor: col }}
                >
                  {selectedColor === col && (
                    <Check className={`w-4 h-4 ${col === '#F9FAFB' ? 'text-black' : 'text-white'}`} />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-velenora-grey/60">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-velenora-navy">
                {t.productDetail.selectSize}
              </label>
              <button
                type="button"
                onClick={() => setShowSizeModal(true)}
                className="text-xs text-velenora-teal hover:underline flex items-center gap-1 font-medium"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>{t.productDetail.sizeGuide}</span>
              </button>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`py-2.5 rounded-xl border text-center text-xs font-bold transition ${
                    selectedSize === sz
                      ? 'border-velenora-teal bg-velenora-teal text-white shadow-sm'
                      : 'border-velenora-grey/80 text-velenora-charcoal hover:border-velenora-grey'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-velenora-grey/80 shadow-sm space-y-2 text-xs">
            <div className="flex items-center gap-2 text-velenora-navy font-semibold">
              <Clock className="w-4 h-4 text-velenora-teal" />
              <span>Délai de confection : {product.estimatedProductionDays} jours ouvrés</span>
            </div>
            <div className="flex items-center gap-2 text-velenora-charcoal/80">
              <Truck className="w-4 h-4 text-velenora-teal" />
              <span>Livraison à domicile sur 58 wilayas avec paiement à la livraison</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {product.isCustomizable && (
              <button
                type="button"
                onClick={() => navigate(`/customizer?product=${product.id}`)}
                className="w-full py-4 px-6 rounded-xl bg-velenora-teal hover:bg-velenora-teal-light text-white font-bold text-sm shadow-luxury hover:shadow-luxury-lg transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.productDetail.launchCustomizer}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full py-3.5 px-6 rounded-xl bg-velenora-navy hover:bg-velenora-navy-light text-white font-semibold text-xs shadow-sm transition flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t.productDetail.addToCart} (Taille {selectedSize})</span>
            </button>

            {addedToast && (
              <p className="text-xs text-center text-emerald-700 font-semibold bg-emerald-50 py-2 rounded-lg border border-emerald-200 animate-fade-in">
                ✓ Produit ajouté au panier avec succès !
              </p>
            )}
          </div>

          <div className="pt-6 border-t border-velenora-grey/60 space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-velenora-navy">
              Composition & Détails Techniques
            </h4>
            <p className="text-velenora-charcoal/80">{product.fabricDetails.composition}</p>
            <p className="text-velenora-charcoal/70">{product.fabricDetails.weight}</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {product.fabricDetails.features.map((feat, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-velenora-grey/60 text-velenora-navy rounded-full text-[11px] font-medium"
                >
                  {feat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="pt-12 border-t border-velenora-grey/80">
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-velenora-navy mb-6">
          Vous pourriez aussi aimer
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {relatedProducts.map((rel) => (
            <Link
              key={rel.id}
              to={`/products/${rel.slug}`}
              className="bg-white rounded-xl border border-velenora-grey/80 p-4 shadow-luxury hover:shadow-luxury-lg transition group block"
            >
              <div className="h-48 rounded-lg overflow-hidden bg-velenora-grey/30 mb-3">
                <img
                  src={rel.images[0] || '/images/tryon/men-front-clean.jpg'}
                  alt={rel.name.fr}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/tryon/men-front-clean.jpg';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <h3 className="text-xs font-bold text-velenora-navy group-hover:text-velenora-teal transition line-clamp-1">
                {rel.name.fr}
              </h3>
              <p className="text-xs font-serif font-bold text-velenora-teal mt-1">
                {formatPrice(rel.basePriceDZD)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {showSizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-velenora-grey animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-velenora-grey">
              <h3 className="text-lg font-serif font-bold text-velenora-navy">
                Guide des Tailles Velenora (cm)
              </h3>
              <button
                type="button"
                onClick={() => setShowSizeModal(false)}
                className="text-velenora-charcoal/60 hover:text-velenora-navy text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-velenora-grey/40 text-velenora-navy">
                    <th className="p-2 font-semibold">Taille</th>
                    <th className="p-2 font-semibold">Poitrine</th>
                    <th className="p-2 font-semibold">Taille</th>
                    <th className="p-2 font-semibold">Bassin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-velenora-grey/60">
                  <tr><td className="p-2 font-bold">XS</td><td className="p-2">82-86 cm</td><td className="p-2">64-68 cm</td><td className="p-2">88-92 cm</td></tr>
                  <tr><td className="p-2 font-bold">S</td><td className="p-2">88-92 cm</td><td className="p-2">70-74 cm</td><td className="p-2">94-98 cm</td></tr>
                  <tr><td className="p-2 font-bold">M</td><td className="p-2">94-98 cm</td><td className="p-2">76-82 cm</td><td className="p-2">100-104 cm</td></tr>
                  <tr><td className="p-2 font-bold">L</td><td className="p-2">100-106 cm</td><td className="p-2">84-90 cm</td><td className="p-2">106-112 cm</td></tr>
                  <tr><td className="p-2 font-bold">XL</td><td className="p-2">108-114 cm</td><td className="p-2">92-98 cm</td><td className="p-2">114-120 cm</td></tr>
                  <tr><td className="p-2 font-bold">XXL</td><td className="p-2">116-124 cm</td><td className="p-2">100-108 cm</td><td className="p-2">122-128 cm</td></tr>
                </tbody>
              </table>
            </div>
            <button
              type="button"
              onClick={() => setShowSizeModal(false)}
              className="mt-5 w-full py-2.5 bg-velenora-navy text-white text-xs font-medium rounded-xl hover:bg-velenora-navy-light transition"
            >
              Fermer le guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
