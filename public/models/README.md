# Velenora Medwear — 3D Asset Preparation Guidelines

This document outlines the 3D specifications and manifest architecture for importing new GLB/glTF scrub garments into the Velenora Medwear 3D Customizer.

## 1. Coordinate System & Unit Scale
- **Unit**: Meters ($1.0 = 1$ meter).
- **Origin**: Ground level $(0, 0, 0)$ centered between feet / pedestal.
- **Orientation**: $+Y$ is Up, $+Z$ is Forward (Front of garment faces $+Z$).
- **Bounding Box**: Uniform height approx $1.5m - 1.8m$.

## 2. Naming Conventions & Mesh Slots
To allow real-time material swapping, geometry toggling, and texture overlays, meshes inside the GLB model must adhere to the following naming conventions:

| Slot Identifier | Component | Description |
|-----------------|-----------|-------------|
| `top_main` | Scrub Top Torso & Sleeves | Primary fabric mesh for top garment |
| `top_trim` | Collar & Shoulder Piping | Contrast piping or neckline trim |
| `top_pockets` | Chest & Waist Pockets | Pocket mesh variants |
| `pants_main` | Scrub Trousers Legs | Primary fabric mesh for pants |
| `pants_trim` | Side Seam Piping | Contrast side striping or accents |
| `pants_pockets` | Cargo & Back Pockets | Trousers pocket meshes |
| `embroidery_slot` | Chest / Sleeve Decal Surface | Target surface mesh for decal projection |
| `mannequin_body` | Display Mannequin | Neutral matte grey showroom stand |

## 3. Garment Variant Meshes (Geometry Swapping)
Components that alter physical shape must be exported as separate meshes rather than trying to morph textures:
- Sleeves: `sleeve_short` and `sleeve_long`
- Necklines: `neck_v_neck`, `neck_mandarin`, and `neck_round`
- Pant Cuffs: `cuff_standard` and `cuff_jogger`

## 4. Materials and PBR Maps
- Standard PBR workflow (Roughness, Metalness, Normal Map).
- Fabric Roughness: `0.80 - 0.90`.
- Fabric Metalness: `0.02 - 0.05`.
- Normal Map: 1024x1024 seamless twill/micro-weave pattern.
- Embedded colors should be neutral white/light grey so runtime Three.js color multiplication remains accurate.

## 5. File Optimization
- Format: Binary GLB (`.glb`).
- Max File Size: < 4 MB per garment set.
- Draco compression: Recommended for high polygon counts.
- Place production models in `public/models/` and reference them in `model_manifest`.
