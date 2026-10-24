import { describe, it, expect } from 'vitest';
import { calculateCustomizationPrice, BASE_PRICES } from '../src/features/configurator/pricing/calculatePrice';
import type { CustomizationConfig } from '../src/types/configurator';
import { CURATED_COLORS } from '../src/features/configurator/configuration/options';

describe('Velenora Medwear — Pricing Engine', () => {
  const defaultColors = {
    topColor: CURATED_COLORS[0],
    pantsColor: CURATED_COLORS[0],
    accentColor: CURATED_COLORS[1],
  };

  it('calculates base set price without addons correctly', () => {
    const config: Partial<CustomizationConfig> = {
      garmentType: 'set',
      sleeve: 'short',
      pocket: 'single_chest',
      embroidery: {
        enabled: false,
        line1: '',
        line2: '',
        position: 'left_chest',
        font: 'classic_serif',
        colorHex: '#FFFFFF',
        colorName: 'Blanc',
      },
      ...defaultColors,
    };

    const pricing = calculateCustomizationPrice(config);
    expect(pricing.basePriceDZD).toBe(6900);
    expect(pricing.sleevePriceDZD).toBe(0);
    expect(pricing.pocketPriceDZD).toBe(0);
    expect(pricing.embroideryPriceDZD).toBe(0);
    expect(pricing.totalPriceDZD).toBe(6900);
  });

  it('adds sleeve, pocket and embroidery addons accurately', () => {
    const config: Partial<CustomizationConfig> = {
      garmentType: 'set',
      sleeve: 'long', // +700
      pocket: 'cargo_combo', // +700
      embroidery: {
        enabled: true,
        line1: 'Dr. Sarah Benali',
        line2: 'Chirurgien',
        position: 'left_chest',
        font: 'modern_sans',
        colorHex: '#FFFFFF',
        colorName: 'Blanc',
      }, // +600
      ...defaultColors,
    };

    const pricing = calculateCustomizationPrice(config);
    expect(pricing.basePriceDZD).toBe(6900);
    expect(pricing.sleevePriceDZD).toBe(700);
    expect(pricing.pocketPriceDZD).toBe(700);
    expect(pricing.embroideryPriceDZD).toBe(600);
    expect(pricing.totalPriceDZD).toBe(6900 + 700 + 700 + 600);
    expect(pricing.totalPriceDZD).toBe(8900);
  });

  it('handles top-only and pants-only base prices', () => {
    const topPricing = calculateCustomizationPrice({ garmentType: 'top', sleeve: 'short', pocket: 'single_chest' });
    expect(topPricing.basePriceDZD).toBe(BASE_PRICES.top);
    expect(topPricing.totalPriceDZD).toBe(BASE_PRICES.top);

    const pantsPricing = calculateCustomizationPrice({ garmentType: 'pants', sleeve: 'long' });
    expect(pantsPricing.basePriceDZD).toBe(BASE_PRICES.pants);
    expect(pantsPricing.sleevePriceDZD).toBe(0);
    expect(pantsPricing.totalPriceDZD).toBe(BASE_PRICES.pants);
  });
});
