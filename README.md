# Velenora Medwear — Premium Medical Fashion & 3D Scrub Customizer

> **“Designed by You. Made for Care.”**  
> *“Votre style. Votre tenue. Votre métier.”*

A production-oriented e-commerce and interactive 3D configurator platform for **Velenora Medwear**, a high-end medical apparel brand launching in Algeria with international expansion readiness.

---

## 1. Key Features

- **Interactive 3D Scrub Customizer (`/customizer`)**:
  - Full real-time 3D rendering with Three.js & React Three Fiber.
  - Procedural mannequin & garment geometry pipeline with PBR fabric standard materials.
  - Multi-piece customization: Scrub Tops, Scrub Pants, or Full Matching Sets.
  - Dynamic geometry switching: V-Neck, Mandarin Collar, Round Neck; Short/Long sleeves; Pocket configurations; Jogger cuffs vs Straight pant drape.
  - **Live Dynamic Embroidery Decal**: Renders personalized doctor name, medical title, custom typography styles (Editorial Serif, Modern Sans, Script), thread color, and placement on chest or sleeve.
  - Dual-mode GLB support: Supports external `.glb` models matching the `model_manifest` slot specifications (`top_main`, `pants_main`, `top_trim`, etc.) with graceful fallback.
  - Preset camera viewpoints (Face, Dos, Détail Broderie, Silhouette) and 360° OrbitControls.

- **Dynamic Pricing Engine**:
  - Calculates base prices, sleeve addons, pocket addons, and embroidery additions in Algerian Dinars (DZD).
  - Validation with Zod to prevent client-side price tampering.

- **Algerian Cash on Delivery (COD) Checkout (`/checkout`)**:
  - Dedicated support for all **58 Algerian Wilayas** with official postal codes and regional delivery tariffs.
  - Real-time shipping calculation, address validation, and duplicate submission prevention.
  - Orders stored with strict `payment_status: 'pending'` (never marked paid until physical delivery).

- **Atelier Administration & Production Worksheet (`/admin`)**:
  - Protected admin portal with metrics (total orders, pending confirmation, in production, shipped, revenue).
  - Order status and payment status lifecycle transitions.
  - **Printable HTML Production Worksheet**: Generates manufacturing job sheets with exact cutting specifications, fabric color codes, embroidery program, and quality checklist for workshop seamstresses.

- **Internationalization (i18n)**:
  - Supports **French** (primary launch language), **English**, and **Arabic**.
  - Dynamic Right-to-Left (RTL) layout switching for Arabic (`dir="rtl"`).
  - Accurate DZD currency formatting.

---

## 2. Technology Stack

- **Frontend**: React 19, TypeScript (strict mode), Vite, Tailwind CSS 3.4
- **3D Engine**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Navigation & Icons**: React Router 7, Lucide Icons
- **Forms & Validation**: React Hook Form, Zod
- **Backend & Database**: Supabase, PostgreSQL with Row Level Security (RLS)
- **Testing**: Vitest unit test suite

---

## 3. Getting Started & Local Development

### Prerequisites
- Node.js `v20+` or `v22+`
- npm `v10+`

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/velenora_medwear.git
cd velenora_medwear

# Install dependencies
npm install --legacy-peer-deps
```

### Environment Configuration
Copy the sample environment file:
```bash
cp .env.example .env
```
Configure your Supabase credentials in `.env` if connecting to a live instance:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
*Note: The platform is built to work offline/locally out-of-the-box with reactive pre-seeded catalog, wilayas, and demo orders.*

### Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Run Tests
```bash
npm test
```

---

## 4. 3D Model Asset Preparation Guidelines

See [`public/models/README.md`](file:///public/models/README.md) for detailed instructions on preparing GLB models.

### Naming Conventions & Mesh Slots:
- `top_main`: Main tunic body
- `top_trim`: Collar and piping trim
- `top_pockets`: Pocket variants
- `pants_main`: Trousers body
- `pants_trim`: Side seam piping
- `embroidery_slot`: Target mesh for dynamic decal projection

---

## 5. Supabase Database Schema & Migrations

The complete PostgreSQL migration script is available at [`supabase/migrations/20261023_initial_schema.sql`](file:///supabase/migrations/20261023_initial_schema.sql).

It includes:
- Tables: `profiles`, `categories`, `products`, `saved_designs`, `orders`, `order_items`, `order_status_history`.
- Strict RLS policies ensuring users only view their own orders and saved designs.
- Public read access for active catalog items.
- Admin-only write access to product catalog and order status transitions.

---

## 6. List of Incomplete Integrations & Production Requirements

Before commercial public launch, the following third-party credentials and steps should be completed:
1. **Supabase Production Instance**: Run the migration script in your Supabase SQL editor and update `.env`.
2. **Algerian Courier API (Yalidine / ZR Express / Procolis)**: Wire courier webhook to generate physical tracking numbers upon order confirmation.
3. **SMS Gateway (e.g. Twilio or local Algerian SMS gateway)**: To automatically send SMS dispatch notices with courier tracking links.
4. **Custom Domain & SSL**: Deploy to Cloudflare Pages, Vercel, or Cloud Run with DNS pointing to `velenora.dz` or `velenora.com`.
