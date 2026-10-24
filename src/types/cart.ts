import type { Product } from './product';
import type { CustomizationConfig, CustomizationPricing } from './configurator';

export interface CartItem {
  id: string; // unique cart line ID (allows multiple customized versions of the same product)
  productId: string;
  product: Product;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  quantity: number;
  unitPriceDZD: number;
  subtotalDZD: number;
  
  // Customization snapshot if customized
  customization?: {
    config: CustomizationConfig;
    pricing: CustomizationPricing;
    previewUrl?: string;
  };
}

export interface CartState {
  items: CartItem[];
  itemCount: number;
  subtotalDZD: number;
}
