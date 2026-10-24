import type { CustomizationConfig } from './configurator';

export interface Category {
  id: string;
  slug: string;
  name: {
    fr: string;
    en: string;
    ar: string;
  };
  description: {
    fr: string;
    en: string;
    ar: string;
  };
  image: string;
  is_active: boolean;
}

export interface ModelManifestPart {
  meshId: string;
  materialSlot: string;
  supportedVariants?: string[];
}

export interface ModelManifest {
  modelUrl: string;
  version: string;
  slots: {
    top_main: ModelManifestPart;
    top_trim?: ModelManifestPart;
    top_pockets?: ModelManifestPart;
    pants_main?: ModelManifestPart;
    pants_trim?: ModelManifestPart;
    pants_pockets?: ModelManifestPart;
    embroidery_overlay?: ModelManifestPart;
  };
  supportedFits: ('men' | 'women' | 'unisex')[];
  supportedGarments: ('top' | 'pants' | 'set')[];
}

export interface Product {
  id: string;
  slug: string;
  categoryId: string;
  name: {
    fr: string;
    en: string;
    ar: string;
  };
  description: {
    fr: string;
    en: string;
    ar: string;
  };
  basePriceDZD: number;
  originalPriceDZD?: number;
  images: string[];
  colors: string[]; // hex codes
  sizes: ('XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL')[];
  fit: 'men' | 'women' | 'unisex';
  isCustomizable: boolean;
  modelManifest?: ModelManifest;
  fabricDetails: {
    composition: string;
    weight: string;
    features: string[];
  };
  estimatedProductionDays: number;
  isFeatured?: boolean;
  isActive: boolean;
}

export interface SavedDesign {
  id: string;
  userId?: string;
  productId: string;
  designName: string;
  configuration: CustomizationConfig;
  assetVersion: string;
  previewThumbnail?: string;
  calculatedPriceDZD: number;
  createdAt: string;
  updatedAt: string;
}
