import type { CustomizationConfig, CustomizationPricing } from '../../../types/configurator';
import { SLEEVE_OPTIONS, POCKET_OPTIONS, EMBROIDERY_PRICE_DZD } from '../configuration/options';

export const BASE_PRICES: Record<string, number> = {
  set: 6900,   // reference price from design prompt
  top: 4200,
  pants: 3800,
};

export function calculateCustomizationPrice(config: Partial<CustomizationConfig>, basePriceOverride?: number): CustomizationPricing {
  const garmentType = config.garmentType || 'set';
  const basePriceDZD = basePriceOverride ?? (BASE_PRICES[garmentType] || 6900);

  let sleevePriceDZD = 0;
  if (garmentType !== 'pants' && config.sleeve) {
    const sleeveOpt = SLEEVE_OPTIONS.find(s => s.id === config.sleeve);
    if (sleeveOpt) {
      sleevePriceDZD = sleeveOpt.addonDZD;
    }
  }

  let pocketPriceDZD = 0;
  if (garmentType !== 'pants' && config.pocket) {
    const pocketOpt = POCKET_OPTIONS.find(p => p.id === config.pocket);
    if (pocketOpt) {
      pocketPriceDZD = pocketOpt.addonDZD;
    }
  }

  let embroideryPriceDZD = 0;
  if (config.embroidery?.enabled && (config.embroidery.line1.trim() || config.embroidery.line2.trim())) {
    embroideryPriceDZD = EMBROIDERY_PRICE_DZD;
  }

  const totalPriceDZD = basePriceDZD + sleevePriceDZD + pocketPriceDZD + embroideryPriceDZD;

  return {
    basePriceDZD,
    sleevePriceDZD,
    pocketPriceDZD,
    embroideryPriceDZD,
    totalPriceDZD,
  };
}
