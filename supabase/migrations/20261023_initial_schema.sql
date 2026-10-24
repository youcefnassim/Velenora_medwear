-- ==============================================================================
-- VELENORA MEDWEAR — Production PostgreSQL Schema & Supabase RLS Migration
-- Slogan: "Designed by You. Made for Care."
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
CREATE TYPE user_role AS ENUM ('customer', 'atelier_lead', 'admin');
CREATE TYPE order_status_type AS ENUM (
  'pending_confirmation',
  'confirmed',
  'in_production',
  'ready_for_dispatch',
  'shipped',
  'delivered',
  'cancelled'
);
CREATE TYPE payment_status_type AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE payment_method_type AS ENUM ('cash_on_delivery');

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role DEFAULT 'customer'::user_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name JSONB NOT NULL, -- { "fr": "...", "en": "...", "ar": "..." }
  description JSONB NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  category_id TEXT REFERENCES public.categories(id) ON DELETE RESTRICT,
  name JSONB NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description JSONB NOT NULL,
  base_price_dzd INTEGER NOT NULL CHECK (base_price_dzd >= 0),
  original_price_dzd INTEGER CHECK (original_price_dzd >= base_price_dzd),
  images TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  colors TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  sizes TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  fit TEXT NOT NULL CHECK (fit IN ('men', 'women', 'unisex')),
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  is_customizable BOOLEAN DEFAULT FALSE NOT NULL,
  model_manifest JSONB,
  fabric_details JSONB,
  estimated_production_days INTEGER DEFAULT 3 NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. SAVED DESIGNS (3D Customizer creations saved by users)
CREATE TABLE IF NOT EXISTS public.saved_designs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id) ON DELETE RESTRICT,
  design_name TEXT NOT NULL,
  configuration JSONB NOT NULL,
  asset_version TEXT DEFAULT '1.0.0' NOT NULL,
  preview_image_path TEXT,
  calculated_price_dzd INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. ORDERS TABLE (Algerian COD Order Processing)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- nullable for guest checkout
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  wilaya TEXT NOT NULL,
  commune TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  subtotal_dzd INTEGER NOT NULL CHECK (subtotal_dzd >= 0),
  shipping_fee_dzd INTEGER NOT NULL CHECK (shipping_fee_dzd >= 0),
  total_dzd INTEGER NOT NULL CHECK (total_dzd >= subtotal_dzd),
  order_status order_status_type DEFAULT 'pending_confirmation'::order_status_type NOT NULL,
  payment_method payment_method_type DEFAULT 'cash_on_delivery'::payment_method_type NOT NULL,
  payment_status payment_status_type DEFAULT 'pending'::payment_status_type NOT NULL,
  estimated_production_days INTEGER DEFAULT 3 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. ORDER ITEMS (Immutable snapshots of each ordered piece and 3D configuration)
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT NOT NULL,
  product_name_snapshot TEXT NOT NULL,
  sku_snapshot TEXT NOT NULL,
  quantity INTEGER DEFAULT 1 NOT NULL CHECK (quantity > 0),
  unit_price_dzd INTEGER NOT NULL CHECK (unit_price_dzd >= 0),
  total_price_dzd INTEGER NOT NULL CHECK (total_price_dzd >= 0),
  size TEXT NOT NULL,
  configuration_snapshot JSONB,
  production_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. ORDER STATUS HISTORY (Audit Trail)
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  previous_status order_status_type,
  new_status order_status_type NOT NULL,
  changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

-- Helper to check if current auth user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'atelier_lead')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own permitted profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

-- Categories & Products (Public Read for Active items)
CREATE POLICY "Public read active categories" ON public.categories
  FOR SELECT USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Public read active products" ON public.products
  FOR SELECT USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admin write products" ON public.products
  FOR ALL USING (public.is_admin());

-- Saved Designs
CREATE POLICY "Users read own saved designs" ON public.saved_designs
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users manage own saved designs" ON public.saved_designs
  FOR ALL USING (auth.uid() = user_id);

-- Orders Policies
CREATE POLICY "Users can read own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Public can insert orders (guest or auth)" ON public.orders
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admin can update order status and details" ON public.orders
  FOR UPDATE USING (public.is_admin());

-- Order Items Policies
CREATE POLICY "Users read order items of own orders" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Insert order items" ON public.order_items
  FOR INSERT WITH CHECK (TRUE);

-- ==============================================================================
-- SAMPLE SEED DATA (Explicitly marked as sample catalog for testing)
-- ==============================================================================

INSERT INTO public.categories (id, slug, name, description, is_active)
VALUES
  ('men', 'scrubs-homme', '{"fr": "Scrubs Homme", "en": "Men''s Scrubs", "ar": "أطقم طبية رجالية"}', '{"fr": "Coupes ergonomiques et finitions athlétiques.", "en": "Athletic tailored fits.", "ar": "قصات مريحة وتفاصيل رياضية."}', TRUE),
  ('women', 'scrubs-femme', '{"fr": "Scrubs Femme", "en": "Women''s Scrubs", "ar": "أطقم طبية نسائية"}', '{"fr": "Élégance cintrée et tombé fluide.", "en": "Feminine contours.", "ar": "أناقة راقية وتفصيل أنثوي."}', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, category_id, name, slug, description, base_price_dzd, fit, is_active, is_customizable)
VALUES
  ('velenora-signature-set-men', 'men', '{"fr": "Ensemble Médical Signature Homme", "en": "Men''s Signature Set", "ar": "طقم سكراب سيغنتشر الطبي للرجال"}', 'ensemble-signature-homme', '{"fr": "Textile VeloTech 4D antibactérien et infroissable.", "en": "Proprietary 4-way stretch fabric.", "ar": "نسيج فيلوتيك المطاطي المقاوم للتجعد."}', 8200, 'men', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
