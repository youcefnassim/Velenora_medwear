import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useI18n } from '../i18n/context';
import { CATEGORIES } from '../data/products';
import { useProducts } from '../features/catalog/productStore';
import { Sparkles, SlidersHorizontal, ArrowUpDown, Package } from 'lucide-react';

export const CatalogPage: React.FC = () => {
  const { t, formatPrice } = useI18n();
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state from URL or local
  const selectedCategory = searchParams.get('category') || 'all';
  const [selectedFit, setSelectedFit] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter products dynamically
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.categoryId === selectedCategory);
    }

    if (selectedFit !== 'all') {
      result = result.filter((p) => p.fit === selectedFit || p.fit === 'unisex');
    }

    if (selectedSize !== 'all') {
      result = result.filter((p) => p.sizes.includes(selectedSize as any));
    }

    if (selectedColor !== 'all') {
      result = result.filter((p) => p.colors.includes(selectedColor));
    }

    // Sorting
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.basePriceDZD - b.basePriceDZD);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.basePriceDZD - a.basePriceDZD);
    } else if (sortBy === 'newest') {
      result.reverse();
    }

    return result;
  }, [products, selectedCategory, selectedFit, selectedSize, selectedColor, sortBy]);

  const handleCategorySelect = (catId: string) => {
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  const clearAllFilters = () => {
    searchParams.delete('category');
    setSearchParams(searchParams);
    setSelectedFit('all');
    setSelectedSize('all');
    setSelectedColor('all');
    setSortBy('featured');
  };

  const availableColors = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.colors.forEach((c) => set.add(c)));
    return Array.from(set);
  }, [products]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Title & Header */}
      <div className="pb-8 border-b border-velenora-grey/80 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-velenora-teal">
            Collections & Modèles
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-velenora-navy mt-1">
            Boutique & Tenues Médicales
          </h1>
          <p className="text-sm text-velenora-charcoal/70 mt-1 font-light">
            Découvrez nos tenues professionnelles et personnalisez-les selon vos besoins.
          </p>
        </div>

        {/* Filter button & Sort selector */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden px-3.5 py-2 rounded-xl bg-white border border-velenora-grey/80 text-xs font-semibold text-velenora-navy shadow-sm flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-4 h-4 text-velenora-teal" />
            <span>Filtres</span>
          </button>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-velenora-grey/80 shadow-sm text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-velenora-charcoal/60" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none text-velenora-navy font-semibold focus:outline-none cursor-pointer"
            >
              <option value="featured">{t.catalog.featured}</option>
              <option value="newest">{t.catalog.newest}</option>
              <option value="price_asc">{t.catalog.priceAsc}</option>
              <option value="price_desc">{t.catalog.priceDesc}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-2xl border border-velenora-grey/80 shadow-luxury h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-velenora-grey/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-velenora-navy">
              Filtres Actifs
            </h3>
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs text-velenora-teal hover:underline"
            >
              Réinitialiser
            </button>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-velenora-navy mb-2.5">Catégorie</h4>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => handleCategorySelect('all')}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition ${
                  selectedCategory === 'all'
                    ? 'bg-velenora-teal text-white font-semibold'
                    : 'text-velenora-charcoal hover:bg-velenora-grey/40'
                }`}
              >
                Toutes les catégories
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleCategorySelect(c.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition ${
                    selectedCategory === c.id
                      ? 'bg-velenora-teal text-white font-semibold'
                      : 'text-velenora-charcoal hover:bg-velenora-grey/40'
                  }`}
                >
                  {c.name.fr}
                </button>
              ))}
            </div>
          </div>

          {/* Fit / Gender */}
          <div className="pt-4 border-t border-velenora-grey/60">
            <h4 className="text-xs font-bold text-velenora-navy mb-2.5">Coupe / Genre</h4>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'all', label: 'Tous' },
                { id: 'men', label: 'Homme' },
                { id: 'women', label: 'Femme' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFit(f.id)}
                  className={`py-1.5 px-2 rounded-lg text-xs text-center border transition ${
                    selectedFit === f.id
                      ? 'border-velenora-teal bg-velenora-teal/10 text-velenora-teal font-semibold'
                      : 'border-velenora-grey/60 text-velenora-charcoal hover:bg-velenora-grey/40'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="pt-4 border-t border-velenora-grey/60">
            <h4 className="text-xs font-bold text-velenora-navy mb-2.5">Taille</h4>
            <div className="grid grid-cols-3 gap-1.5">
              {['all', 'XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`py-1.5 px-2 rounded-lg text-xs text-center border transition ${
                    selectedSize === sz
                      ? 'border-velenora-teal bg-velenora-teal text-white font-semibold'
                      : 'border-velenora-grey/60 text-velenora-charcoal hover:bg-velenora-grey/40'
                  }`}
                >
                  {sz === 'all' ? 'Toutes' : sz}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="pt-4 border-t border-velenora-grey/60">
            <h4 className="text-xs font-bold text-velenora-navy mb-2.5">Couleurs</h4>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedColor('all')}
                className={`px-2.5 py-1 rounded-lg text-xs border ${
                  selectedColor === 'all' ? 'border-velenora-teal bg-velenora-teal/10 font-bold' : 'border-velenora-grey/60'
                }`}
              >
                Toutes
              </button>
              {availableColors.map((col, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedColor(col)}
                  className={`w-6 h-6 rounded-full border-2 transition ${
                    selectedColor === col ? 'border-velenora-teal scale-110 shadow-sm' : 'border-black/20'
                  }`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-velenora-grey/80 shadow-luxury space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-velenora-teal/10 text-velenora-teal flex items-center justify-center">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold text-velenora-navy">
                Nouvelle Collection en Préparation
              </h3>
              <p className="text-xs text-velenora-charcoal/70 max-w-md mx-auto leading-relaxed">
                Nos nouvelles tenues médicales et créations de bloc sont en cours de confection. En attendant, configurez votre tenue sur-mesure dans notre atelier 3D.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  to="/customizer"
                  className="px-5 py-2.5 bg-velenora-teal hover:bg-velenora-teal-light text-white text-xs font-bold rounded-xl shadow-luxury transition flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Personnaliser en 3D</span>
                </Link>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-velenora-grey/80 shadow-sm space-y-3">
              <p className="text-sm font-semibold text-velenora-navy">{t.catalog.noProducts}</p>
              <p className="text-xs text-velenora-charcoal/70">
                Essayez de réinitialiser vos critères de recherche ou de changer de catégorie.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-2 px-4 py-2 bg-velenora-navy text-white text-xs font-semibold rounded-lg hover:bg-velenora-navy-light transition"
              >
                {t.catalog.clearFilters}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl border border-velenora-grey/80 shadow-luxury hover:shadow-luxury-lg transition duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  <div className="relative h-64 overflow-hidden bg-velenora-grey/30">
                    <img
                      src={prod.images[0] || '/images/tryon/men-front-clean.jpg'}
                      alt={prod.name.fr}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/tryon/men-front-clean.jpg';
                      }}
                      className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-105"
                    />
                    {prod.isCustomizable && (
                      <span className="absolute top-3 left-3 bg-velenora-navy/90 backdrop-blur-sm text-velenora-ivory text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3 h-3 text-velenora-teal-light" />
                        <span>3D Sur-Mesure</span>
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-velenora-navy line-clamp-1">
                        {prod.name.fr}
                      </h3>
                      <p className="text-xs text-velenora-charcoal/70 line-clamp-2 mt-1 font-light">
                        {prod.description.fr}
                      </p>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-velenora-grey/60">
                        <div className="flex items-center gap-1">
                          {prod.colors.slice(0, 4).map((col, idx) => (
                            <span
                              key={idx}
                              className="w-3.5 h-3.5 rounded-full border border-black/20"
                              style={{ backgroundColor: col }}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-velenora-charcoal/60 font-semibold uppercase">
                          Coupe {prod.fit}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 mt-2 border-t border-velenora-grey/60 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-velenora-charcoal/60 block">À partir de</span>
                        <span className="text-sm font-serif font-bold text-velenora-navy">
                          {formatPrice(prod.basePriceDZD)}
                        </span>
                      </div>

                      {prod.isCustomizable ? (
                        <Link
                          to={`/customizer?product=${prod.id}`}
                          className="px-3.5 py-1.5 bg-velenora-teal hover:bg-velenora-teal-light text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{t.catalog.customizeBtn}</span>
                        </Link>
                      ) : (
                        <Link
                          to={`/products/${prod.slug}`}
                          className="px-3.5 py-1.5 bg-velenora-navy hover:bg-velenora-navy-light text-white text-xs font-semibold rounded-lg shadow-sm transition"
                        >
                          <span>{t.catalog.detailsBtn}</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
