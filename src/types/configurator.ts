export type GarmentType = 'top' | 'pants' | 'set';
export type GenderFit = 'men' | 'women' | 'unisex';

export type NecklineType = 'v_neck' | 'mandarin' | 'round';
export type SleeveType = 'short' | 'long';
export type PocketType = 'single_chest' | 'double_chest' | 'cargo_combo';
export type PantsFitType = 'standard' | 'jogger_cuff' | 'tapered';
export type WaistbandType = 'elastic_drawstring' | 'tailored_flat';

export type EmbroideryPosition = 'left_chest' | 'right_chest' | 'left_sleeve';
export type EmbroideryFont = 'classic_serif' | 'modern_sans' | 'script';

export interface ColorDefinition {
  id: string;
  name: {
    fr: string;
    en: string;
    ar: string;
  };
  hex: string;
  fabricTone?: string;
}

export interface EmbroideryConfig {
  enabled: boolean;
  line1: string; // e.g. "Dr. Sarah Benali"
  line2: string; // e.g. "Chirurgie Cardiaque"
  position: EmbroideryPosition;
  font: EmbroideryFont;
  colorHex: string;
  colorName: string;
}

export interface CustomizationConfig {
  garmentType: GarmentType;
  fit: GenderFit;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  
  // Colors
  topColor: ColorDefinition;
  pantsColor: ColorDefinition;
  accentColor: ColorDefinition;
  
  // Garment variants
  neckline: NecklineType;
  sleeve: SleeveType;
  pocket: PocketType;
  pantsFit: PantsFitType;
  waistband: WaistbandType;
  
  // Embroidery
  embroidery: EmbroideryConfig;
  
  // Base product reference
  productId: string;
  productName: string;
}

export interface CustomizationPricing {
  basePriceDZD: number;
  sleevePriceDZD: number;
  pocketPriceDZD: number;
  embroideryPriceDZD: number;
  totalPriceDZD: number;
}
