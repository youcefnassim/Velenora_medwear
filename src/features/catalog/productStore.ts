import { useState, useEffect, useCallback } from 'react';
import type { Product } from '../../types/product';

const STORAGE_KEY = 'velenora_catalog_products';
const UPDATE_EVENT = 'velenora_catalog_updated';

// Clean official Velenora reference templates (using clean local studio images, no broken stock photos)
export const OFFICIAL_TEMPLATES: Product[] = [
  {
    id: 'velenora-signature-homme',
    slug: 'ensemble-signature-homme',
    categoryId: 'men',
    name: {
      fr: 'Ensemble Médical Signature Homme',
      en: "Men's Signature Medical Scrub Set",
      ar: 'طقم سكراب سيغنتشر الطبي للرجال',
    },
    description: {
      fr: 'L’ensemble iconique Velenora. Confectionné dans notre textile VeloTech™ extensible 4 directions, infroissable et ultra-durable.',
      en: 'The definitive Velenora uniform. Crafted from proprietary 4-way stretch VeloTech™ fabric with fluid mobility.',
      ar: 'الزي الأيقوني من فيلينورا. مصنوع من نسيج فيلوتيك المطاطي المقاوم للتجعد والمناسب لساعات العمل الطويلة.',
    },
    basePriceDZD: 8200,
    originalPriceDZD: 9500,
    images: ['/images/tryon/men-front-clean.jpg'],
    colors: ['#142C46', '#2A7776', '#242A31', '#6A887B', '#5E2333'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    fit: 'men',
    isCustomizable: true,
    modelManifest: {
      modelUrl: '/models/velenora_scrub_men.glb',
      version: '1.0.0',
      slots: {
        top_main: { meshId: 'top_main', materialSlot: 'fabric_top' },
        top_trim: { meshId: 'top_trim', materialSlot: 'accent_trim' },
        top_pockets: { meshId: 'top_pockets', materialSlot: 'fabric_top' },
        pants_main: { meshId: 'pants_main', materialSlot: 'fabric_pants' },
        pants_trim: { meshId: 'pants_trim', materialSlot: 'accent_trim' },
      },
      supportedFits: ['men'],
      supportedGarments: ['top', 'pants', 'set'],
    },
    fabricDetails: {
      composition: '72% Polyester Micro-filaments, 21% Rayonne Soyeuse, 7% Élasthanne Spandex',
      weight: '210 g/m² - Résistance certifiée aux lavages 60°C',
      features: ['Anti-bactérien', 'Anti-statique', 'Anti-froissement', 'Séchage ultra-rapide'],
    },
    estimatedProductionDays: 3,
    isFeatured: true,
    isActive: true,
  },
  {
    id: 'velenora-elegance-femme',
    slug: 'ensemble-elegance-femme',
    categoryId: 'women',
    name: {
      fr: 'Ensemble Médical Élégance Femme',
      en: "Women's Elegance Medical Scrub Set",
      ar: 'طقم سكراب إليغانس الطبي للنساء',
    },
    description: {
      fr: 'Coupe cintrée féminine raffinée, coutures princesse flatteuses et pantalon jogger ou ajusté ultra confortable.',
      en: 'Refined feminine tailored cut with contour princess seams and high-waist comfort pants.',
      ar: 'قصة أنثوية ممشوقة مع خياطة محكمة وبنطال مريح للغاية يوفر مظهراً لائقاً ومهنياً.',
    },
    basePriceDZD: 8400,
    originalPriceDZD: 9800,
    images: ['/images/tryon/women-front-clean.jpg'],
    colors: ['#2A7776', '#142C46', '#6A887B', '#5E2333', '#527C99'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    fit: 'women',
    isCustomizable: true,
    modelManifest: {
      modelUrl: '/models/velenora_scrub_women.glb',
      version: '1.0.0',
      slots: {
        top_main: { meshId: 'top_main', materialSlot: 'fabric_top' },
        top_trim: { meshId: 'top_trim', materialSlot: 'accent_trim' },
        top_pockets: { meshId: 'top_pockets', materialSlot: 'fabric_top' },
        pants_main: { meshId: 'pants_main', materialSlot: 'fabric_pants' },
        pants_trim: { meshId: 'pants_trim', materialSlot: 'accent_trim' },
      },
      supportedFits: ['women'],
      supportedGarments: ['top', 'pants', 'set'],
    },
    fabricDetails: {
      composition: '72% Polyester Micro-filaments, 21% Rayonne Soyeuse, 7% Élasthanne Spandex',
      weight: '210 g/m² - Douceur cachemire au toucher',
      features: ['Doux pour la peau', 'Extensible 4D', 'Finitions hydrofuges', 'Sans repassage'],
    },
    estimatedProductionDays: 3,
    isFeatured: true,
    isActive: true,
  },
];

export const DEFAULT_FALLBACK_PRODUCT: Product = OFFICIAL_TEMPLATES[0];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') || `tenue-${Date.now()}`;
}

export function getStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Erreur lecture catalogue:', err);
  }
  // If not stored yet, initialize with clean official templates
  return OFFICIAL_TEMPLATES;
}

