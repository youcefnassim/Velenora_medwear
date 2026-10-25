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
  // 1. Bleus Iconiques
  {
    id: 'navy',
    name: { fr: 'Bleu marine', en: 'Navy Blue', ar: 'أزرق كحلي' },
    hex: '#142C46',
    fabricTone: 'Matte Luxe',
  },
  {
    id: 'petrol',
    name: { fr: 'Bleu pétrole', en: 'Petrol Blue', ar: 'أزرق بترولي' },
    hex: '#17475A',
    fabricTone: 'Deep Sheen',
  },
  {
    id: 'royal_blue',
    name: { fr: 'Bleu roi', en: 'Royal Blue', ar: 'أزرق ملكي' },
    hex: '#1D4ED8',
    fabricTone: 'Vibrant Clinic',
  },
  {
    id: 'ceil_blue',
    name: { fr: 'Bleu ciel chirurgical', en: 'Ceil Blue', ar: 'أزرق سماوي جراحي' },
    hex: '#5C88B0',
    fabricTone: 'Classic Hospital',
  },
  {
    id: 'caribbean',
    name: { fr: 'Bleu caraïbes', en: 'Caribbean Blue', ar: 'أزرق كاريبي' },
    hex: '#008080',
    fabricTone: 'Fresh Clean',
  },
  {
    id: 'hospital_blue',
    name: { fr: 'Bleu consultation', en: 'Hospital Blue', ar: 'أزرق مستشفى' },
    hex: '#2B5B84',
    fabricTone: 'Professional Soft',
  },

  // 2. Verts Bloc & Médicaux
  {
    id: 'surgical_green',
    name: { fr: 'Vert bloc opératoire', en: 'Surgical Green', ar: 'أخضر غرفة العمليات' },
    hex: '#2D6A4F',
    fabricTone: 'Surgical Grade',
  },
  {
    id: 'hunter_green',
    name: { fr: 'Vert bouteille', en: 'Hunter Green', ar: 'أخضر داكن' },
    hex: '#1B4332',
    fabricTone: 'Deep Forest',
  },
  {
    id: 'sage',
    name: { fr: 'Vert sauge', en: 'Sage Green', ar: 'أخضر ميرمية' },
    hex: '#6C8B7F',
    fabricTone: 'Natural Earth',
  },
  {
    id: 'olive',
    name: { fr: 'Vert olive', en: 'Olive Green', ar: 'أخضر زيتوني' },
    hex: '#556B2F',
    fabricTone: 'Earth Tone',
  },
  {
    id: 'mint',
    name: { fr: 'Vert menthe douce', en: 'Soft Mint', ar: 'أخضر نعناعي' },
    hex: '#76A588',
    fabricTone: 'Calming Pastel',
  },
  {
    id: 'teal',
    name: { fr: 'Turquoise / Teal', en: 'Medical Teal', ar: 'تركواز طبي' },
    hex: '#087A83',
    fabricTone: 'Silky Sheen',
  },

  // 3. Bordeaux, Prunes & Violets
  {
    id: 'burgundy',
    name: { fr: 'Bordeaux royal', en: 'Burgundy Wine', ar: 'عنابي جراحي' },
    hex: '#5C1D2E',
    fabricTone: 'Deep Wine',
  },
  {
    id: 'plum',
    name: { fr: 'Prune profonde', en: 'Plum / Wine', ar: 'خوخي داكن' },
    hex: '#4A1525',
    fabricTone: 'Prestige Dark',
  },
  {
    id: 'purple',
    name: { fr: 'Violet aubergine', en: 'Aubergine Purple', ar: 'بنفسجي باذنجاني' },
    hex: '#4A3B52',
    fabricTone: 'Royal Aubergine',
  },
  {
    id: 'lavender',
    name: { fr: 'Lilas / Lavande', en: 'Lavender', ar: 'خزامى هادئ' },
    hex: '#9D81BA',
    fabricTone: 'Soothing Violet',
  },

  // 4. Roses & Pastels
  {
    id: 'powder',
    name: { fr: 'Rose poudré', en: 'Powder Pink', ar: 'وردي ناعم' },
    hex: '#D8A49B',
    fabricTone: 'Soft Pastel',
  },
  {
    id: 'coral_rose',
    name: { fr: 'Rose corail', en: 'Coral Rose', ar: 'وردي مرجاني' },
    hex: '#D9777F',
    fabricTone: 'Warm Glow',
  },
  {
    id: 'peach',
    name: { fr: 'Pêche douce', en: 'Soft Peach', ar: 'مشمشي فاتح' },
    hex: '#E8B4A2',
    fabricTone: 'Delicate Warmth',
  },

  // 5. Neutres & Élégance Intemporelle
  {
    id: 'black',
    name: { fr: 'Noir carbone', en: 'Carbon Black', ar: 'أسود كربوني' },
    hex: '#1A1C1E',
    fabricTone: 'Ultra Matte',
  },
  {
    id: 'charcoal',
    name: { fr: 'Gris anthracite', en: 'Charcoal Grey', ar: 'رمادي فحمي' },
    hex: '#374151',
    fabricTone: 'Executive Steel',
  },
  {
    id: 'grey',
    name: { fr: 'Gris perle chiné', en: 'Heather Grey', ar: 'رمادي لؤلؤي' },
    hex: '#7D8B99',
    fabricTone: 'Heather Grey',
  },
  {
    id: 'white',
    name: { fr: 'Blanc optique', en: 'Optical White', ar: 'أبيض ناصع' },
    hex: '#FFFFFF',
    fabricTone: 'Optical White',
  },
  {
    id: 'khaki',
    name: { fr: 'Beige sable / Kaki', en: 'Sand Khaki', ar: 'بيج رملي' },
    hex: '#B8A389',
    fabricTone: 'Safari Medical',
  },
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
