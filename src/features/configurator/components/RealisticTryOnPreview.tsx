import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type { CustomizationConfig } from '../../../types/configurator';
import { Sparkles, Eye } from 'lucide-react';

interface RealisticTryOnPreviewProps {
  config: CustomizationConfig;
  orientation: 'front' | 'back' | 'left' | 'right' | 'custom';
  isAutoRotating: boolean;
  onAngleChange?: (angle: number) => void;
  onPauseRotate?: () => void;
  onOrientationChange?: (dir: 'front' | 'back' | 'left' | 'right') => void;
  zoomLevel?: number; // 0.8 to 1.3
}

const IMAGES = {
  men: {
    front: '/images/tryon/men-front.jpg',
    side: '/images/tryon/men-side.jpg',
    back: '/images/tryon/men-back.jpg',
  },
  women: {
    front: '/images/tryon/women-front.jpg',
    side: '/images/tryon/women-side.jpg',
    back: '/images/tryon/women-back.jpg',
  },
} as const;

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return { r: 20, g: 44, b: 70 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export const RealisticTryOnPreview: React.FC<RealisticTryOnPreviewProps> = ({
  config,
  orientation,
  isAutoRotating,
  onPauseRotate,
  onOrientationChange,
  zoomLevel = 1.0,
}) => {
  const fitKey = config.fit === 'women' ? 'women' : 'men';
  const modelImages = IMAGES[fitKey];

  // Current turntable angle in degrees (0 = front, 90 = right, 180 = back, 270 = left)
  const [angle, setAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartAngle = useRef(0);

  // Canvas element for rendered photorealistic preview
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cache of recolored offscreen canvases: key = 'front' | 'side' | 'back'
  const recoloredCanvases = useRef<Record<string, HTMLCanvasElement>>({});
  const [recolorVersion, setRecolorVersion] = useState(0);

  // Sync orientation prop when clicked via toolbar
  useEffect(() => {
    if (orientation === 'front') setAngle(0);
    else if (orientation === 'right') setAngle(90);
    else if (orientation === 'back') setAngle(180);
    else if (orientation === 'left') setAngle(270);
  }, [orientation]);

  // Turntable 360 rotation loop
  useEffect(() => {
    if (!isAutoRotating || isDragging) return;

    let animId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      setAngle((prev) => (prev + delta * 24) % 360);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isAutoRotating, isDragging]);

  // Determine active view from turntable angle
  const normalizedAngle = ((angle % 360) + 360) % 360;

  let activeViewKey: 'front' | 'side' | 'back' = 'front';
  let isMirrored = false;
  let relativeOffset = 0;
  let viewName = 'front';

  if (normalizedAngle >= 315 || normalizedAngle < 45) {
    activeViewKey = 'front';
    relativeOffset = normalizedAngle >= 315 ? normalizedAngle - 360 : normalizedAngle;
    viewName = 'front';
  } else if (normalizedAngle >= 45 && normalizedAngle < 135) {
    activeViewKey = 'side';
    relativeOffset = normalizedAngle - 90;
    viewName = 'side-right';
  } else if (normalizedAngle >= 135 && normalizedAngle < 225) {
    activeViewKey = 'back';
    relativeOffset = normalizedAngle - 180;
    viewName = 'back';
  } else {
    activeViewKey = 'side';
    isMirrored = true;
    relativeOffset = normalizedAngle - 270;
    viewName = 'side-left';
  }

  // Pre-load and recolor front, side, and back images whenever colors or fit change
  useEffect(() => {
    let isCancelled = false;

    const views: Array<'front' | 'side' | 'back'> = ['front', 'side', 'back'];
    const topHex = config.topColor.hex;
    const pantsHex = config.pantsColor.hex;
    const accentHex = config.accentColor.hex;
    const garmentType = config.garmentType;

    const topRgb = hexToRgb(topHex);
    const pantsRgb = hexToRgb(pantsHex);
    const accentRgb = hexToRgb(accentHex);

    const topLight = (topRgb.r + topRgb.g + topRgb.b) / 3 > 180;
    const pantsLight = (pantsRgb.r + pantsRgb.g + pantsRgb.b) / 3 > 180;
    const accentLight = (accentRgb.r + accentRgb.g + accentRgb.b) / 3 > 180;

    let loadedCount = 0;

    views.forEach((v) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = modelImages[v];

      img.onload = () => {
        if (isCancelled) return;
        const offCanvas = document.createElement('canvas');
        offCanvas.width = img.naturalWidth || img.width;
        offCanvas.height = img.naturalHeight || img.height;
        const ctx = offCanvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, offCanvas.width, offCanvas.height);
        const data = imgData.data;
        const w = offCanvas.width;
        const h = offCanvas.height;
        const splitY = h * 0.46;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const y = Math.floor(i / 4 / w);

          // Accent trim (teal collar band and sleeve trim)
          const isAccent = g > r + 18 && g > 55 && (r + g + b) / 3 < 220;
          // Scrub cloth (navy top and trousers)
          const isCloth = b > r + 4 && (r + g + b) / 3 < 235 && b > 15;

          if (isAccent) {
            let lum = (0.299 * r + 0.587 * g + 0.114 * b) / 95.0;
            if (accentLight) lum = 0.55 + 0.45 * lum;
            data[i] = Math.min(255, Math.round(accentRgb.r * lum));
            data[i + 1] = Math.min(255, Math.round(accentRgb.g * lum));
            data[i + 2] = Math.min(255, Math.round(accentRgb.b * lum));
          } else if (isCloth) {
            const isTop = y < splitY;
            if (garmentType === 'top' && !isTop) continue;
            if (garmentType === 'pants' && isTop) continue;

            const targetRgb = isTop ? topRgb : pantsRgb;
            const isLight = isTop ? topLight : pantsLight;

            let lum = (0.299 * r + 0.587 * g + 0.114 * b) / 52.0;
            if (isLight) {
              lum = 0.55 + 0.45 * lum;
            }

            data[i] = Math.min(255, Math.round(targetRgb.r * lum));
            data[i + 1] = Math.min(255, Math.round(targetRgb.g * lum));
            data[i + 2] = Math.min(255, Math.round(targetRgb.b * lum));
          }
        }

        ctx.putImageData(imgData, 0, 0);
        recoloredCanvases.current[v] = offCanvas;
        loadedCount += 1;

        if (loadedCount === views.length) {
          setRecolorVersion((ver) => ver + 1);
        }
      };
    });

    return () => {
      isCancelled = true;
    };
  }, [
    fitKey,
    modelImages,
    config.topColor.hex,
    config.pantsColor.hex,
    config.accentColor.hex,
    config.garmentType,
  ]);

  // Draw current angle frame onto visible canvas
  const drawActiveFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sourceCanvas = recoloredCanvases.current[activeViewKey];
    if (!sourceCanvas) return;

    if (canvas.width !== sourceCanvas.width || canvas.height !== sourceCanvas.height) {
      canvas.width = sourceCanvas.width;
      canvas.height = sourceCanvas.height;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    if (isMirrored) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(sourceCanvas, 0, 0);
    ctx.restore();
  }, [activeViewKey, isMirrored]);

  useEffect(() => {
    drawActiveFrame();
  }, [drawActiveFrame, recolorVersion]);

  // Pointer drag for manual rotation
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartAngle.current = angle;
    onPauseRotate?.();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX.current;
    const newAngle = ((dragStartAngle.current - deltaX * 0.75) % 360 + 360) % 360;
    setAngle(newAngle);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    }
  };

  // Subtle 3D yaw tilt
  const subRotateY = Math.max(-18, Math.min(18, relativeOffset * 0.35));

  // Determine active style labels for floating chips
  const activeStyleChips = useMemo(() => {
    const chips: string[] = [];
    if (config.neckline === 'round') chips.push('Col Rond');
    else if (config.neckline === 'mandarin') chips.push('Col Mao');

    if (config.sleeve === 'long') chips.push('Manches Longues');

    if (config.pocket === 'double_chest') chips.push('Poches Doubles');
    else if (config.pocket === 'cargo_combo') chips.push('Poches Zippées');

    if (config.pantsFit === 'tapered') chips.push('Coupe Slim');
    else if (config.pantsFit === 'jogger_cuff') chips.push('Coupe Jogger');

    return chips;
  }, [config.neckline, config.sleeve, config.pocket, config.pantsFit]);

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-white select-none cursor-grab active:cursor-grabbing touch-none flex flex-col justify-end items-center"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Active Style Confirmation Chips (Top-Left of Mannequin Stage) */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex flex-wrap gap-1 max-w-[65%] pointer-events-none">
        {activeStyleChips.map((chip) => (
          <span
            key={chip}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-[#142C46]/90 backdrop-blur-md text-white shadow-sm border border-white/20 animate-fade-in"
          >
            <Sparkles className="w-2.5 h-2.5 text-[#087A83]" />
            {chip}
          </span>
        ))}
      </div>

      {/* Back View Helper: Jump to Front to see embroidery */}
      {viewName === 'back' && config.embroidery.enabled && (
        <button
          type="button"
          onClick={() => {
            setAngle(0);
            onOrientationChange?.('front');
          }}
          className="absolute top-3 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/95 backdrop-blur-md text-[#142C46] shadow-md border border-[#E1E5E8] hover:bg-[#F1F2F3] transition"
        >
          <Eye className="w-3.5 h-3.5 text-[#087A83]" />
          <span>Broderie sur le devant • Voir face</span>
        </button>
      )}

      {/* Soft Contact Floor Shadow */}
      <div className="absolute left-1/2 bottom-[3%] sm:bottom-[4%] -translate-x-1/2 w-[38%] max-w-[260px] h-2.5 rounded-[100%] bg-black/5 blur-[3px] pointer-events-none" />

      {/* 3D Perspective Stage Container */}
      <div
        className="relative w-full h-[90%] sm:h-[92%] flex items-end justify-center pb-6 sm:pb-8 transition-transform duration-200 ease-out"
        style={{
          perspective: '1200px',
          transform: `scale(${zoomLevel})`,
        }}
      >
        <div
          className="relative h-full w-auto max-w-[min(94%,480px)] aspect-[3/4] flex items-end justify-center transition-transform duration-150"
          style={{
            transform: `rotateY(${subRotateY}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Main Photorealistic Recolor Canvas */}
          <canvas
            ref={canvasRef}
            className="h-full w-full object-contain object-bottom select-none pointer-events-none"
          />

          {/* Fallback image shown while canvas finishes initial recoloring */}
          {recolorVersion === 0 && (
            <img
              src={modelImages[activeViewKey]}
              alt="Aperçu Velenora Medwear"
              className="absolute inset-0 h-full w-full object-contain object-bottom select-none pointer-events-none"
              style={{
                transform: isMirrored ? 'scaleX(-1)' : 'none',
              }}
              draggable={false}
            />
          )}

          {/* ==================================================================== */}
          {/* STEP 4: PHOTOREALISTIC STYLE OVERLAYS (FRONT VIEW)                   */}
          {/* ==================================================================== */}
          {viewName === 'front' && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                {/* Collar Ribbing Pattern */}
                <pattern id="ribbedPattern" width="1" height="0.6" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0.3" x2="1" y2="0.3" stroke="rgba(0,0,0,0.18)" strokeWidth="0.25" />
                </pattern>
                {/* Metallic Zipper Pattern */}
                <pattern id="zipperTeeth" width="0.4" height="0.8" patternUnits="userSpaceOnUse">
                  <rect x="0" y="0.2" width="0.3" height="0.4" fill="#D1D5DB" />
                </pattern>
              </defs>

              {/* 1. NECKLINE: COL ROND (Crew Neck Insert) */}
              {config.neckline === 'round' && (
                <g className="animate-fade-in">
                  {/* Crew neck insert closing the V-notch */}
                  <path
                    d="M 45.2 13.6 Q 50 17.6 54.8 13.6 Q 50 18.8 45.2 13.6 Z"
                    fill={config.topColor.hex}
                  />
                  {/* Crew neck ribbed binding */}
                  <path
                    d="M 45 13.5 Q 50 17.8 55 13.5"
                    fill="none"
                    stroke={config.accentColor.hex}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 45 13.5 Q 50 17.8 55 13.5"
                    fill="none"
                    stroke="url(#ribbedPattern)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </g>
              )}

              {/* 1. NECKLINE: COL MAO (Mandarin Stand Collar) */}
              {config.neckline === 'mandarin' && (
                <g className="animate-fade-in">
                  {/* Mandarin collar band */}
                  <path
                    d="M 43.6 13.2 L 56.4 13.2 Q 56 15.2 50 15.2 Q 44 15.2 43.6 13.2 Z"
                    fill={config.topColor.hex}
                    stroke="rgba(0,0,0,0.25)"
                    strokeWidth="0.3"
                  />
                  {/* Top accent piping */}
                  <path
                    d="M 43.6 13.2 L 56.4 13.2"
                    stroke={config.accentColor.hex}
                    strokeWidth="0.8"
                    strokeLinecap="round"
                  />
                  {/* Center notch & metallic snap button */}
                  <circle cx="50" cy="14.2" r="0.65" fill="#E5E7EB" stroke="#6B7280" strokeWidth="0.2" />
                  <circle cx="50" cy="14.2" r="0.3" fill="#9CA3AF" />
                </g>
              )}

              {/* 2. SLEEVES: MANCHES LONGUES (Extended Sleeves to Wrists) */}
              {config.sleeve === 'long' && (
                <g className="animate-fade-in">
                  {/* Right arm sleeve extension (viewer's left) */}
                  <path
                    d="M 33.2 24.2 L 30.6 38.6 L 33.6 39.0 L 36.6 24.6 Z"
                    fill={config.topColor.hex}
                  />
                  <path
                    d="M 33.2 24.2 L 30.6 38.6 L 33.6 39.0 L 36.6 24.6 Z"
                    fill="none"
                    stroke="rgba(0,0,0,0.18)"
                    strokeWidth="0.3"
                  />
                  {/* Wrist ribbed cuff */}
                  <rect
                    x="30.4"
                    y="38.5"
                    width="3.4"
                    height="1.5"
                    rx="0.4"
                    fill={config.accentColor.hex}
                    stroke="rgba(0,0,0,0.25)"
                    strokeWidth="0.2"
                  />

                  {/* Left arm sleeve extension (viewer's right) */}
                  <path
                    d="M 63.4 24.6 L 66.4 39.0 L 69.4 38.6 L 66.8 24.2 Z"
                    fill={config.topColor.hex}
                  />
                  <path
                    d="M 63.4 24.6 L 66.4 39.0 L 69.4 38.6 L 66.8 24.2 Z"
                    fill="none"
                    stroke="rgba(0,0,0,0.18)"
                    strokeWidth="0.3"
                  />
                  {/* Wrist ribbed cuff */}
                  <rect
                    x="66.2"
                    y="38.5"
                    width="3.4"
                    height="1.5"
                    rx="0.4"
                    fill={config.accentColor.hex}
                    stroke="rgba(0,0,0,0.25)"
                    strokeWidth="0.2"
                  />
                </g>
              )}

              {/* 3. POCKETS: DOUBLE POCHES (Two Lower Patch Pockets) */}
              {config.pocket === 'double_chest' && (
                <g className="animate-fade-in">
                  {/* Right hip pocket */}
                  <path
                    d="M 36.5 38.5 L 43.5 38.5 L 43.0 44.5 L 37.0 44.5 Z"
                    fill={config.topColor.hex}
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="0.4"
                  />
                  <line x1="36.5" y1="39.2" x2="43.5" y2="39.2" stroke={config.accentColor.hex} strokeWidth="0.5" />

                  {/* Left hip pocket */}
                  <path
                    d="M 56.5 38.5 L 63.5 38.5 L 63.0 44.5 L 57.0 44.5 Z"
                    fill={config.topColor.hex}
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="0.4"
                  />
                  <line x1="56.5" y1="39.2" x2="63.5" y2="39.2" stroke={config.accentColor.hex} strokeWidth="0.5" />
                </g>
              )}

              {/* 3. POCKETS: POCHE ZIPPÉE (Modern Zippered Pocket) */}
              {config.pocket === 'cargo_combo' && (
                <g className="animate-fade-in">
                  {/* Zipper welt track on chest */}
                  <rect x="36" y="32" width="7" height="1.4" rx="0.3" fill="rgba(0,0,0,0.4)" />
                  <rect x="36.2" y="32.3" width="6.6" height="0.8" fill="url(#zipperTeeth)" />
                  {/* Metallic zipper slider pull */}
                  <polygon points="37.5,31.8 38.5,31.8 38.2,33.8 37.8,33.8" fill="#F3F4F6" stroke="#4B5563" strokeWidth="0.15" />
                  <circle cx="38" cy="34.2" r="0.35" fill="#D1D5DB" />
                </g>
              )}

              {/* 4. PANTS FIT: JOGGER (Ribbed Elastic Ankle Cuffs) */}
              {config.pantsFit === 'jogger_cuff' && (
                <g className="animate-fade-in">
                  {/* Left ankle cuff (viewer's left) */}
                  <rect
                    x="42.5"
                    y="88.2"
                    width="6.8"
                    height="2.2"
                    rx="0.5"
                    fill={config.pantsColor.hex}
                    stroke="rgba(0,0,0,0.3)"
                    strokeWidth="0.3"
                  />
                  <line x1="42.5" y1="89" x2="49.3" y2="89" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2" />
                  <line x1="42.5" y1="89.6" x2="49.3" y2="89.6" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2" />

                  {/* Right ankle cuff (viewer's right) */}
                  <rect
                    x="50.8"
                    y="88.2"
                    width="6.8"
                    height="2.2"
                    rx="0.5"
                    fill={config.pantsColor.hex}
                    stroke="rgba(0,0,0,0.3)"
                    strokeWidth="0.3"
                  />
                  <line x1="50.8" y1="89" x2="57.6" y2="89" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2" />
                  <line x1="50.8" y1="89.6" x2="57.6" y2="89.6" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2" />
                </g>
              )}
            </svg>
          )}

          {/* ==================================================================== */}
          {/* STEP 5: LIVE EMBROIDERY ACCORDING TO SELECTED POSITION               */}
          {/* ==================================================================== */}
          {config.embroidery.enabled &&
            (config.embroidery.line1 || config.embroidery.line2) &&
            viewName !== 'back' && (
              <div
                className={`absolute pointer-events-none z-20 ${
                  // Left chest (wearer's left = viewer's right)
                  config.embroidery.position === 'left_chest'
                    ? viewName === 'front'
                      ? 'left-[53.5%] top-[33%] text-left max-w-[32%]'
                      : 'left-[46%] top-[33%] text-left max-w-[28%]'
                    // Right chest (wearer's right = viewer's left)
                    : config.embroidery.position === 'right_chest'
                      ? viewName === 'front'
                        ? 'left-[34%] top-[33%] text-right max-w-[32%]'
                        : 'left-[50%] top-[33%] text-right max-w-[28%]'
                      // Left sleeve
                      : viewName === 'front'
                        ? 'left-[64%] top-[36%] text-center max-w-[22%]'
                        : 'left-[52%] top-[36%] text-center max-w-[24%]'
                }`}
                style={{
                  color: config.embroidery.colorHex,
                  textShadow:
                    '0 1px 2px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.6)',
                }}
              >
                {config.embroidery.line1 && (
                  <p
                    className={`text-[9px] sm:text-[11px] font-bold leading-tight truncate ${
                      config.embroidery.font === 'classic_serif'
                        ? 'font-serif'
                        : config.embroidery.font === 'script'
                          ? 'italic font-serif'
                          : 'tracking-wide font-sans'
                    }`}
                  >
                    {config.embroidery.line1}
                  </p>
                )}
                {config.embroidery.line2 && (
                  <p className="text-[7.5px] sm:text-[8.5px] opacity-90 mt-0.5 truncate leading-tight">
                    {config.embroidery.line2}
                  </p>
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

