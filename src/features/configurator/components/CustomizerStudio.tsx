import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../../i18n/context';
import { useCart } from '../../cart/context/CartContext';
import type { CustomizationConfig, GarmentType, GenderFit, ColorDefinition } from '../../../types/configurator';
import type { Product } from '../../../types/product';
import type { Language } from '../../../i18n/translations';
import {
  CURATED_COLORS,
  EMBROIDERY_COLORS,
  NECKLINE_OPTIONS,
  SLEEVE_OPTIONS,
  POCKET_OPTIONS,
  PANTS_FIT_OPTIONS,
  EMBROIDERY_POSITIONS,
  EMBROIDERY_FONTS,
  EMBROIDERY_PRICE_DZD,
} from '../configuration/options';
import { calculateCustomizationPrice } from '../pricing/calculatePrice';
import { validateCustomizationConfig } from '../validation/validateConfig';
import { ScrubScene3D } from './ScrubScene3D';
import {
  Check,
  Ruler,
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface CustomizerStudioProps {
  baseProduct?: Product;
}

type WizardStepId = 'fit' | 'garment' | 'colors' | 'style' | 'embroidery' | 'size';

const ALL_STEPS: WizardStepId[] = ['fit', 'garment', 'colors', 'style', 'embroidery', 'size'];

function localizedName(
  name: { fr: string; en: string; ar: string },
  language: Language
): string {
  return name[language] || name.fr;
}

const COLOR_CATEGORIES = [
  { id: 'all', label: 'Toutes (24)' },
  { id: 'blues', label: 'Bleus (6)', ids: ['navy', 'petrol', 'royal_blue', 'ceil_blue', 'caribbean', 'hospital_blue'] },
  { id: 'greens', label: 'Verts Bloc (6)', ids: ['surgical_green', 'hunter_green', 'sage', 'olive', 'mint', 'teal'] },
  { id: 'purples', label: 'Bordeaux (4)', ids: ['burgundy', 'plum', 'purple', 'lavender'] },
  { id: 'pinks', label: 'Pastels (3)', ids: ['powder', 'coral_rose', 'peach'] },
  { id: 'neutrals', label: 'Neutres (5)', ids: ['black', 'charcoal', 'grey', 'white', 'khaki'] },
];

export const CustomizerStudio: React.FC<CustomizerStudioProps> = ({ baseProduct }) => {
  const { t, formatPrice, language } = useI18n();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [stepIndex, setStepIndex] = useState(0);
  const [colorTarget, setColorTarget] = useState<'top' | 'pants' | 'details'>('top');
  const [colorCategory, setColorCategory] = useState<string>('all');
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [config, setConfig] = useState<CustomizationConfig>({
    garmentType: 'set',
    fit: (baseProduct?.fit as GenderFit) || 'men',
    size: 'M',
    topColor: CURATED_COLORS[0],
    pantsColor: CURATED_COLORS[0],
    accentColor: CURATED_COLORS[6],
    neckline: 'v_neck',
    sleeve: 'short',
    pocket: 'single_chest',
    pantsFit: 'standard',
    waistband: 'elastic_drawstring',
    embroidery: {
      enabled: false,
      line1: '',
      line2: '',
      position: 'left_chest',
      font: 'classic_serif',
      colorHex: '#FFFFFF',
      colorName: 'Blanc Pur',
    },
    productId: baseProduct?.id || 'velenora-signature-custom',
    productName: baseProduct?.name.fr || 'Uniforme Médical Sur-Mesure',
  });

  const steps = useMemo(() => {
    if (config.garmentType === 'pants') {
      return ALL_STEPS.filter((s) => s !== 'style');
    }
    return ALL_STEPS;
  }, [config.garmentType]);

  const displayedColors = useMemo(() => {
    if (colorCategory === 'all') return CURATED_COLORS;
    const cat = COLOR_CATEGORIES.find((c) => c.id === colorCategory);
    if (!cat || !cat.ids) return CURATED_COLORS;
    return CURATED_COLORS.filter((c) => cat.ids.includes(c.id));
  }, [colorCategory]);

  useEffect(() => {
    setStepIndex((i) => Math.min(i, steps.length - 1));
  }, [steps]);

  const safeStepIndex = Math.min(stepIndex, steps.length - 1);
  const currentStep = steps[safeStepIndex];
  const isFirst = safeStepIndex === 0;
  const isLast = safeStepIndex === steps.length - 1;

  const pricing = calculateCustomizationPrice(config);

  const handleUpdate = (updates: Partial<CustomizationConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
    setValidationErrors({});
  };

  const handleColorSelect = (col: ColorDefinition) => {
    if (colorTarget === 'top') handleUpdate({ topColor: col });
    else if (colorTarget === 'pants') handleUpdate({ pantsColor: col });
    else handleUpdate({ accentColor: col });
  };

  const currentColorSelected =
    colorTarget === 'top'
      ? config.topColor
      : colorTarget === 'pants'
        ? config.pantsColor
        : config.accentColor;

  const stepLabel = (id: WizardStepId): string => {
    const labels = t.customizer.wizard;
    switch (id) {
      case 'fit':
        return labels.stepFit;
      case 'garment':
        return labels.stepGarment;
      case 'colors':
        return labels.stepColors;
      case 'style':
        return labels.stepStyle;
      case 'embroidery':
        return labels.stepEmbroidery;
      case 'size':
        return labels.stepSize;
    }
  };

  const stepHint = (id: WizardStepId): string => {
    const labels = t.customizer.wizard;
    switch (id) {
      case 'fit':
        return labels.hintFit;
      case 'garment':
        return labels.hintGarment;
      case 'colors':
        return labels.hintColors;
      case 'style':
        return labels.hintStyle;
      case 'embroidery':
        return labels.hintEmbroidery;
      case 'size':
        return labels.hintSize;
    }
  };

  const goNext = () => {
    if (currentStep === 'embroidery' && config.embroidery.enabled) {
      if (!config.embroidery.line1.trim() && !config.embroidery.line2.trim()) {
        setValidationErrors({
          'embroidery.text': t.customizer.wizard.embroideryRequired,
        });
        return;
      }
    }
    setValidationErrors({});
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  };

  const goBack = () => {
    setValidationErrors({});
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const jumpToStep = (index: number) => {
    if (index <= safeStepIndex) setStepIndex(index);
  };

  const handleAddToCart = () => {
    const validation = validateCustomizationConfig(config);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    const productProxy: Product = baseProduct || {
      id: config.productId,
      slug: 'custom-scrub-set',
      categoryId: config.fit === 'men' ? 'men' : 'women',
      name: {
        fr: `Ensemble Médical Personnalisé — ${config.topColor.name.fr}`,
        en: `Custom Medical Scrub Set — ${config.topColor.name.en}`,
        ar: `طقم طبي مخصص — ${config.topColor.name.ar}`,
      },
      description: {
        fr: 'Tenue médicale sur-mesure confectionnée dans notre atelier.',
        en: 'Custom tailored medical scrub crafted in our atelier.',
        ar: 'زي طبي مخصص تم تفصيله في ورشتنا.',
      },
      basePriceDZD: pricing.basePriceDZD,
      images: [
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1000&auto=format&fit=crop',
      ],
      colors: [config.topColor.hex],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      fit: config.fit,
      isCustomizable: true,
      fabricDetails: {
        composition: '72% Polyester, 21% Rayonne, 7% Spandex',
        weight: '210 g/m²',
        features: ['Respirant', 'Stretch 4D', 'Anti-froissement'],
      },
      estimatedProductionDays: 3,
      isActive: true,
    };

    addItem({
      product: productProxy,
      size: config.size,
      quantity: 1,
      customization: { config, pricing },
    });

    setToastMessage(t.customizer.wizard.addedToCart);
    setTimeout(() => {
      setToastMessage(null);
      navigate('/cart');
    }, 1200);
  };

  const renderStepBody = () => {
    switch (currentStep) {
      case 'fit':
        return (
          <div className="grid grid-cols-2 gap-3">
            {([
              { id: 'men' as const, label: t.customizer.menFit },
              { id: 'women' as const, label: t.customizer.womenFit },
            ]).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleUpdate({ fit: item.id })}
                className={`py-6 rounded-2xl border text-base font-semibold transition ${
                  config.fit === item.id
                    ? 'border-[#142C46] bg-[#142C46] text-white shadow-sm'
                    : 'border-[#E1E5E8] bg-white text-[#10263B] hover:bg-[#F1F2F3]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        );

      case 'garment':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'set' as GarmentType, label: t.customizer.matchingSet },
              { id: 'top' as GarmentType, label: t.customizer.topOnly },
              { id: 'pants' as GarmentType, label: t.customizer.pantsOnly },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  handleUpdate({ garmentType: item.id });
                  if (item.id === 'pants' && colorTarget === 'top') setColorTarget('pants');
                  if (item.id === 'top' && colorTarget === 'pants') setColorTarget('top');
                }}
                className={`p-4 rounded-2xl border text-center transition ${
                  config.garmentType === item.id
                    ? 'border-[#142C46] bg-[#F1F2F3] ring-1 ring-[#142C46]'
                    : 'border-[#E1E5E8] hover:border-[#10263B] bg-white'
                }`}
              >
                <span className="block text-xs font-bold uppercase tracking-wider text-[#087A83] mb-2">
                  {item.id === 'set' ? 'SET' : item.id === 'top' ? 'TOP' : 'BAS'}
                </span>
                <span className="text-sm font-semibold text-[#10263B]">{item.label}</span>
              </button>
            ))}
          </div>
        );

      case 'colors':
        return (
          <div className="space-y-3.5">
            {/* Target Selector Tabs: Haut, Pantalon, Détails */}
            <div className="flex bg-[#F1F2F3] p-1 rounded-xl">
              {(
                [
                  { id: 'top' as const, label: t.customizer.wizard.top, show: config.garmentType !== 'pants' },
                  { id: 'pants' as const, label: t.customizer.wizard.pants, show: config.garmentType !== 'top' },
                  { id: 'details' as const, label: t.customizer.wizard.accent, show: true },
                ] as const
              )
                .filter((tab) => tab.show)
                .map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setColorTarget(tab.id)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                      colorTarget === tab.id
                        ? 'bg-[#142C46] text-white shadow-sm'
                        : 'text-[#10263B] hover:text-[#087A83]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
            </div>

            {/* Active Nuance Live Bar */}
            <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-[#F8FAFC] to-[#F1F2F3] rounded-xl border border-[#E1E5E8]">
              <div className="flex items-center gap-2">
                <span
                  className="w-5 h-5 rounded-full border border-black/15 shadow-xs shrink-0"
                  style={{ backgroundColor: currentColorSelected.hex }}
                />
                <div>
                  <span className="block text-xs font-bold text-[#10263B] leading-tight">
                    {localizedName(currentColorSelected.name, language)}
                  </span>
                  <span className="block text-[10px] text-[#667586] leading-none mt-0.5">
                    {currentColorSelected.fabricTone}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white border border-[#E1E5E8] text-[#142C46]">
                {currentColorSelected.hex.toUpperCase()}
              </span>
            </div>

            {/* Category Filter Pills: All 24 Colors Accessible */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {COLOR_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setColorCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition ${
                    colorCategory === cat.id
                      ? 'bg-[#142C46] text-white shadow-xs'
                      : 'bg-[#F1F2F3] text-[#667586] hover:bg-[#E1E5E8] hover:text-[#10263B]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Grid of All Available Colors (6 Columns) */}
            <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
              {displayedColors.map((col) => {
                const isSelected = currentColorSelected.id === col.id;
                const isLight = col.hex === '#FFFFFF' || col.id === 'powder' || col.id === 'peach' || col.id === 'mint';
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => handleColorSelect(col)}
                    className={`relative w-10 h-10 sm:w-11 sm:h-11 mx-auto rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-[#142C46] ring-2 ring-offset-2 ring-[#142C46] scale-110 shadow-md'
                        : 'border-[#E1E5E8] hover:scale-105 hover:border-[#10263B]'
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={`${localizedName(col.name, language)} (${col.fabricTone})`}
                    aria-label={localizedName(col.name, language)}
                  >
                    {isSelected && (
                      <Check
                        className={`w-4 h-4 stroke-[2.5] ${
                          isLight ? 'text-[#10263B]' : 'text-white'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom HEX Color Picker Option */}
            <div className="pt-1 flex items-center justify-between text-xs border-t border-[#E1E5E8]">
              <span className="text-[11px] text-[#667586]">
                Besoin d'une teinte clinique spécifique ?
              </span>
              <label className="inline-flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-[#087A83] hover:underline">
                <span>+ Nuance sur-mesure</span>
                <input
                  type="color"
                  value={currentColorSelected.hex}
                  onChange={(e) => {
                    const customHex = e.target.value.toUpperCase();
                    const customCol: ColorDefinition = {
                      id: `custom-${customHex}`,
                      name: { fr: `Sur-mesure ${customHex}`, en: `Custom ${customHex}`, ar: `مخصص ${customHex}` },
                      hex: customHex,
                      fabricTone: 'Finition Atelier',
                    };
                    handleColorSelect(customCol);
                  }}
                  className="w-5 h-5 rounded cursor-pointer border border-[#E1E5E8] p-0"
                />
              </label>
            </div>
          </div>
        );

      case 'style':
        return (
          <div className="space-y-4">
            {/* Live Style Active Configuration Summary */}
            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E1E5E8]">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#142C46] mb-1.5">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#087A83]" />
                  Aperçu de votre configuration de coupe
                </span>
                <span className="text-[#087A83]">
                  {pricing.sleevePriceDZD + pricing.pocketPriceDZD > 0
                    ? `+${formatPrice(pricing.sleevePriceDZD + pricing.pocketPriceDZD)}`
                    : 'Inclus'}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-[#E1E5E8] text-[10px] font-semibold text-[#10263B]">
                  Col: {localizedName(NECKLINE_OPTIONS.find((n) => n.id === config.neckline)?.label || { fr: 'Col V', en: 'V-Neck', ar: 'ياقة V' }, language)}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-[#E1E5E8] text-[10px] font-semibold text-[#10263B]">
                  Manches: {localizedName(SLEEVE_OPTIONS.find((s) => s.id === config.sleeve)?.label || { fr: 'Courtes', en: 'Short', ar: 'قصيرة' }, language)}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-[#E1E5E8] text-[10px] font-semibold text-[#10263B]">
                  Poches: {localizedName(POCKET_OPTIONS.find((p) => p.id === config.pocket)?.label || { fr: 'Standard', en: 'Standard', ar: 'قياسي' }, language)}
                </span>
                {config.garmentType !== 'top' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-[#E1E5E8] text-[10px] font-semibold text-[#10263B]">
                    Pantalon: {localizedName(PANTS_FIT_OPTIONS.find((pf) => pf.id === config.pantsFit)?.label || { fr: 'Classique', en: 'Classic', ar: 'كلاسيكي' }, language)}
                  </span>
                )}
              </div>
            </div>

            {config.garmentType !== 'pants' && (
              <>
                {/* 1. Type de Col */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#10263B]">{t.customizer.neckline}</span>
                    <span className="text-[10px] text-[#087A83] font-medium">Inclus</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {NECKLINE_OPTIONS.map((neck) => {
                      const isSel = config.neckline === neck.id;
                      return (
                        <button
                          key={neck.id}
                          type="button"
                          onClick={() => handleUpdate({ neckline: neck.id })}
                          className={`py-2.5 px-2 rounded-xl border text-center text-xs font-semibold transition-all duration-150 flex items-center justify-center gap-1.5 ${
                            isSel
                              ? 'border-[#142C46] bg-[#142C46] text-white shadow-sm ring-1 ring-[#142C46]'
                              : 'border-[#E1E5E8] bg-white text-[#10263B] hover:bg-[#F1F2F3] hover:border-[#CAD0D7]'
                          }`}
                        >
                          {isSel && <Check className="w-3.5 h-3.5 stroke-[2.5] text-white shrink-0" />}
                          <span>{localizedName(neck.label, language)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Longueur des Manches */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#10263B]">{t.customizer.sleeves}</span>
                    <span className="text-[10px] text-[#667586]">
                      {config.sleeve === 'long' ? '+700 DZD' : 'Inclus'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {SLEEVE_OPTIONS.map((slv) => {
                      const isSel = config.sleeve === slv.id;
                      return (
                        <button
                          key={slv.id}
                          type="button"
                          onClick={() => handleUpdate({ sleeve: slv.id })}
                          className={`py-2.5 px-3 rounded-xl border text-center transition-all duration-150 ${
                            isSel
                              ? 'border-[#142C46] bg-[#142C46] text-white shadow-sm ring-1 ring-[#142C46]'
                              : 'border-[#E1E5E8] bg-white text-[#10263B] hover:bg-[#F1F2F3] hover:border-[#CAD0D7]'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold">
                            {isSel && <Check className="w-3.5 h-3.5 stroke-[2.5] text-white shrink-0" />}
                            <span>{localizedName(slv.label, language)}</span>
                          </div>
                          <span
                            className={`block text-[10px] mt-0.5 font-medium ${
                              isSel ? 'text-white/85' : 'text-[#087A83]'
                            }`}
                          >
                            {slv.addonDZD === 0
                              ? t.customizer.wizard.included
                              : `+${formatPrice(slv.addonDZD)}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Configuration des Poches */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#10263B]">{t.customizer.pockets}</span>
                    <span className="text-[10px] text-[#667586]">
                      {config.pocket === 'single_chest' ? 'Inclus' : config.pocket === 'double_chest' ? '+400 DZD' : '+700 DZD'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {POCKET_OPTIONS.map((pock) => {
                      const isSel = config.pocket === pock.id;
                      return (
                        <button
                          key={pock.id}
                          type="button"
                          onClick={() => handleUpdate({ pocket: pock.id })}
                          className={`py-2 px-1.5 rounded-xl border text-center transition-all duration-150 ${
                            isSel
                              ? 'border-[#142C46] bg-[#142C46] text-white shadow-sm ring-1 ring-[#142C46]'
                              : 'border-[#E1E5E8] bg-white text-[#10263B] hover:bg-[#F1F2F3] hover:border-[#CAD0D7]'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1 text-xs font-semibold">
                            {isSel && <Check className="w-3 h-3 stroke-[2.5] text-white shrink-0" />}
                            <span className="truncate">{localizedName(pock.label, language)}</span>
                          </div>
                          <span
                            className={`block text-[9.5px] mt-0.5 font-medium ${
                              isSel ? 'text-white/85' : 'text-[#087A83]'
                            }`}
                          >
                            {pock.addonDZD > 0 ? `+${formatPrice(pock.addonDZD)}` : t.customizer.wizard.included}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {config.garmentType !== 'top' && (
              /* 4. Coupe du Pantalon */
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#10263B]">{t.customizer.pantsFit}</span>
                  <span className="text-[10px] text-[#087A83] font-medium">Inclus</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {PANTS_FIT_OPTIONS.map((pFit) => {
                    const isSel = config.pantsFit === pFit.id;
                    return (
                      <button
                        key={pFit.id}
                        type="button"
                        onClick={() => handleUpdate({ pantsFit: pFit.id })}
                        className={`py-2.5 px-2 rounded-xl border text-center text-xs font-semibold transition-all duration-150 flex items-center justify-center gap-1.5 ${
                          isSel
                            ? 'border-[#142C46] bg-[#142C46] text-white shadow-sm ring-1 ring-[#142C46]'
                            : 'border-[#E1E5E8] bg-white text-[#10263B] hover:bg-[#F1F2F3] hover:border-[#CAD0D7]'
                        }`}
                      >
                        {isSel && <Check className="w-3.5 h-3.5 stroke-[2.5] text-white shrink-0" />}
                        <span>{localizedName(pFit.label, language)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );

      case 'embroidery':
        return (
          <div className="space-y-2.5">
            {/* Ultra-Compact Toggle Bar */}
            <button
              type="button"
              onClick={() =>
                handleUpdate({
                  embroidery: {
                    ...config.embroidery,
                    enabled: !config.embroidery.enabled,
                    line1: !config.embroidery.enabled ? (config.embroidery.line1 || 'Dr. ') : '',
                  },
                })
              }
              className={`w-full py-2.5 px-3 rounded-xl border text-left transition flex items-center justify-between ${
                config.embroidery.enabled
                  ? 'border-[#087A83] bg-[#087A83]/5 ring-1 ring-[#087A83]'
                  : 'border-[#E1E5E8] bg-white hover:bg-[#F1F2F3]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                    config.embroidery.enabled
                      ? 'bg-[#087A83] border-[#087A83] text-white'
                      : 'border-[#CAD0D7] bg-white'
                  }`}
                >
                  {config.embroidery.enabled && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <div>
                  <span className="text-xs font-bold text-[#10263B]">
                    {t.customizer.embroiderySection}
                  </span>
                  <span className="text-[11px] text-[#087A83] font-semibold ml-2">
                    +{formatPrice(EMBROIDERY_PRICE_DZD)}
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-[#667586] font-medium hidden sm:inline">
                {config.embroidery.enabled ? 'Activée' : 'Désactivée'}
              </span>
            </button>

            {/* When Enabled: Ultra-Compact High-Density Configuration */}
            {config.embroidery.enabled && (
              <div className="space-y-2.5 pt-0.5 animate-fade-in">
                {/* Compact 2-Column Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#10263B] mb-0.5">
                      <span>{t.customizer.nameLabel}</span>
                      <span className="text-[10px] text-[#667586]">{config.embroidery.line1.length}/30</span>
                    </div>
                    <input
                      type="text"
                      maxLength={30}
                      value={config.embroidery.line1}
                      onChange={(e) =>
                        handleUpdate({
                          embroidery: { ...config.embroidery, line1: e.target.value, enabled: true },
                        })
                      }
                      placeholder={t.customizer.namePlaceholder}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#CAD0D7] bg-white focus:outline-none focus:ring-1 focus:ring-[#087A83] transition"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#10263B] mb-0.5">
                      <span>{t.customizer.specialtyLabel}</span>
                      <span className="text-[10px] text-[#667586]">{config.embroidery.line2.length}/30</span>
                    </div>
                    <input
                      type="text"
                      maxLength={30}
                      value={config.embroidery.line2}
                      onChange={(e) =>
                        handleUpdate({
                          embroidery: { ...config.embroidery, line2: e.target.value, enabled: true },
                        })
                      }
                      placeholder={t.customizer.specialtyPlaceholder}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#CAD0D7] bg-white focus:outline-none focus:ring-1 focus:ring-[#087A83] transition"
                    />
                  </div>
                </div>

                {/* Compact Font Selector (Segmented 3-Button Control) */}
                <div>
                  <span className="block text-[11px] font-semibold text-[#10263B] mb-1">
                    {t.customizer.fontLabel}
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {EMBROIDERY_FONTS.map((f) => {
                      const isSel = config.embroidery.font === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() =>
                            handleUpdate({ embroidery: { ...config.embroidery, font: f.id } })
                          }
                          className={`py-1.5 px-2 rounded-lg border text-xs text-center font-medium transition flex items-center justify-center gap-1 ${
                            isSel
                              ? 'border-[#142C46] bg-[#142C46] text-white shadow-xs'
                              : 'border-[#E1E5E8] bg-white text-[#10263B] hover:bg-[#F1F2F3]'
                          }`}
                        >
                          {isSel && <Check className="w-3 h-3 shrink-0 stroke-[2.5]" />}
                          <span
                            className={
                              f.id === 'classic_serif'
                                ? 'font-serif'
                                : f.id === 'script'
                                  ? 'italic font-serif'
                                  : 'font-sans'
                            }
                          >
                            {f.id === 'classic_serif'
                              ? 'Sérif Élégant'
                              : f.id === 'modern_sans'
                                ? 'Moderne'
                                : 'Cursive'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Compact Thread Color Swatches */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-[#10263B]">{t.customizer.embroideryColor}</span>
                    <span className="text-[10px] text-[#087A83] font-semibold">
                      {config.embroidery.colorName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {EMBROIDERY_COLORS.map((col) => {
                      const isSel = config.embroidery.colorHex === col.hex;
                      return (
                        <button
                          key={col.id}
                          type="button"
                          onClick={() =>
                            handleUpdate({
                              embroidery: {
                                ...config.embroidery,
                                colorHex: col.hex,
                                colorName: col.name,
                              },
                            })
                          }
                          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSel
                              ? 'border-[#142C46] ring-2 ring-offset-1 ring-[#142C46] scale-110 shadow-sm'
                              : 'border-[#E1E5E8] hover:scale-105'
                          }`}
                          style={{ backgroundColor: col.hex }}
                          title={col.name}
                        >
                          {isSel && (
                            <Check
                              className={`w-3.5 h-3.5 stroke-[3] ${
                                col.hex === '#FFFFFF' ? 'text-[#10263B]' : 'text-white'
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Compact Placement (3-Column Segmented Row instead of tall cards) */}
                <div>
                  <span className="block text-[11px] font-semibold text-[#10263B] mb-1">
                    {t.customizer.positionLabel}
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {EMBROIDERY_POSITIONS.map((pos) => {
                      const isSel = config.embroidery.position === pos.id;
                      return (
                        <button
                          key={pos.id}
                          type="button"
                          onClick={() =>
                            handleUpdate({
                              embroidery: { ...config.embroidery, position: pos.id },
                            })
                          }
                          className={`py-1.5 px-2 rounded-lg border text-xs text-center font-medium transition flex items-center justify-center gap-1 ${
                            isSel
                              ? 'border-[#142C46] bg-[#142C46] text-white shadow-xs'
                              : 'border-[#E1E5E8] bg-white text-[#10263B] hover:bg-[#F1F2F3]'
                          }`}
                        >
                          {isSel && <Check className="w-3 h-3 shrink-0 stroke-[2.5]" />}
                          <span>
                            {pos.id === 'left_chest'
                              ? 'Côté Cœur'
                              : pos.id === 'right_chest'
                                ? 'Côté Droit'
                                : 'Manche'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Ultra-Compact Live Embroidery Preview Badge */}
                <div className="py-2 px-3 bg-gradient-to-r from-[#142C46]/5 to-[#087A83]/5 rounded-xl border border-[#E1E5E8] flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-[#667586] font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#087A83]" />
                    {t.customizer.wizard.embroideryPreview}
                  </span>
                  <div
                    className="px-2.5 py-1 rounded-md bg-[#142C46] border border-white/20 text-right shadow-xs min-w-[140px]"
                    style={{
                      color: config.embroidery.colorHex,
                      textShadow: '0 1px 2px rgba(0,0,0,0.9)',
                    }}
                  >
                    <span
                      className={`text-xs font-bold block leading-none truncate ${
                        config.embroidery.font === 'classic_serif'
                          ? 'font-serif'
                          : config.embroidery.font === 'script'
                            ? 'italic font-serif'
                            : 'tracking-wide font-sans'
                      }`}
                    >
                      {config.embroidery.line1.trim() || t.customizer.wizard.yourNameHere}
                    </span>
                    {config.embroidery.line2.trim() && (
                      <span className="text-[9px] opacity-85 block leading-tight mt-0.5 truncate">
                        {config.embroidery.line2.trim()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'size':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#10263B]">{t.customizer.sizeSelection}</span>
              <button
                type="button"
                onClick={() => setShowSizeModal(true)}
                className="text-xs text-[#087A83] hover:underline flex items-center gap-1 font-semibold"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>{t.customizer.wizard.sizeGuide}</span>
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => handleUpdate({ size: sz })}
                  className={`py-3.5 rounded-xl border text-center text-sm font-bold transition ${
                    config.size === sz
                      ? 'border-[#142C46] bg-[#142C46] text-white shadow-sm'
                      : 'border-[#E1E5E8] bg-white text-[#10263B] hover:bg-[#F1F2F3]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-[#E1E5E8] bg-[#F1F2F3] p-4 space-y-2 text-xs text-[#667586]">
              <div className="flex justify-between">
                <span>{t.customizer.basePrice}</span>
                <span className="font-semibold text-[#10263B]">{formatPrice(pricing.basePriceDZD)}</span>
              </div>
              {pricing.sleevePriceDZD > 0 && (
                <div className="flex justify-between">
                  <span>{t.customizer.sleeves}</span>
                  <span className="font-semibold text-[#10263B]">+{formatPrice(pricing.sleevePriceDZD)}</span>
                </div>
              )}
              {pricing.pocketPriceDZD > 0 && (
                <div className="flex justify-between">
                  <span>{t.customizer.pockets}</span>
                  <span className="font-semibold text-[#10263B]">+{formatPrice(pricing.pocketPriceDZD)}</span>
                </div>
              )}
              {pricing.embroideryPriceDZD > 0 && (
                <div className="flex justify-between">
                  <span>{t.customizer.embroiderySection}</span>
                  <span className="font-semibold text-[#10263B]">
                    +{formatPrice(pricing.embroideryPriceDZD)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-[#E1E5E8] text-sm">
                <span className="font-semibold text-[#10263B]">{t.customizer.totalPrice}</span>
                <span className="font-serif font-bold text-[#142C46] text-lg">
                  {formatPrice(pricing.totalPriceDZD)}
                </span>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-[#F1F2F3] min-h-[calc(100vh-80px)] py-4 px-3 sm:px-4 lg:px-6">
      {toastMessage && (
        <div className="fixed top-24 end-6 z-50 bg-[#142C46] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-fade-in border border-white/20">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto mb-4">
        <div className="bg-white rounded-2xl border border-[#E1E5E8] px-4 py-3 sm:px-5">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-3">
            <div>
              <h1 className="text-lg sm:text-xl font-serif font-bold text-[#10263B]">
                {t.customizer.title}
              </h1>
              <p className="text-xs text-[#667586] mt-0.5">{t.customizer.subtitle}</p>
            </div>
            <p className="text-xs font-semibold text-[#087A83]">
              {t.customizer.wizard.stepOf
                .replace('{current}', String(safeStepIndex + 1))
                .replace('{total}', String(steps.length))}
            </p>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {steps.map((step, index) => {
              const done = index < safeStepIndex;
              const active = index === safeStepIndex;
              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => jumpToStep(index)}
                  className={`flex items-center gap-1.5 shrink-0 px-2.5 py-1.5 rounded-full text-[11px] font-semibold transition ${
                    active
                      ? 'bg-[#142C46] text-white'
                      : done
                        ? 'bg-[#087A83]/15 text-[#087A83]'
                        : 'bg-[#F1F2F3] text-[#667586]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      active
                        ? 'bg-white/20'
                        : done
                          ? 'bg-[#087A83] text-white'
                          : 'bg-white text-[#667586]'
                    }`}
                  >
                    {done ? <Check className="w-3 h-3" /> : index + 1}
                  </span>
                  <span className="hidden sm:inline">{stepLabel(step)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-5 xl:col-span-4 order-2 lg:order-1">
          <div className="bg-white rounded-2xl border border-[#E1E5E8] shadow-panel p-5 flex flex-col min-h-[420px] lg:min-h-[calc(100vh-220px)]">
            <div className="mb-4">
              <h2 className="text-base font-serif font-bold text-[#10263B]">
                {safeStepIndex + 1}. {stepLabel(currentStep)}
              </h2>
              <p className="text-xs text-[#667586] mt-1 leading-relaxed">{stepHint(currentStep)}</p>
            </div>

            {Object.keys(validationErrors).length > 0 && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{Object.values(validationErrors)[0]}</span>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">{renderStepBody()}</div>

            <div className="pt-4 mt-4 border-t border-[#E1E5E8] space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-medium text-[#667586]">
                  {t.customizer.wizard.estimatedPrice}
                </span>
                <span className="text-xl font-serif font-bold text-[#142C46]">
                  {formatPrice(pricing.totalPriceDZD)}
                </span>
              </div>

              <div className="flex gap-2">
                {!isFirst && (
                  <button
                    type="button"
                    onClick={goBack}
                    className="px-4 py-3.5 rounded-xl border border-[#E1E5E8] text-[#10263B] text-xs font-bold hover:bg-[#F1F2F3] transition flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                    {t.customizer.wizard.back}
                  </button>
                )}

                {!isLast ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="flex-1 py-3.5 px-4 rounded-xl bg-[#142C46] hover:bg-[#10263B] text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-1"
                  >
                    {currentStep === 'embroidery' && !config.embroidery.enabled
                      ? t.customizer.wizard.skipEmbroidery
                      : t.customizer.wizard.next}
                    <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 py-3.5 px-4 rounded-xl bg-[#142C46] hover:bg-[#10263B] text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {t.customizer.addToCart}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 xl:col-span-8 order-1 lg:order-2 flex flex-col h-[380px] sm:h-[460px] md:h-[520px] lg:h-[calc(100vh-220px)] relative lg:sticky lg:top-24">
          <ScrubScene3D config={config} manifest={baseProduct?.modelManifest} />
          {config.embroidery.enabled && (config.embroidery.line1 || config.embroidery.line2) && (
            <div className="mt-2 mx-auto max-w-md w-full px-3 py-1.5 rounded-xl bg-white/95 border border-[#E1E5E8] text-center text-xs shadow-sm">
              <span className="text-[#667586]">{t.customizer.wizard.liveOnGarment}: </span>
              <span className="font-semibold text-[#10263B]">
                {[config.embroidery.line1, config.embroidery.line2].filter(Boolean).join(' · ')}
              </span>
            </div>
          )}
        </div>
      </div>

      {showSizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E1E5E8] animate-fade-in space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E5E8]">
              <h3 className="text-base font-serif font-bold text-[#10263B]">
                {t.customizer.wizard.sizeGuideTitle}
              </h3>
              <button
                type="button"
                onClick={() => setShowSizeModal(false)}
                className="text-[#667586] hover:text-[#10263B] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead>
                  <tr className="bg-[#F1F2F3] text-[#10263B]">
                    <th className="p-2.5 font-bold">{t.customizer.wizard.colSize}</th>
                    <th className="p-2.5 font-bold">{t.customizer.wizard.colChest}</th>
                    <th className="p-2.5 font-bold">{t.customizer.wizard.colWaist}</th>
                    <th className="p-2.5 font-bold">{t.customizer.wizard.colHips}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E1E5E8]">
                  <tr>
                    <td className="p-2.5 font-bold">XS</td>
                    <td className="p-2.5">82 - 86 cm</td>
                    <td className="p-2.5">64 - 68 cm</td>
                    <td className="p-2.5">88 - 92 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">S</td>
                    <td className="p-2.5">88 - 92 cm</td>
                    <td className="p-2.5">70 - 74 cm</td>
                    <td className="p-2.5">94 - 98 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">M</td>
                    <td className="p-2.5">94 - 98 cm</td>
                    <td className="p-2.5">76 - 82 cm</td>
                    <td className="p-2.5">100 - 104 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">L</td>
                    <td className="p-2.5">100 - 106 cm</td>
                    <td className="p-2.5">84 - 90 cm</td>
                    <td className="p-2.5">106 - 112 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">XL</td>
                    <td className="p-2.5">108 - 114 cm</td>
                    <td className="p-2.5">92 - 98 cm</td>
                    <td className="p-2.5">114 - 120 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">XXL</td>
                    <td className="p-2.5">116 - 124 cm</td>
                    <td className="p-2.5">100 - 108 cm</td>
                    <td className="p-2.5">122 - 128 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-[#667586] leading-relaxed">
              {t.customizer.wizard.sizeGuideNote}
            </p>

            <button
              type="button"
              onClick={() => setShowSizeModal(false)}
              className="w-full py-2.5 bg-[#142C46] text-white text-xs font-semibold rounded-xl hover:bg-[#10263B] transition"
            >
              {t.customizer.wizard.closeGuide}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
