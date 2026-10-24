import React, { useMemo } from 'react';
import '@react-three/fiber';
import * as THREE from 'three';
import type { CustomizationConfig } from '../../../types/configurator';
import { EmbroideryDecal } from './EmbroideryDecal';

interface ProceduralScrubModelProps {
  config: CustomizationConfig;
  viewMode?: 'standard' | 'realistic';
}

// Helper to generate a realistic woven twill fabric micro-texture procedurally
function createFabricBumpMap(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  // Diagonal twill weave lines
  ctx.strokeStyle = '#9A9A9A';
  ctx.lineWidth = 1;
  for (let i = -size; i < size * 2; i += 3) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + size, size);
    ctx.stroke();
  }

  // Intersecting micro-threads
  ctx.strokeStyle = '#6A6A6A';
  for (let i = -size; i < size * 2; i += 3) {
    ctx.beginPath();
    ctx.moveTo(i + 1, 0);
    ctx.lineTo(i + size + 1, size);
    ctx.stroke();
  }

  // Cross-weft subtle relief
  ctx.strokeStyle = '#787878';
  for (let i = -size; i < size * 2; i += 6) {
    ctx.beginPath();
    ctx.moveTo(i + size, 0);
    ctx.lineTo(i, size);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(36, 36);
  return texture;
}

