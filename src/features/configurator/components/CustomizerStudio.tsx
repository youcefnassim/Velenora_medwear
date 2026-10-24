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

export const CustomizerStudio: React.FC<CustomizerStudioProps> = ({ baseProduct }) => {
  const { t, formatPrice, language } = useI18n();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [stepIndex, setStepIndex] = useState(0);
  const [colorTarget, setColorTarget] = useState<'top' | 'pants' | 'details'>('top');
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

  const optionBtn = (active: boolean) =>
    `p-3 rounded-xl border text-center text-sm font-medium transition ${
      active
        ? 'border-[#142C46] bg-[#142C46] text-white shadow-sm'
        : 'border-[#E1E5E8] bg-white text-[#10263B] hover:bg-[#F1F2F3]'
    }`;

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
          <div className="space-y-4">
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

            <div className="flex items-center justify-between text-xs">
              <span className="text-[#667586]">{t.customizer.wizard.activeShade}</span>
              <span className="font-semibold text-[#10263B]">
                {localizedName(currentColorSelected.name, language)}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {CURATED_COLORS.map((col) => {
                const isSelected = currentColorSelected.id === col.id;
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => handleColorSelect(col)}
                    className={`relative w-11 h-11 mx-auto rounded-full border-2 flex items-center justify-center transition ${
                      isSelected ? 'border-[#142C46] scale-110 shadow-sm' : 'border-[#E1E5E8] hover:scale-105'
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={localizedName(col.name, language)}
                    aria-label={localizedName(col.name, language)}
                  >
                    {isSelected && (
                      <Check
                        className={`w-4 h-4 ${
                          col.id === 'white' || col.id === 'powder' ? 'text-[#10263B]' : 'text-white'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'style':
        return (
          <div className="space-y-5">
            {config.garmentType !== 'pants' && (
              <>
                <div className="space-y-2">
                  <span className="text-xs font-medium text-[#667586]">{t.customizer.neckline}</span>
                  <div className="grid grid-cols-3 gap-2">
                    {NECKLINE_OPTIONS.map((neck) => (
                      <button
                        key={neck.id}
                        type="button"
                        onClick={() => handleUpdate({ neckline: neck.id })}
                        className={optionBtn(config.neckline === neck.id)}
                      >
                        {localizedName(neck.label, language)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-medium text-[#667586]">{t.customizer.sleeves}</span>
                  <div className="grid grid-cols-2 gap-2">
                    {SLEEVE_OPTIONS.map((slv) => (
                      <button
                        key={slv.id}
                        type="button"
                        onClick={() => handleUpdate({ sleeve: slv.id })}
                        className={optionBtn(config.sleeve === slv.id)}
                      >
                        <span>{localizedName(slv.label, language)}</span>
                        <span
                          className={`block text-[10px] mt-1 ${
                            config.sleeve === slv.id ? 'text-white/80' : 'text-[#087A83]'
                          }`}
                        >
                          {slv.addonDZD === 0
                            ? t.customizer.wizard.included
                            : `+${formatPrice(slv.addonDZD)}`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-medium text-[#667586]">{t.customizer.pockets}</span>
                  <div className="grid grid-cols-3 gap-2">
                    {POCKET_OPTIONS.map((pock) => (
                      <button
                        key={pock.id}
                        type="button"
                        onClick={() => handleUpdate({ pocket: pock.id })}
                        className={optionBtn(config.pocket === pock.id)}
                      >
                        <span>{localizedName(pock.label, language)}</span>
                        {pock.addonDZD > 0 && (
                          <span
                            className={`block text-[10px] mt-1 ${
                              config.pocket === pock.id ? 'text-white/80' : 'text-[#087A83]'
                            }`}
                          >
                            +{formatPrice(pock.addonDZD)}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {config.garmentType !== 'top' && (
              <div className="space-y-2">
                <span className="text-xs font-medium text-[#667586]">{t.customizer.pantsFit}</span>
                <div className="grid grid-cols-3 gap-2">
                  {PANTS_FIT_OPTIONS.map((pFit) => (
                    <button
                      key={pFit.id}
                      type="button"
                      onClick={() => handleUpdate({ pantsFit: pFit.id })}
                      className={optionBtn(config.pantsFit === pFit.id)}
                    >
                      {localizedName(pFit.label, language)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'embroidery':
        return (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() =>
                handleUpdate({
                  embroidery: {
                    ...config.embroidery,
                    enabled: !config.embroidery.enabled,
                    line1: !config.embroidery.enabled ? config.embroidery.line1 : '',
                    line2: !config.embroidery.enabled ? config.embroidery.line2 : '',
                  },
                })
              }
              className={`w-full p-4 rounded-2xl border text-left transition flex items-start gap-3 ${
                config.embroidery.enabled
                  ? 'border-[#087A83] bg-[#087A83]/5'
                  : 'border-[#E1E5E8] bg-white hover:bg-[#F1F2F3]'
              }`}
            >
              <span
                className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                  config.embroidery.enabled
                    ? 'bg-[#087A83] border-[#087A83] text-white'
                    : 'border-[#E1E5E8] bg-white'
                }`}
              >
                {config.embroidery.enabled && <Check className="w-3.5 h-3.5" />}
              </span>
              <span>
                <span className="block text-sm font-semibold text-[#10263B]">
                  {t.customizer.embroiderySection}
                </span>
                <span className="block text-xs text-[#667586] mt-1">
                  {t.customizer.wizard.enableEmbroideryDynamic.replace(
                    '{price}',
                    formatPrice(EMBROIDERY_PRICE_DZD)
                  )}
                </span>
              </span>
            </button>

            {config.embroidery.enabled && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-[#10263B]">
                      {t.customizer.nameLabel}
                    </label>
                    <span className="text-[10px] text-[#667586]">
                      {config.embroidery.line1.length} / 30
                    </span>
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
                    autoFocus
                    className="w-full px-3.5 py-3 text-sm rounded-xl border border-[#E1E5E8] bg-white focus:outline-none focus:ring-2 focus:ring-[#087A83]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-[#10263B]">
                      {t.customizer.specialtyLabel}
                    </label>
                    <span className="text-[10px] text-[#667586]">
                      {config.embroidery.line2.length} / 30
                    </span>
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
                    className="w-full px-3.5 py-3 text-sm rounded-xl border border-[#E1E5E8] bg-white focus:outline-none focus:ring-2 focus:ring-[#087A83]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#10263B] mb-1.5">
                    {t.customizer.fontLabel}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {EMBROIDERY_FONTS.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() =>
                          handleUpdate({ embroidery: { ...config.embroidery, font: f.id } })
                        }
                        className={optionBtn(config.embroidery.font === f.id)}
                      >
                        {f.id === 'classic_serif'
                          ? t.customizer.classicSerif
                          : f.id === 'modern_sans'
                            ? t.customizer.modernSans
                            : t.customizer.scriptFont}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#10263B] mb-1.5">
                    {t.customizer.embroideryColor}
                  </label>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {EMBROIDERY_COLORS.map((col) => (
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
                        className={`w-8 h-8 rounded-full border-2 transition ${
                          config.embroidery.colorHex === col.hex
                            ? 'border-[#142C46] scale-110'
                            : 'border-[#E1E5E8]'
                        }`}
                        style={{ backgroundColor: col.hex }}
                        title={col.name}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#10263B] mb-1.5">
                    {t.customizer.positionLabel}
                  </label>
                  <div className="space-y-2">
                    {EMBROIDERY_POSITIONS.map((pos) => (
                      <button
                        key={pos.id}
                        type="button"
                        onClick={() =>
                          handleUpdate({
                            embroidery: { ...config.embroidery, position: pos.id },
                          })
                        }
                        className={`w-full p-3 rounded-xl border text-left text-sm font-medium transition flex items-center justify-between ${
                          config.embroidery.position === pos.id
                            ? 'border-[#142C46] bg-[#142C46] text-white shadow-sm'
                            : 'border-[#E1E5E8] text-[#10263B] hover:bg-[#F1F2F3]'
                        }`}
                      >
                        <span>{localizedName(pos.label, language)}</span>
                        {config.embroidery.position === pos.id && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-[#F1F2F3] rounded-2xl border border-[#E1E5E8] text-center">
                  <span className="text-[10px] uppercase tracking-wider text-[#667586] font-semibold flex items-center justify-center gap-1.5 mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    {t.customizer.wizard.embroideryPreview}
                  </span>
                  <div
                    className="p-4 bg-white rounded-xl border border-[#E1E5E8] inline-block min-w-[220px]"
                    style={{
                      color:
                        config.embroidery.colorHex === '#FFFFFF'
                          ? '#142C46'
                          : config.embroidery.colorHex,
                    }}
                  >
                    <p
                      className={`text-sm font-bold ${
                        config.embroidery.font === 'classic_serif'
                          ? 'font-serif'
                          : config.embroidery.font === 'script'
                            ? 'italic font-serif'
                            : 'tracking-wide'
                      }`}
                    >
                      {config.embroidery.line1.trim() || t.customizer.wizard.yourNameHere}
                    </p>
                    <p className="text-xs italic mt-1 text-[#667586]">
                      {config.embroidery.line2.trim() || t.customizer.wizard.yourTitleHere}
                    </p>
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
