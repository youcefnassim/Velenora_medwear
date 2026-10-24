import { z } from 'zod';
import type { CustomizationConfig } from '../../../types/configurator';

export const EmbroiderySchema = z.object({
  enabled: z.boolean(),
  line1: z.string().max(35, { message: 'Le nom ne doit pas dépasser 35 caractères' }),
  line2: z.string().max(40, { message: 'Le titre ne doit pas dépasser 40 caractères' }),
  position: z.enum(['left_chest', 'right_chest', 'left_sleeve']),
  font: z.enum(['classic_serif', 'modern_sans', 'script']),
  colorHex: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, { message: 'Code couleur hex invalide' }),
  colorName: z.string(),
});

export const CustomizationConfigSchema = z.object({
  garmentType: z.enum(['top', 'pants', 'set']),
  fit: z.enum(['men', 'women', 'unisex']),
  size: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
  topColor: z.object({
    id: z.string(),
    hex: z.string(),
    name: z.object({
      fr: z.string(),
      en: z.string(),
      ar: z.string(),
    }),
  }),
  pantsColor: z.object({
    id: z.string(),
    hex: z.string(),
    name: z.object({
      fr: z.string(),
      en: z.string(),
      ar: z.string(),
    }),
  }),
  accentColor: z.object({
    id: z.string(),
    hex: z.string(),
    name: z.object({
      fr: z.string(),
      en: z.string(),
      ar: z.string(),
    }),
  }),
  neckline: z.enum(['v_neck', 'mandarin', 'round']),
  sleeve: z.enum(['short', 'long']),
  pocket: z.enum(['single_chest', 'double_chest', 'cargo_combo']),
  pantsFit: z.enum(['standard', 'jogger_cuff', 'tapered']),
  waistband: z.enum(['elastic_drawstring', 'tailored_flat']),
  embroidery: EmbroiderySchema,
  productId: z.string(),
  productName: z.string(),
});

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateCustomizationConfig(config: unknown): ValidationResult {
  const result = CustomizationConfigSchema.safeParse(config);
  if (!result.success) {
    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join('.');
      errors[path] = issue.message;
    }
    return { isValid: false, errors };
  }

  const validConfig = result.data as CustomizationConfig;
  const errors: Record<string, string> = {};

  if (validConfig.embroidery.enabled) {
    if (!validConfig.embroidery.line1.trim() && !validConfig.embroidery.line2.trim()) {
      errors['embroidery.text'] = 'Veuillez saisir au moins une ligne de texte pour la broderie.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors };
  }

  return { isValid: true, errors: {} };
}
