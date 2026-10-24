import { describe, it, expect } from 'vitest';
import { validateCustomizationConfig } from '../src/features/configurator/validation/validateConfig';
import { CURATED_COLORS } from '../src/features/configurator/configuration/options';

describe('Velenora Medwear — Configuration Validation', () => {
  const validBaseConfig = {
    garmentType: 'set',
    fit: 'men',
    size: 'M',
    topColor: CURATED_COLORS[0],
    pantsColor: CURATED_COLORS[0],
    accentColor: CURATED_COLORS[1],
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
      colorName: 'Blanc',
    },
    productId: 'scrub-set-signature-men',
    productName: 'Ensemble Signature Médical Homme',
  };

  it('approves a fully valid configuration', () => {
    const result = validateCustomizationConfig(validBaseConfig);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });

  it('rejects missing size', () => {
    const invalid = { ...validBaseConfig, size: undefined };
    const result = validateCustomizationConfig(invalid);
    expect(result.isValid).toBe(false);
    expect(result.errors['size']).toBeDefined();
  });

  it('requires text when embroidery is enabled', () => {
    const invalid = {
      ...validBaseConfig,
      embroidery: {
        ...validBaseConfig.embroidery,
        enabled: true,
        line1: '   ',
        line2: '   ',
      },
    };
    const result = validateCustomizationConfig(invalid);
    expect(result.isValid).toBe(false);
    expect(result.errors['embroidery.text']).toBeDefined();
  });

  it('accepts embroidery when at least one line is filled', () => {
    const validWithEmbroidery = {
      ...validBaseConfig,
      embroidery: {
        ...validBaseConfig.embroidery,
        enabled: true,
        line1: 'Dr. Sarah Benali',
        line2: '',
      },
    };
    const result = validateCustomizationConfig(validWithEmbroidery);
    expect(result.isValid).toBe(true);
  });
});
