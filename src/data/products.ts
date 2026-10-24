import type { Product, Category } from '../types/product';
import { OFFICIAL_TEMPLATES } from '../features/catalog/productStore';

export const CATEGORIES: Category[] = [
  {
    id: 'men',
    slug: 'scrubs-homme',
    name: { fr: 'Scrubs Homme', en: "Men's Scrubs", ar: 'أطقم طبية رجالية' },
    description: {
      fr: 'Coupes ergonomiques et finitions athlétiques taillées pour le mouvement.',
      en: 'Athletic tailored fits engineered for long hospital shifts.',
      ar: 'قصات مريحة وتفاصيل رياضية مصممة لتحمل فترات العمل الطويلة.'
    },
    image: '/images/tryon/men-front-clean.jpg',
    is_active: true,
  },
  {
    id: 'women',
    slug: 'scrubs-femme',
    name: { fr: 'Scrubs Femme', en: "Women's Scrubs", ar: 'أطقم طبية نسائية' },
    description: {
      fr: 'Élégance cintrée, tombé fluide et confort sans compromis.',
      en: 'Feminine contours, fluid drape, and uncompromising utility.',
      ar: 'أناقة راقية وتفصيل أنثوي يجمع بين الفخامة والراحة طوال اليوم.'
    },
    image: '/images/tryon/women-front-clean.jpg',
    is_active: true,
  },
  {
    id: 'unisex',
    slug: 'scrubs-unisexe',
    name: { fr: 'Scrubs Unisexe & Équipes', en: 'Unisex & Clinic Teams', ar: 'أزياء طبية موحدة للفرق' },
    description: {
      fr: 'Idéal pour harmoniser l’identité visuelle de vos cliniques et cabinets.',
      en: 'Perfect uniform solution for private clinics and dental practices.',
      ar: 'الحل الأمثل لتوحيد مظهر الأطباء والممرضين في العيادات والمراكز.'
    },
    image: '/images/tryon/men-front-clean.jpg',
    is_active: true,
  },
  {
    id: 'lab-coats',
    slug: 'blouses-medicales',
    name: { fr: 'Blouses & Manteaux Médicaux', en: 'Lab Coats & Jackets', ar: 'معاطف ومآزر طبية' },
    description: {
      fr: 'Blouses blanches de prestige pour médecins et professeurs.',
      en: 'Executive white lab coats crafted with structured prestige fabric.',
      ar: 'مآزر بيضاء فاخرة للأطباء والأساتذة بلمسات عصرية راقية.'
    },
    image: '/images/tryon/men-front-clean.jpg',
    is_active: true,
  },
  {
    id: 'accessories',
    slug: 'accessoires-medicaux',
    name: { fr: 'Bonnets & Accessoires', en: 'Caps & Accessories', ar: 'قبعات وإكسسوارات طبية' },
    description: {
      fr: 'Bonnets de bloc opératoire brodés et accessoires assortis.',
      en: 'Embroidered surgical scrub caps and clinic accessories.',
      ar: 'قبعات جراحية مطرزة وإكسسوارات متناسقة مع الزي الطبي.'
    },
    image: '/images/tryon/women-front-clean.jpg',
    is_active: true,
  }
];

export const PRODUCTS: Product[] = OFFICIAL_TEMPLATES;

