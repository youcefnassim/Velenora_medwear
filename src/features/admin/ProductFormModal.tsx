import React, { useState, useEffect } from 'react';
import type { Product } from '../../types/product';
import { CATEGORIES } from '../../data/products';
import { X, Upload, Sparkles, Image, Check, AlertCircle } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Partial<Product> & { name: { fr: string; en?: string; ar?: string } }) => void;
  editingProduct?: Product | null;
}

const PRESET_STUDIO_IMAGES = [
  { label: 'Studio Homme Velenora (Blanc Pur)', url: '/images/tryon/men-front-clean.jpg' },
  { label: 'Studio Femme Velenora (Blanc Pur)', url: '/images/tryon/women-front-clean.jpg' },
  { label: 'Studio Homme Dos', url: '/images/tryon/men-back-clean.jpg' },
  { label: 'Studio Femme Dos', url: '/images/tryon/women-back-clean.jpg' },
];

const PRESET_COLORS = [
  { name: 'Bleu Marine', hex: '#142C46' },
  { name: 'Teal Médical', hex: '#2A7776' },
  { name: 'Vert Bloc', hex: '#242A31' },
  { name: 'Vert Sauge', hex: '#6A887B' },
  { name: 'Bordeaux Royal', hex: '#5E2333' },
  { name: 'Bleu Ciel', hex: '#527C99' },
  { name: 'Blanc Pur', hex: '#FFFFFF' },
  { name: 'Noir Minuit', hex: '#111827' },
];

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingProduct,
}) => {
  const [nameFr, setNameFr] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [categoryId, setCategoryId] = useState('men');
  const [fit, setFit] = useState<'men' | 'women' | 'unisex'>('men');
  const [basePriceDZD, setBasePriceDZD] = useState<number>(8200);
  const [originalPriceDZD, setOriginalPriceDZD] = useState<string>('');
  const [imageUrl, setImageUrl] = useState('/images/tryon/men-front-clean.jpg');
  const [selectedColors, setSelectedColors] = useState<string[]>(['#142C46', '#2A7776']);
  const [customColorHex, setCustomColorHex] = useState('#087A83');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['XS', 'S', 'M', 'L', 'XL', 'XXL']);
  const [isCustomizable, setIsCustomizable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(true);
  const [descriptionFr, setDescriptionFr] = useState('');
  const [composition, setComposition] = useState('72% Polyester Micro-filaments, 21% Rayonne, 7% Élasthanne Spandex');
  const [featuresList, setFeaturesList] = useState('Extensible 4D, Anti-froissement, Anti-bactérien, Ultra-respirant');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (editingProduct) {
      setNameFr(editingProduct.name.fr || '');
      setNameAr(editingProduct.name.ar || '');
      setNameEn(editingProduct.name.en || '');
      setCategoryId(editingProduct.categoryId || 'men');
      setFit(editingProduct.fit || 'men');
      setBasePriceDZD(editingProduct.basePriceDZD || 8200);
      setOriginalPriceDZD(editingProduct.originalPriceDZD ? String(editingProduct.originalPriceDZD) : '');
      setImageUrl(editingProduct.images?.[0] || '/images/tryon/men-front-clean.jpg');
      setSelectedColors(editingProduct.colors || ['#142C46']);
      setSelectedSizes(editingProduct.sizes || ['S', 'M', 'L', 'XL']);
      setIsCustomizable(editingProduct.isCustomizable !== false);
      setIsFeatured(editingProduct.isFeatured ?? true);
      setDescriptionFr(editingProduct.description?.fr || '');
      setComposition(editingProduct.fabricDetails?.composition || '72% Polyester, 21% Rayonne, 7% Élasthanne');
      setFeaturesList(editingProduct.fabricDetails?.features?.join(', ') || 'Extensible 4D, Anti-bactérien');
    } else {
      // Default clean values for creating a new product
      setNameFr('');
      setNameAr('');
      setNameEn('');
      setCategoryId('men');
      setFit('men');
      setBasePriceDZD(8200);
      setOriginalPriceDZD('');
      setImageUrl('/images/tryon/men-front-clean.jpg');
      setSelectedColors(['#142C46', '#2A7776', '#242A31']);
      setSelectedSizes(['XS', 'S', 'M', 'L', 'XL', 'XXL']);
      setIsCustomizable(true);
      setIsFeatured(true);
      setDescriptionFr('Tenue médicale d’excellence Velenora. Confort supérieur, coupe élégante et textile haute performance.');
      setComposition('72% Polyester Micro-filaments, 21% Rayonne Soyeuse, 7% Élasthanne Spandex');
      setFeaturesList('Extensible 4D, Anti-froissement, Anti-bactérien, Confort 24h');
    }
    setErrorMsg('');
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const src = loadEvent.target?.result as string;
      if (!src) return;

      // Compress via canvas to avoid exploding localStorage
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 800;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setImageUrl(dataUrl);
        } else {
          setImageUrl(src);
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const toggleColor = (hex: string) => {
    if (selectedColors.includes(hex)) {
      if (selectedColors.length > 1) {
        setSelectedColors(selectedColors.filter((c) => c !== hex));
      }
    } else {
      setSelectedColors([...selectedColors, hex]);
    }
  };

  const addCustomColor = () => {
    if (!selectedColors.includes(customColorHex)) {
      setSelectedColors([...selectedColors, customColorHex]);
    }
  };

  const toggleSize = (sz: string) => {
    if (selectedSizes.includes(sz)) {
      if (selectedSizes.length > 1) {
        setSelectedSizes(selectedSizes.filter((s) => s !== sz));
      }
    } else {
      setSelectedSizes([...selectedSizes, sz]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameFr.trim()) {
      setErrorMsg('Veuillez indiquer un nom en français pour la tenue.');
      return;
    }
    if (!basePriceDZD || basePriceDZD <= 0) {
      setErrorMsg('Veuillez indiquer un prix valide en DZD.');
      return;
    }
    if (selectedSizes.length === 0) {
      setErrorMsg('Veuillez sélectionner au moins une taille disponible.');
      return;
    }
    if (selectedColors.length === 0) {
      setErrorMsg('Veuillez sélectionner au moins une couleur.');
      return;
    }

    const features = featuresList
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    onSave({
      id: editingProduct?.id,
      categoryId,
      fit,
      name: {
        fr: nameFr.trim(),
        ar: nameAr.trim() || nameFr.trim(),
        en: nameEn.trim() || nameFr.trim(),
      },
      description: {
        fr: descriptionFr.trim() || 'Tenue médicale haut de gamme Velenora.',
        en: nameEn.trim() || nameFr.trim(),
        ar: nameAr.trim() || nameFr.trim(),
      },
      basePriceDZD: Number(basePriceDZD),
      originalPriceDZD: originalPriceDZD ? Number(originalPriceDZD) : undefined,
      images: [imageUrl || '/images/tryon/men-front-clean.jpg'],
      colors: selectedColors,
      sizes: selectedSizes as any,
      isCustomizable,
      isFeatured,
      isActive: true,
      fabricDetails: {
        composition: composition.trim() || '72% Polyester, 21% Rayonne, 7% Élasthanne',
        weight: '210 g/m²',
        features: features.length > 0 ? features : ['Extensible 4D', 'Anti-bactérien'],
      },
      estimatedProductionDays: 3,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-8 p-6 sm:p-8 shadow-2xl border border-velenora-grey/80 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-velenora-grey/80">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-velenora-teal">
              {editingProduct ? 'Modifier la tenue' : 'Nouveau Produit Boutique'}
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-velenora-navy mt-0.5">
              {editingProduct ? editingProduct.name.fr : 'Ajouter une tenue médicale'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-velenora-charcoal/60 hover:text-velenora-navy hover:bg-velenora-grey/40 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Informations Générales */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-velenora-navy border-b border-velenora-grey/40 pb-1">
              1. Identité de la tenue
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-velenora-navy">
                  Nom du produit (Français) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Ensemble Médical Signature Homme"
                  value={nameFr}
                  onChange={(e) => setNameFr(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-velenora-grey/80 focus:outline-none focus:ring-2 focus:ring-velenora-teal"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-velenora-navy">
                  Nom en Arabe (optionnel)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  placeholder="ex: طقم سكراب طبي فاخر للرجال"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-velenora-grey/80 focus:outline-none focus:ring-2 focus:ring-velenora-teal"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-velenora-navy">
                  Catégorie
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    if (e.target.value === 'men') setFit('men');
                    else if (e.target.value === 'women') setFit('women');
                    else setFit('unisex');
                  }}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-velenora-grey/80 focus:outline-none focus:ring-2 focus:ring-velenora-teal bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name.fr}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-velenora-navy">
                  Coupe / Genre
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['men', 'women', 'unisex'] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFit(f)}
                      className={`py-2 text-xs rounded-xl border font-semibold transition ${
                        fit === f
                          ? 'border-velenora-teal bg-velenora-teal text-white'
                          : 'border-velenora-grey/80 text-velenora-charcoal hover:bg-velenora-grey/40'
                      }`}
                    >
                      {f === 'men' ? 'Homme' : f === 'women' ? 'Femme' : 'Unisexe'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-velenora-navy">
                  Mise en avant
                </label>
                <button
                  type="button"
                  onClick={() => setIsFeatured(!isFeatured)}
                  className={`w-full py-2.5 text-xs rounded-xl border font-semibold transition flex items-center justify-center gap-1.5 ${
                    isFeatured
                      ? 'border-amber-500 bg-amber-50 text-amber-800'
                      : 'border-velenora-grey/80 text-velenora-charcoal'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isFeatured ? 'Affiché en vedette (Featured)' : 'Standard'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Tarification en DZD */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-velenora-navy border-b border-velenora-grey/40 pb-1">
              2. Tarification en Dinars Algériens (DZD)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-velenora-navy">
                  Prix de vente (DZD) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="100"
                    step="100"
                    required
                    value={basePriceDZD}
                    onChange={(e) => setBasePriceDZD(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-velenora-grey/80 focus:outline-none focus:ring-2 focus:ring-velenora-teal"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-velenora-charcoal/60 font-semibold">
                    DZD
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-velenora-navy">
                  Prix d’origine / barré (DZD - optionnel)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="100"
                    placeholder="ex: 9500 (affiche une remise)"
                    value={originalPriceDZD}
                    onChange={(e) => setOriginalPriceDZD(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-velenora-grey/80 focus:outline-none focus:ring-2 focus:ring-velenora-teal"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-velenora-charcoal/60 font-semibold">
                    DZD
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Photo du Produit */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-velenora-navy border-b border-velenora-grey/40 pb-1">
              3. Photo & Présentation de la Tenue
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
              {/* Image Preview */}
              <div className="sm:col-span-4 h-48 rounded-2xl overflow-hidden border border-velenora-grey/80 bg-white flex items-center justify-center relative shadow-sm">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Aperçu tenue"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/tryon/men-front-clean.jpg';
                    }}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="text-center p-4 text-velenora-charcoal/40">
                    <Image className="w-8 h-8 mx-auto mb-1" />
                    <span className="text-[10px]">Aucune image</span>
                  </div>
                )}
              </div>

              {/* Upload & Link Controls */}
              <div className="sm:col-span-8 space-y-3">
                {/* Upload Button */}
                <div className="p-3 bg-velenora-grey/20 rounded-xl border border-dashed border-velenora-grey/80 text-center space-y-1.5">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-velenora-navy hover:bg-velenora-navy-light text-white text-xs font-semibold rounded-lg shadow-sm transition">
                    <Upload className="w-3.5 h-3.5 text-velenora-teal-light" />
                    <span>Choisir une photo sur votre appareil</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[10px] text-velenora-charcoal/60">
                    JPG, PNG ou WEBP. Prise en charge directe et instantanée.
                  </p>
                </div>

                {/* Preset clean studio options */}
                <div>
                  <span className="text-[11px] font-semibold text-velenora-navy block mb-1.5">
                    Ou choisissez une photo d’atelier Velenora prête à l’emploi :
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {PRESET_STUDIO_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImageUrl(preset.url)}
                        className={`text-left p-2 rounded-lg text-[10px] font-semibold border truncate transition ${
                          imageUrl === preset.url
                            ? 'border-velenora-teal bg-velenora-teal/10 text-velenora-teal'
                            : 'border-velenora-grey/60 text-velenora-charcoal hover:bg-velenora-grey/30'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Or Direct URL Input */}
                <div className="space-y-1 pt-1">
                  <label className="text-[11px] font-semibold text-velenora-navy">
                    Ou collez une URL d'image web :
                  </label>
                  <input
                    type="text"
                    placeholder="https://... ou /images/..."
                    value={imageUrl.startsWith('data:') ? 'Image importée depuis votre ordinateur' : imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-velenora-grey/80 focus:outline-none focus:ring-1 focus:ring-velenora-teal"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Tailles & Couleurs */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-velenora-navy border-b border-velenora-grey/40 pb-1">
              4. Tailles & Couleurs disponibles
            </h3>

            {/* Sizes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-velenora-navy">
                Tailles disponibles pour vos clients :
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_SIZES.map((sz) => {
                  const isChecked = selectedSizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => toggleSize(sz)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                        isChecked
                          ? 'border-velenora-teal bg-velenora-teal text-white shadow-sm'
                          : 'border-velenora-grey/80 text-velenora-charcoal hover:bg-velenora-grey/40'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-velenora-navy">
                Couleurs disponibles pour ce modèle :
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {PRESET_COLORS.map((c) => {
                  const isSelected = selectedColors.includes(c.hex);
                  return (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => toggleColor(c.hex)}
                      className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
                        isSelected
                          ? 'border-velenora-teal bg-velenora-teal/10 text-velenora-teal font-semibold'
                          : 'border-velenora-grey/80 text-velenora-charcoal hover:bg-velenora-grey/40'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-velenora-teal ml-0.5" />}
                    </button>
                  );
                })}
              </div>

              {/* Add custom hex */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="color"
                  value={customColorHex}
                  onChange={(e) => setCustomColorHex(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                />
                <input
                  type="text"
                  value={customColorHex}
                  onChange={(e) => setCustomColorHex(e.target.value)}
                  placeholder="#087A83"
                  className="w-24 px-2.5 py-1.5 text-xs rounded-lg border border-velenora-grey/80 font-mono"
                />
                <button
                  type="button"
                  onClick={addCustomColor}
                  className="px-3 py-1.5 bg-velenora-grey/40 hover:bg-velenora-grey/60 text-xs font-semibold text-velenora-navy rounded-lg transition"
                >
                  + Ajouter couleur personnalisée
                </button>
              </div>
            </div>
          </div>

          {/* Section 5: Personnalisation 3D */}
          <div className="p-4 bg-velenora-teal/5 rounded-2xl border border-velenora-teal/20 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-velenora-teal" />
                <span className="text-xs font-bold text-velenora-navy">
                  Personnalisation 3D & Essayage Virtuel
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomizable(!isCustomizable)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  isCustomizable ? 'bg-velenora-teal' : 'bg-velenora-grey'
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    isCustomizable ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-velenora-charcoal/70">
              {isCustomizable
                ? 'Actif : Les clients pourront ouvrir le Configurateur 3D Velenora avec mannequin 360°, choisir les teintes et ajouter leurs broderies sur ce modèle.'
                : 'Inactif : Produit prêt-à-porter standard vendu sans passage par le configurateur 3D.'}
            </p>
          </div>

          {/* Section 6: Détails Matière */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-velenora-navy border-b border-velenora-grey/40 pb-1">
              5. Description & Détails Textiles
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-velenora-navy">
                  Description du modèle
                </label>
                <textarea
                  rows={2}
                  value={descriptionFr}
                  onChange={(e) => setDescriptionFr(e.target.value)}
                  placeholder="Coupe cintrée, coutures renforcées, poches cargo..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-velenora-grey/80 focus:outline-none focus:ring-2 focus:ring-velenora-teal"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-velenora-navy">
                    Composition textile
                  </label>
                  <input
                    type="text"
                    value={composition}
                    onChange={(e) => setComposition(e.target.value)}
                    placeholder="72% Polyester, 21% Rayonne, 7% Élasthanne"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-velenora-grey/80 focus:outline-none focus:ring-2 focus:ring-velenora-teal"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-velenora-navy">
                    Caractéristiques clés (séparées par des virgules)
                  </label>
                  <input
                    type="text"
                    value={featuresList}
                    onChange={(e) => setFeaturesList(e.target.value)}
                    placeholder="Extensible 4D, Anti-bactérien, Sans repassage"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-velenora-grey/80 focus:outline-none focus:ring-2 focus:ring-velenora-teal"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit & Cancel Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-velenora-grey/80">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-velenora-grey/80 text-xs font-semibold text-velenora-charcoal hover:bg-velenora-grey/40 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-velenora-teal hover:bg-velenora-teal-light text-white text-xs font-bold shadow-luxury transition"
            >
              {editingProduct ? 'Enregistrer les modifications' : 'Publier dans la Boutique'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