export function saveStoredProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: products }));
  } catch (err) {
    console.error('Erreur sauvegarde catalogue:', err);
  }
}

export function addProductToCatalog(productInput: Partial<Product> & { name: { fr: string; en?: string; ar?: string } }): Product {
  const products = getStoredProducts();
  const id = productInput.id || `velenora-${Date.now()}`;
  const slug = productInput.slug || generateSlug(productInput.name.fr);

  const newProduct: Product = {
    id,
    slug,
    categoryId: productInput.categoryId || 'men',
    name: {
      fr: productInput.name.fr,
      en: productInput.name.en || productInput.name.fr,
      ar: productInput.name.ar || productInput.name.fr,
    },
    description: {
      fr: productInput.description?.fr || 'Tenue médicale haut de gamme confectionnée par Velenora Medwear.',
      en: productInput.description?.en || 'High-end medical uniform crafted by Velenora Medwear.',
      ar: productInput.description?.ar || 'زي طبي فاخر مصنوع بحرفية وجودة عالية من فيلينورا.',
    },
    basePriceDZD: Number(productInput.basePriceDZD) || 8200,
    originalPriceDZD: productInput.originalPriceDZD ? Number(productInput.originalPriceDZD) : undefined,
    images: productInput.images && productInput.images.length > 0 ? productInput.images : ['/images/tryon/men-front-clean.jpg'],
    colors: productInput.colors && productInput.colors.length > 0 ? productInput.colors : ['#142C46', '#2A7776'],
    sizes: productInput.sizes && productInput.sizes.length > 0 ? productInput.sizes : ['S', 'M', 'L', 'XL'],
    fit: productInput.fit || 'men',
    isCustomizable: productInput.isCustomizable !== false,
    fabricDetails: productInput.fabricDetails || {
      composition: '72% Polyester, 21% Rayonne, 7% Élasthanne Spandex',
      weight: '210 g/m² - Résistant lavages 60°C',
      features: ['Extensible 4D', 'Anti-froissement', 'Anti-bactérien', 'Ultra-léger'],
    },
    estimatedProductionDays: productInput.estimatedProductionDays || 3,
    isFeatured: productInput.isFeatured ?? true,
    isActive: productInput.isActive ?? true,
  };

  const updated = [newProduct, ...products];
  saveStoredProducts(updated);
  return newProduct;
}

export function updateProductInCatalog(id: string, updates: Partial<Product>): Product | null {
  const products = getStoredProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const current = products[index];
  const updatedProduct: Product = {
    ...current,
    ...updates,
    name: { ...current.name, ...(updates.name || {}) },
    description: { ...current.description, ...(updates.description || {}) },
    fabricDetails: { ...current.fabricDetails, ...(updates.fabricDetails || {}) },
  };

  products[index] = updatedProduct;
  saveStoredProducts([...products]);
  return updatedProduct;
}

export function deleteProductFromCatalog(id: string): void {
  const products = getStoredProducts();
  const filtered = products.filter((p) => p.id !== id);
  saveStoredProducts(filtered);
}

export function clearCatalog(): void {
  saveStoredProducts([]);
}

export function seedOfficialCatalog(): Product[] {
  saveStoredProducts(OFFICIAL_TEMPLATES);
  return OFFICIAL_TEMPLATES;
}

/**
 * Custom React Hook to subscribe to catalog state changes in real-time
 */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());

  const refresh = useCallback(() => {
    setProducts(getStoredProducts());
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      refresh();
    };

    window.addEventListener(UPDATE_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [refresh]);

  return {
    products,
    addProduct: addProductToCatalog,
    updateProduct: updateProductInCatalog,
    deleteProduct: deleteProductFromCatalog,
    clearCatalog,
    seedOfficialCatalog,
    refresh,
  };
}
