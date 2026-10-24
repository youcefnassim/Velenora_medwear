import type {
  ColorDefinition,
  NecklineType,
  SleeveType,
  PocketType,
  PantsFitType,
  WaistbandType,
  EmbroideryPosition,
  EmbroideryFont,
} from '../../../types/configurator';

export const CURATED_COLORS: ColorDefinition[] = [
  {
    id: 'navy',
    name: { fr: 'Bleu marine', en: 'Navy Blue', ar: 'أزرق كحلي' },
    hex: '#142C46',
    fabricTone: 'Matte Luxe'
  },
  {
    id: 'petrol',
    name: { fr: 'Bleu pétrole', en: 'Petrol Blue', ar: 'أزرق بترولي' },
    hex: '#17475A',
    fabricTone: 'Deep Sheen'
  },
  {
    id: 'black',
    name: { fr: 'Noir', en: 'Black', ar: 'أسود' },
    hex: '#1A1C1E',
    fabricTone: 'Ultra Matte'
  },
  {
    id: 'grey',
    name: { fr: 'Gris', en: 'Grey', ar: 'رمادي' },
    hex: '#7D8B99',
    fabricTone: 'Heather Grey'
  },
  {
    id: 'white',
    name: { fr: 'Blanc', en: 'White', ar: 'أبيض' },
    hex: '#FFFFFF',
    fabricTone: 'Optical White'
  },
  {
    id: 'sage',
    name: { fr: 'Vert sauge', en: 'Sage Green', ar: 'أخضر ميرمية' },
    hex: '#6C8B7F',
    fabricTone: 'Natural Earth'
  },
  {
    id: 'teal',
    name: { fr: 'Turquoise', en: 'Turquoise / Teal', ar: 'تركواز طبي' },
    hex: '#087A83',
    fabricTone: 'Silky Sheen'
  },
  {
    id: 'powder',
    name: { fr: 'Rose poudré', en: 'Powder Pink', ar: 'وردي ناعم' },
    hex: '#D8A49B',
    fabricTone: 'Soft Pastel'
  },
  {
    id: 'burgundy',
    name: { fr: 'Bordeaux', en: 'Burgundy', ar: 'عنابي جراحي' },
    hex: '#5C1D2E',
    fabricTone: 'Deep Wine'
  },
  {
    id: 'purple',
    name: { fr: 'Violet', en: 'Purple', ar: 'بنفسجي راقي' },
    hex: '#4A3B52',
    fabricTone: 'Royal Aubergine'
  }
];

export const EMBROIDERY_COLORS = [
  { id: 'white', name: 'Blanc Pur', hex: '#FFFFFF' },
  { id: 'gold', name: 'Or Atelier', hex: '#D4AF37' },
  { id: 'silver', name: 'Argent Satiné', hex: '#C0C0C0' },
  { id: 'teal', name: 'Turquoise Médical', hex: '#087A83' },
  { id: 'navy', name: 'Bleu Marine', hex: '#142C46' },
  { id: 'black', name: 'Noir Carbone', hex: '#1A1C1E' },
];

export const NECKLINE_OPTIONS: { id: NecklineType; label: { fr: string; en: string; ar: string }; desc: string }[] = [
  {
    id: 'v_neck',
    label: { fr: 'Col V', en: 'V-Neck', ar: 'ياقة V' },
    desc: 'Coupe classique et confortable pour une mobilité optimale.'
  },
  {
    id: 'round',
    label: { fr: 'Col rond', en: 'Crew Neck', ar: 'ياقة دائرية' },
    desc: 'Encolure douce et contemporaine avec bord extensible.'
  },
  {
    id: 'mandarin',
    label: { fr: 'Col mao', en: 'Mandarin Collar', ar: 'ياقة ماو صينية' },
    desc: 'Ligne habillée structurée avec fermeture discrète.'
  }
];

export const SLEEVE_OPTIONS: { id: SleeveType; label: { fr: string; en: string; ar: string }; addonDZD: number }[] = [
  {
    id: 'short',
    label: { fr: 'Manches courtes', en: 'Short Sleeves', ar: 'أكمام قصيرة' },
    addonDZD: 0
  },
  {
    id: 'long',
    label: { fr: 'Manches longues', en: 'Long Sleeves', ar: 'أكمام طويلة' },
    addonDZD: 700
  }
];

export const POCKET_OPTIONS: { id: PocketType; label: { fr: string; en: string; ar: string }; addonDZD: number }[] = [
  {
    id: 'single_chest',
    label: { fr: 'Standard', en: 'Standard', ar: 'جيب قياسي' },
    addonDZD: 0
  },
  {
    id: 'double_chest',
    label: { fr: 'Double', en: 'Double Pockets', ar: 'جيبان' },
    addonDZD: 400
  },
  {
    id: 'cargo_combo',
    label: { fr: 'Zippée', en: 'Zippered Pocket', ar: 'جيب بسحاب' },
    addonDZD: 700
  }
];

export const PANTS_FIT_OPTIONS: { id: PantsFitType; label: { fr: string; en: string; ar: string }; desc: string }[] = [
  {
    id: 'standard',
    label: { fr: 'Classique', en: 'Classic', ar: 'كلاسيكي مستقيم' },
    desc: 'Coupe droite intemporelle'
  },
  {
    id: 'tapered',
    label: { fr: 'Slim', en: 'Slim Fit', ar: 'سليم ضيق' },
    desc: 'Ligne fuselée et élégante'
  },
  {
    id: 'jogger_cuff',
    label: { fr: 'Jogger', en: 'Jogger', ar: 'جوغر مطاطي' },
    desc: 'Bords-côtes extensibles à la cheville'
  }
];

export const WAISTBAND_OPTIONS: { id: WaistbandType; label: { fr: string; en: string; ar: string } }[] = [
  {
    id: 'elastic_drawstring',
    label: { fr: 'Cordon & Élastique Confort', en: 'Drawstring & Elastic', ar: 'مطاط ورباط' }
  },
  {
    id: 'tailored_flat',
    label: { fr: 'Ceinture Semi-Plate Ajustée', en: 'Tailored Flat Waist', ar: 'حزام مسطح' }
  }
];

export const EMBROIDERY_POSITIONS: { id: EmbroideryPosition; label: { fr: string; en: string; ar: string } }[] = [
  {
    id: 'left_chest',
    label: { fr: 'Côté gauche', en: 'Left Chest', ar: 'الجهة اليسرى' }
  },
  {
    id: 'right_chest',
    label: { fr: 'Côté droit', en: 'Right Chest', ar: 'الجهة اليمنى' }
  },
  {
    id: 'left_sleeve',
    label: { fr: 'Manche', en: 'Sleeve', ar: 'الكم' }
  }
];

export const EMBROIDERY_FONTS: { id: EmbroideryFont; label: string; fontClass: string }[] = [
  { id: 'classic_serif', label: 'Sérif Classique', fontClass: 'font-serif' },
  { id: 'modern_sans', label: 'Moderne Linéaire', fontClass: 'font-sans font-semibold tracking-wider' },
  { id: 'script', label: 'Cursive Élégante', fontClass: 'italic font-serif' },
];

export const EMBROIDERY_PRICE_DZD = 600;