export const ProceduralScrubModel: React.FC<ProceduralScrubModelProps> = ({ config, viewMode = 'realistic' }) => {
  const {
    garmentType,
    fit,
    topColor,
    pantsColor,
    accentColor,
    neckline,
    sleeve,
    pocket,
    pantsFit,
    waistband,
    embroidery,
  } = config;

  const isRealistic = viewMode === 'realistic';
  const isFemale = fit === 'women';
  const shoulderScale = isFemale ? 0.90 : 1.05;
  const waistScale = isFemale ? 0.84 : 0.98;
  const hipScale = isFemale ? 1.02 : 0.98;
  const heightOffset = isFemale ? -0.05 : 0.0;

  const showTop = garmentType === 'top' || garmentType === 'set';
  const showPants = garmentType === 'pants' || garmentType === 'set';

  // Procedural twill fabric bump map
  const fabricBumpTexture = useMemo(() => createFabricBumpMap(), []);

  // Premium Physical Materials with cloth sheen, micro-weave & soft subsurface look
  const topMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(topColor.hex),
      roughness: isRealistic ? 0.74 : 0.82,
      metalness: 0.02,
      sheen: isRealistic ? 0.88 : 0.4,
      sheenColor: new THREE.Color(topColor.hex).offsetHSL(0, 0, 0.14),
      sheenRoughness: 0.45,
      bumpMap: fabricBumpTexture || undefined,
      bumpScale: 0.003,
      side: THREE.DoubleSide,
    });
  }, [topColor.hex, fabricBumpTexture, isRealistic]);

  const pantsMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(pantsColor.hex),
      roughness: isRealistic ? 0.76 : 0.84,
      metalness: 0.02,
      sheen: isRealistic ? 0.85 : 0.4,
      sheenColor: new THREE.Color(pantsColor.hex).offsetHSL(0, 0, 0.14),
      sheenRoughness: 0.45,
      bumpMap: fabricBumpTexture || undefined,
      bumpScale: 0.003,
      side: THREE.DoubleSide,
    });
  }, [pantsColor.hex, fabricBumpTexture, isRealistic]);

  const accentMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(accentColor.hex),
      roughness: 0.65,
      metalness: 0.08,
      sheen: 0.7,
      sheenColor: new THREE.Color(accentColor.hex).offsetHSL(0, 0, 0.1),
      side: THREE.DoubleSide,
    });
  }, [accentColor.hex]);

  const ribbingMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(topColor.hex).offsetHSL(0, -0.05, -0.08),
      roughness: 0.92,
      metalness: 0.02,
    });
  }, [topColor.hex]);

  // Skin tones (smooth satin luxury mannequin finish)
  const skinMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(isFemale ? '#ECC8B4' : '#D5AB92'),
      roughness: 0.52,
      metalness: 0.04,
    });
  }, [isFemale]);

  // Stylized modern hair material
  const hairMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(isFemale ? '#322018' : '#23201F'),
      roughness: 0.75,
      metalness: 0.05,
    });
  }, [isFemale]);

  // Silver metallic details (aglets, buttons, zippers)
  const silverMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D8DEE4'),
      roughness: 0.18,
      metalness: 0.92,
    });
  }, []);

  // Premium ergonomic medical sneakers materials
  const sneakerUpper = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFFFFF'),
      roughness: 0.38,
      metalness: 0.06,
    });
  }, []);

  const sneakerMidsole = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F3F5F7'),
      roughness: 0.65,
      metalness: 0.03,
    });
  }, []);

  const sneakerOutsole = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#CFD5DC'),
      roughness: 0.85,
      metalness: 0.04,
    });
  }, []);

  // Showroom display pedestal
  const pedestalMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ECEFF2'),
      roughness: 0.45,
      metalness: 0.18,
    });
  }, []);

  return (
    <group position={[0, -1.05 + heightOffset, 0]}>
      {/* ======================================================== */}
      {/* 1. LUXURY SHOWROOM PEDESTAL                             */}
      {/* ======================================================== */}
      <mesh position={[0, -0.03, 0]} material={pedestalMaterial} receiveShadow>
        <cylinderGeometry args={[0.72, 0.76, 0.06, 64]} />
      </mesh>
      <mesh position={[0, 0.002, 0]} material={pedestalMaterial} receiveShadow>
        <cylinderGeometry args={[0.68, 0.72, 0.005, 64]} />
      </mesh>

      {/* ======================================================== */}
      {/* 2. REALISTIC HUMAN ANATOMICAL MANNEQUIN BASE            */}
      {/* ======================================================== */}
      <group name="anatomical_mannequin">
        {/* HEAD & FACIAL ANATOMY */}
        <group position={[0, 2.36, 0]}>
          {/* Cranium / Head Form */}
          <mesh material={skinMaterial} castShadow>
            <sphereGeometry args={[0.118, 36, 36]} />
          </mesh>

          {/* Sculpted Jawline & Chin */}
          <mesh position={[0, -0.11, 0.035]} rotation={[0.34, 0, 0]} material={skinMaterial}>
            <cylinderGeometry args={[0.076, 0.042, 0.11, 24]} />
          </mesh>
          <mesh position={[0, -0.155, 0.05]} material={skinMaterial}>
            <sphereGeometry args={[0.042, 20, 20]} />
          </mesh>

          {/* Nose bridge & subtle profile */}
          <mesh position={[0, -0.03, 0.12]} rotation={[0.3, 0, 0]} material={skinMaterial}>
            <coneGeometry args={[0.016, 0.046, 16]} />
          </mesh>

          {/* Sculpted Ears */}
          <mesh position={[0.115, -0.02, -0.01]} rotation={[0, 0.2, 0]} material={skinMaterial}>
            <sphereGeometry args={[0.024, 16, 16]} />
          </mesh>
          <mesh position={[-0.115, -0.02, -0.01]} rotation={[0, -0.2, 0]} material={skinMaterial}>
            <sphereGeometry args={[0.024, 16, 16]} />
          </mesh>

          {/* HAIR SILHOUETTE */}
          {isFemale ? (
            /* Feminine Chic Medical Bun / Chignon */
            <group>
              <mesh position={[0, 0.06, -0.01]} material={hairMaterial}>
                <sphereGeometry args={[0.124, 32, 32]} />
              </mesh>
              {/* Neat tied chignon at back */}
              <mesh position={[0, -0.02, -0.125]} material={hairMaterial}>
                <sphereGeometry args={[0.052, 24, 24]} />
              </mesh>
            </group>
          ) : (
            /* Masculine Modern Tapered Crop */
            <group>
              <mesh position={[0, 0.07, 0.005]} material={hairMaterial}>
                <sphereGeometry args={[0.123, 32, 32]} />
              </mesh>
              <mesh position={[0, 0.09, 0.03]} rotation={[-0.2, 0, 0]} material={hairMaterial}>
                <boxGeometry args={[0.12, 0.04, 0.14]} />
              </mesh>
            </group>
          )}
        </group>

        {/* ANATOMICAL NECK & CLAVICLES */}
        <group position={[0, 2.14, 0.01]} rotation={[0.06, 0, 0]}>
          <mesh material={skinMaterial}>
            <cylinderGeometry args={[0.064, 0.084, 0.22, 32]} />
          </mesh>
        </group>
        {/* Suprasternal notch & Clavicle ridge (visible in V-neck opening) */}
        <mesh position={[0, 2.04, 0.05]} material={skinMaterial}>
          <sphereGeometry args={[0.038, 20, 20]} />
        </mesh>
        <mesh position={[0.12, 2.03, 0.04]} rotation={[0, 0, -0.15]} material={skinMaterial}>
          <cylinderGeometry args={[0.012, 0.012, 0.22, 16]} />
        </mesh>
        <mesh position={[-0.12, 2.03, 0.04]} rotation={[0, 0, 0.15]} material={skinMaterial}>
          <cylinderGeometry args={[0.012, 0.012, 0.22, 16]} />
        </mesh>

        {/* NATURAL SHOWROOM ARMS & HANDS */}
        {/* Left Arm (relaxed posture curving naturally along the torso) */}
        <group position={[0.42 * shoulderScale, 1.94, 0]}>
          {/* Deltoid shoulder curve */}
          <mesh material={skinMaterial}>
            <sphereGeometry args={[0.082, 24, 24]} />
          </mesh>

          {/* Bicep / Upper Arm */}
          <mesh position={[0.06, -0.20, 0.01]} rotation={[0, 0, -0.18]} material={skinMaterial} castShadow>
            <cylinderGeometry args={[0.064, 0.054, 0.38, 20]} />
          </mesh>

          {/* Elbow Joint */}
          <mesh position={[0.10, -0.38, 0.02]} material={skinMaterial}>
            <sphereGeometry args={[0.055, 16, 16]} />
          </mesh>

          {/* Forearm (Tapering to wrist) */}
          <mesh position={[0.14, -0.58, 0.04]} rotation={[0.08, 0, -0.12]} material={skinMaterial} castShadow>
            <cylinderGeometry args={[0.054, 0.042, 0.38, 20]} />
          </mesh>

          {/* Sculpted Hand (Natural relaxed showroom mannequin fingers) */}
          <group position={[0.18, -0.82, 0.06]} rotation={[0.1, 0.15, -0.1]}>
            {/* Palm */}
            <mesh material={skinMaterial} castShadow>
              <boxGeometry args={[0.062, 0.088, 0.032]} />
            </mesh>
            {/* Thumb */}
            <mesh position={[-0.034, 0.01, 0.012]} rotation={[0.2, 0.4, 0.3]} material={skinMaterial}>
              <cylinderGeometry args={[0.013, 0.010, 0.055, 12]} />
            </mesh>
            {/* Relaxed grouped fingers */}
            <mesh position={[0.005, -0.065, 0.006]} rotation={[0.18, 0, 0]} material={skinMaterial}>
              <boxGeometry args={[0.054, 0.062, 0.026]} />
            </mesh>
          </group>
        </group>

        {/* Right Arm (mirror relaxed showroom posture) */}
        <group position={[-0.42 * shoulderScale, 1.94, 0]}>
          {/* Deltoid shoulder curve */}
          <mesh material={skinMaterial}>
            <sphereGeometry args={[0.082, 24, 24]} />
          </mesh>

          {/* Bicep / Upper Arm */}
          <mesh position={[-0.06, -0.20, 0.01]} rotation={[0, 0, 0.18]} material={skinMaterial} castShadow>
            <cylinderGeometry args={[0.064, 0.054, 0.38, 20]} />
          </mesh>

          {/* Elbow Joint */}
          <mesh position={[-0.10, -0.38, 0.02]} material={skinMaterial}>
            <sphereGeometry args={[0.055, 16, 16]} />
          </mesh>

          {/* Forearm */}
          <mesh position={[-0.14, -0.58, 0.04]} rotation={[0.08, 0, 0.12]} material={skinMaterial} castShadow>
            <cylinderGeometry args={[0.054, 0.042, 0.38, 20]} />
          </mesh>

          {/* Sculpted Hand */}
          <group position={[-0.18, -0.82, 0.06]} rotation={[0.1, -0.15, 0.1]}>
            {/* Palm */}
            <mesh material={skinMaterial} castShadow>
              <boxGeometry args={[0.062, 0.088, 0.032]} />
            </mesh>
            {/* Thumb */}
            <mesh position={[0.034, 0.01, 0.012]} rotation={[0.2, -0.4, -0.3]} material={skinMaterial}>
              <cylinderGeometry args={[0.013, 0.010, 0.055, 12]} />
            </mesh>
            {/* Relaxed grouped fingers */}
            <mesh position={[-0.005, -0.065, 0.006]} rotation={[0.18, 0, 0]} material={skinMaterial}>
              <boxGeometry args={[0.054, 0.062, 0.026]} />
            </mesh>
          </group>
        </group>

        {/* HIGH-END MEDICAL ERGONOMIC SNEAKERS */}
        {/* Left Sneaker */}
        <group position={[0.165, 0.05, 0.03]}>
          {/* Outsole Grip Tread */}
          <mesh position={[0, -0.04, 0.01]} material={sneakerOutsole}>
            <boxGeometry args={[0.13, 0.015, 0.31]} />
          </mesh>
          {/* Chunky Ergonomic Midsole (Hoka/On-style rocker sole) */}
          <mesh position={[0, -0.015, 0.01]} material={sneakerMidsole} castShadow>
            <boxGeometry args={[0.135, 0.045, 0.30]} />
          </mesh>
          {/* Main Breathable Upper */}
          <mesh position={[0, 0.04, -0.01]} material={sneakerUpper} castShadow>
            <boxGeometry args={[0.125, 0.075, 0.25]} />
          </mesh>
          {/* Contoured Toe Box */}
          <mesh position={[0, 0.025, 0.095]} material={sneakerUpper}>
            <cylinderGeometry args={[0.058, 0.062, 0.05, 24]} />
          </mesh>
          {/* Lacing Over Tongue */}
          <mesh position={[0, 0.072, 0.02]} rotation={[-0.32, 0, 0]} material={sneakerMidsole}>
            <boxGeometry args={[0.055, 0.08, 0.015]} />
          </mesh>
        </group>

        {/* Right Sneaker */}
        <group position={[-0.165, 0.05, 0.03]}>
          {/* Outsole Grip Tread */}
          <mesh position={[0, -0.04, 0.01]} material={sneakerOutsole}>
            <boxGeometry args={[0.13, 0.015, 0.31]} />
          </mesh>
          {/* Chunky Ergonomic Midsole */}
          <mesh position={[0, -0.015, 0.01]} material={sneakerMidsole} castShadow>
            <boxGeometry args={[0.135, 0.045, 0.30]} />
          </mesh>
          {/* Main Breathable Upper */}
          <mesh position={[0, 0.04, -0.01]} material={sneakerUpper} castShadow>
            <boxGeometry args={[0.125, 0.075, 0.25]} />
          </mesh>
          {/* Contoured Toe Box */}
          <mesh position={[0, 0.025, 0.095]} material={sneakerUpper}>
            <cylinderGeometry args={[0.058, 0.062, 0.05, 24]} />
          </mesh>
          {/* Lacing Over Tongue */}
          <mesh position={[0, 0.072, 0.02]} rotation={[-0.32, 0, 0]} material={sneakerMidsole}>
            <boxGeometry args={[0.055, 0.08, 0.015]} />
          </mesh>
        </group>
      </group>

      {/* ======================================================== */}
      {/* 3. TAILORED MEDICAL SCRUB TOP (BLOUSE MÉDICALE)          */}
      {/* ======================================================== */}
      {showTop && (
        <group name="garment_top">
          {/* UPPER TORSO & CHEST YOKE */}
          <mesh
            position={[0, 1.82, 0.01]}
            scale={[shoulderScale, 1, 0.88]}
            material={topMaterial}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[0.39, 0.42, 0.30, 36]} />
          </mesh>

          {/* MID TORSO & WAIST DRAPE */}
          <mesh
            position={[0, 1.53, 0.01]}
            scale={[shoulderScale * waistScale, 1, 0.86]}
            material={topMaterial}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[0.42, 0.40, 0.30, 36]} />
          </mesh>

          {/* LOWER TUNIC & HIP FLARE */}
          <mesh
            position={[0, 1.25, 0.01]}
            scale={[shoulderScale * hipScale, 1, 0.88]}
            material={topMaterial}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[0.40, 0.44, 0.30, 36]} />
          </mesh>

          {/* AUTHENTIC SIDE VENTS (Fentes d'aisance latérales) */}
          <mesh position={[0.435 * shoulderScale * hipScale, 1.13, 0.01]} material={accentMaterial}>
            <boxGeometry args={[0.008, 0.12, 0.04]} />
          </mesh>
          <mesh position={[-0.435 * shoulderScale * hipScale, 1.13, 0.01]} material={accentMaterial}>
            <boxGeometry args={[0.008, 0.12, 0.04]} />
          </mesh>

          {/* NATURAL ANATOMICAL SHOULDERS (SLOPED YOKE) */}
          {/* Left Shoulder Slope */}
          <mesh
            position={[0.24 * shoulderScale, 1.99, 0.01]}
            rotation={[0, 0, -0.16]}
            scale={[shoulderScale, 1, 0.85]}
            material={topMaterial}
          >
            <boxGeometry args={[0.36, 0.08, 0.36]} />
          </mesh>
          {/* Right Shoulder Slope */}
          <mesh
            position={[-0.24 * shoulderScale, 1.99, 0.01]}
            rotation={[0, 0, 0.16]}
            scale={[shoulderScale, 1, 0.85]}
            material={topMaterial}
          >
            <boxGeometry args={[0.36, 0.08, 0.36]} />
          </mesh>

          {/* SHOULDER TOPSTITCHING ACCENT TRIM */}
          <mesh position={[0.25 * shoulderScale, 2.03, 0.01]} rotation={[0, 0, -0.16]} material={accentMaterial}>
            <boxGeometry args={[0.32, 0.012, 0.02]} />
          </mesh>
          <mesh position={[-0.25 * shoulderScale, 2.03, 0.01]} rotation={[0, 0, 0.16]} material={accentMaterial}>
            <boxGeometry args={[0.32, 0.012, 0.02]} />
          </mesh>

          {/* ====================================================== */}
          {/* NECKLINE CONSTRUCTION (COL V / COL MAO / COL ROND)     */}
          {/* ====================================================== */}
          {neckline === 'v_neck' && (
            <group position={[0, 1.88, 0.34]}>
              {/* Left V Lapel band curving to sternum */}
              <mesh position={[-0.075, 0.04, 0.02]} rotation={[-0.14, 0.04, 0.44]} material={accentMaterial}>
                <boxGeometry args={[0.038, 0.28, 0.022]} />
              </mesh>
              {/* Right V Lapel band crossing over */}
              <mesh position={[0.075, 0.04, 0.02]} rotation={[-0.14, -0.04, -0.44]} material={accentMaterial}>
                <boxGeometry args={[0.038, 0.28, 0.022]} />
              </mesh>
              {/* V-Neck base bar-tack reinforcement */}
              <mesh position={[0, -0.08, 0.025]} material={accentMaterial}>
                <boxGeometry args={[0.042, 0.014, 0.02]} />
              </mesh>
            </group>
          )}

          {neckline === 'round' && (
            <group position={[0, 2.01, 0.04]} rotation={[0.24, 0, 0]}>
              <mesh material={ribbingMaterial}>
                <torusGeometry args={[0.14, 0.028, 16, 32]} />
              </mesh>
              <mesh position={[0, -0.02, 0.01]} material={accentMaterial}>
                <torusGeometry args={[0.148, 0.008, 12, 32]} />
              </mesh>
            </group>
          )}

          {neckline === 'mandarin' && (
            <group position={[0, 2.05, 0.02]}>
              {/* Standing mandarin collar ring with front notch */}
              <mesh material={accentMaterial}>
                <cylinderGeometry args={[0.13, 0.14, 0.075, 32, 1, true, 0.3, Math.PI * 1.8]} />
              </mesh>
              {/* Fine metallic closure button */}
              <mesh position={[0.045, -0.005, 0.135]} rotation={[Math.PI / 2, 0, 0]} material={silverMaterial}>
                <cylinderGeometry args={[0.012, 0.012, 0.012, 16]} />
              </mesh>
            </group>
          )}

          {/* ====================================================== */}
          {/* SLEEVES: SHORT / LONG WITH AUTHENTIC HEM & PIPING      */}
          {/* ====================================================== */}
          {/* Left Sleeve */}
          <group position={[0.42 * shoulderScale, 1.85, 0.01]} rotation={[0, 0, -0.26]}>
            <mesh material={topMaterial} castShadow>
              <cylinderGeometry
                args={[
                  0.142,
                  sleeve === 'long' ? 0.105 : 0.132,
                  sleeve === 'long' ? 0.88 : 0.36,
                  24,
                ]}
              />
            </mesh>
            {/* Sleeve edge detail */}
            {sleeve === 'short' && (
              <group position={[0, -0.17, 0]}>
                {/* Folded Hem Cuff */}
                <mesh material={accentMaterial}>
                  <cylinderGeometry args={[0.134, 0.134, 0.025, 24]} />
                </mesh>
              </group>
            )}
            {sleeve === 'long' && (
              <mesh position={[0, -0.45, 0]} material={ribbingMaterial}>
                <cylinderGeometry args={[0.098, 0.098, 0.08, 24]} />
              </mesh>
            )}
          </group>

          {/* Right Sleeve */}
          <group position={[-0.42 * shoulderScale, 1.85, 0.01]} rotation={[0, 0, 0.26]}>
            <mesh material={topMaterial} castShadow>
              <cylinderGeometry
                args={[
                  0.142,
                  sleeve === 'long' ? 0.105 : 0.132,
                  sleeve === 'long' ? 0.88 : 0.36,
                  24,
                ]}
              />
            </mesh>
            {/* Sleeve edge detail */}
            {sleeve === 'short' && (
              <group position={[0, -0.17, 0]}>
                <mesh material={accentMaterial}>
                  <cylinderGeometry args={[0.134, 0.134, 0.025, 24]} />
                </mesh>
              </group>
            )}
            {sleeve === 'long' && (
              <mesh position={[0, -0.45, 0]} material={ribbingMaterial}>
                <cylinderGeometry args={[0.098, 0.098, 0.08, 24]} />
              </mesh>
            )}
          </group>

          {/* ====================================================== */}
          {/* POCKETS: AUTHENTIC PATCH POCKETS WITH STITCHING        */}
          {/* ====================================================== */}
          {/* Left Chest Patch Pocket with Pen Slot Divider */}
          {(pocket === 'single_chest' || pocket === 'cargo_combo') && (
            <group position={[0.18, 1.58, 0.365]} rotation={[-0.04, 0.08, 0]}>
              {/* Pocket Patch */}
              <mesh material={topMaterial} castShadow>
                <boxGeometry args={[0.17, 0.19, 0.014]} />
              </mesh>
              {/* Top Accent Ribbon Band */}
              <mesh position={[0, 0.088, 0.008]} material={accentMaterial}>
                <boxGeometry args={[0.172, 0.024, 0.012]} />
              </mesh>
              {/* Pen Divider Stitch Line */}
              <mesh position={[-0.04, 0, 0.009]} material={accentMaterial}>
                <boxGeometry args={[0.008, 0.16, 0.01]} />
              </mesh>
            </group>
          )}

          {/* Dual Lower Hip Pockets */}
          {(pocket === 'double_chest' || pocket === 'cargo_combo') && (
            <group>
              {/* Left Lower Pocket */}
              <group position={[0.22, 1.24, 0.375]} rotation={[-0.02, 0.12, 0]}>
                <mesh material={topMaterial} castShadow>
                  <boxGeometry args={[0.20, 0.22, 0.014]} />
                </mesh>
                <mesh position={[0, 0.10, 0.008]} material={accentMaterial}>
                  <boxGeometry args={[0.202, 0.024, 0.012]} />
                </mesh>
              </group>
              {/* Right Lower Pocket */}
              <group position={[-0.22, 1.24, 0.375]} rotation={[-0.02, -0.12, 0]}>
                <mesh material={topMaterial} castShadow>
                  <boxGeometry args={[0.20, 0.22, 0.014]} />
                </mesh>
                <mesh position={[0, 0.10, 0.008]} material={accentMaterial}>
                  <boxGeometry args={[0.202, 0.024, 0.012]} />
                </mesh>
              </group>
            </group>
          )}

          {/* Sleek Metallic Zipper Pocket Accent */}
          {pocket === 'cargo_combo' && (
            <group position={[-0.18, 1.58, 0.365]} rotation={[-0.04, -0.08, 0]}>
              {/* Pocket Welting */}
              <mesh material={topMaterial}>
                <boxGeometry args={[0.16, 0.038, 0.012]} />
              </mesh>
              {/* Silver Zipper Teeth */}
              <mesh position={[0, 0, 0.008]} material={silverMaterial}>
                <boxGeometry args={[0.14, 0.012, 0.012]} />
              </mesh>
              {/* Silver Pull Tab */}
              <mesh position={[-0.05, -0.015, 0.016]} material={silverMaterial}>
                <boxGeometry args={[0.014, 0.025, 0.008]} />
              </mesh>
            </group>
          )}

          {/* 3D Personalized Doctor Embroidery Decal */}
          <EmbroideryDecal config={embroidery} sleeve={sleeve} />
        </group>
      )}

      {/* ======================================================== */}
      {/* 4. TAILORED MEDICAL SCRUB TROUSERS (PANTALON MÉDICAL)    */}
      {/* ======================================================== */}
      {showPants && (
        <group name="garment_pants">
          {/* PELVIS / UPPER HIP DRAPE */}
          <mesh
            position={[0, 0.98, 0.01]}
            scale={[shoulderScale * hipScale, 1, 0.88]}
            material={pantsMaterial}
            castShadow
          >
            <cylinderGeometry args={[0.39, 0.41, 0.28, 36]} />
          </mesh>

          {/* CONTROURED WAISTBAND */}
          <mesh
            position={[0, 1.11, 0.01]}
            scale={[shoulderScale * waistScale, 1, 0.86]}
            material={waistband === 'elastic_drawstring' ? ribbingMaterial : pantsMaterial}
          >
            <cylinderGeometry args={[0.39, 0.39, 0.08, 36]} />
          </mesh>

          {/* DRAWSTRING WITH SILVER GROMMETS & METAL AGLETS */}
          {waistband === 'elastic_drawstring' && (
            <group position={[0, 1.105, 0.345]}>
              {/* Twin Silver Grommets / Eyelets */}
              <mesh position={[-0.03, 0, 0.005]} rotation={[Math.PI / 2, 0, 0]} material={silverMaterial}>
                <torusGeometry args={[0.012, 0.003, 8, 16]} />
              </mesh>
              <mesh position={[0.03, 0, 0.005]} rotation={[Math.PI / 2, 0, 0]} material={silverMaterial}>
                <torusGeometry args={[0.012, 0.003, 8, 16]} />
              </mesh>

              {/* Realistic 3D Central Tied Bow Knot */}
              <mesh material={accentMaterial}>
                <sphereGeometry args={[0.022, 16, 16]} />
              </mesh>

              {/* Left Hanging Cord with Silver Aglet */}
              <group position={[-0.024, -0.06, 0.012]} rotation={[0, 0, -0.15]}>
                <mesh material={accentMaterial}>
                  <cylinderGeometry args={[0.006, 0.006, 0.10, 10]} />
                </mesh>
                <mesh position={[0, -0.055, 0]} material={silverMaterial}>
                  <cylinderGeometry args={[0.008, 0.008, 0.022, 12]} />
                </mesh>
              </group>

              {/* Right Hanging Cord with Silver Aglet */}
              <group position={[0.024, -0.06, 0.012]} rotation={[0, 0, 0.15]}>
                <mesh material={accentMaterial}>
                  <cylinderGeometry args={[0.006, 0.006, 0.10, 10]} />
                </mesh>
                <mesh position={[0, -0.055, 0]} material={silverMaterial}>
                  <cylinderGeometry args={[0.008, 0.008, 0.022, 12]} />
                </mesh>
              </group>
            </group>
          )}

          {/* LEFT LEG */}
          <group position={[0.165, 0.52, 0.01]}>
            {/* Upper Thigh */}
            <mesh position={[0, 0.22, 0]} material={pantsMaterial} castShadow receiveShadow>
              <cylinderGeometry args={[0.175, 0.155, 0.38, 28]} />
            </mesh>

            {/* Lower Leg / Calf */}
            <mesh
              position={[0, -0.16, 0]}
              material={pantsMaterial}
              castShadow
              receiveShadow
            >
              <cylinderGeometry
                args={[
                  0.155,
                  pantsFit === 'jogger_cuff' ? 0.125 : pantsFit === 'tapered' ? 0.132 : 0.152,
                  0.44,
                  28,
                ]}
              />
            </mesh>

            {/* Continuous Outer Seam Accent Piping */}
            <mesh position={[0.165, 0.02, 0]} material={accentMaterial}>
              <cylinderGeometry args={[0.007, 0.007, 0.82, 12]} />
            </mesh>

            {/* Jogger Elastic Ankle Ribbed Cuff */}
            {pantsFit === 'jogger_cuff' && (
              <group position={[0, -0.40, 0]}>
                {/* Fabric Gather Puff */}
                <mesh position={[0, 0.03, 0]} material={pantsMaterial}>
                  <torusGeometry args={[0.122, 0.015, 12, 24]} />
                </mesh>
                {/* Ribbed Cuff */}
                <mesh position={[0, -0.02, 0]} material={ribbingMaterial}>
                  <cylinderGeometry args={[0.112, 0.112, 0.075, 24]} />
                </mesh>
              </group>
            )}
          </group>

          {/* RIGHT LEG */}
          <group position={[-0.165, 0.52, 0.01]}>
            {/* Upper Thigh */}
            <mesh position={[0, 0.22, 0]} material={pantsMaterial} castShadow receiveShadow>
              <cylinderGeometry args={[0.175, 0.155, 0.38, 28]} />
            </mesh>

            {/* Lower Leg / Calf */}
            <mesh
              position={[0, -0.16, 0]}
              material={pantsMaterial}
              castShadow
              receiveShadow
            >
              <cylinderGeometry
                args={[
                  0.155,
                  pantsFit === 'jogger_cuff' ? 0.125 : pantsFit === 'tapered' ? 0.132 : 0.152,
                  0.44,
                  28,
                ]}
              />
            </mesh>

            {/* Continuous Outer Seam Accent Piping */}
            <mesh position={[-0.165, 0.02, 0]} material={accentMaterial}>
              <cylinderGeometry args={[0.007, 0.007, 0.82, 12]} />
            </mesh>

            {/* Jogger Elastic Ankle Ribbed Cuff */}
            {pantsFit === 'jogger_cuff' && (
              <group position={[0, -0.40, 0]}>
                {/* Fabric Gather Puff */}
                <mesh position={[0, 0.03, 0]} material={pantsMaterial}>
                  <torusGeometry args={[0.122, 0.015, 12, 24]} />
                </mesh>
                {/* Ribbed Cuff */}
                <mesh position={[0, -0.02, 0]} material={ribbingMaterial}>
                  <cylinderGeometry args={[0.112, 0.112, 0.075, 24]} />
                </mesh>
              </group>
            )}
          </group>
        </group>
      )}
    </group>
  );
};
