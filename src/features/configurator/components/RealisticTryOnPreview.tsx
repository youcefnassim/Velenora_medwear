import React, { useState, useEffect, useRef } from 'react';
import type { CustomizationConfig } from '../../../types/configurator';

interface RealisticTryOnPreviewProps {
  config: CustomizationConfig;
  orientation: 'front' | 'back' | 'left' | 'right' | 'custom';
  isAutoRotating: boolean;
  onAngleChange?: (angle: number) => void;
  onPauseRotate?: () => void;
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

export const RealisticTryOnPreview: React.FC<RealisticTryOnPreviewProps> = ({
  config,
  orientation,
  isAutoRotating,
  onPauseRotate,
  zoomLevel = 1.0,
}) => {
  const fitKey = config.fit === 'women' ? 'women' : 'men';
  const modelImages = IMAGES[fitKey];

  // Current horizontal angle in degrees (0 = front, 90 = right, 180 = back, 270 = left)
  const [angle, setAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartAngle = useRef(0);

  // Sync orientation prop when clicked via toolbar
  useEffect(() => {
    if (orientation === 'front') setAngle(0);
    else if (orientation === 'right') setAngle(90);
    else if (orientation === 'back') setAngle(180);
    else if (orientation === 'left') setAngle(270);
  }, [orientation]);

  // Continuous 360° turntable animation
  useEffect(() => {
    if (!isAutoRotating || isDragging) return;

    let animId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      // 360 degrees every ~14 seconds (approx 25 deg/sec)
      setAngle((prev) => (prev + delta * 25) % 360);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isAutoRotating, isDragging]);

  // Determine active view image based on angle
  // 315° - 45°: front
  // 45° - 135°: right side
  // 135° - 225°: back
  // 225° - 315°: left side (mirrored right side)
  const normalizedAngle = ((angle % 360) + 360) % 360;

  let activeImage: string;
  let isMirrored = false;
  let relativeOffset = 0;
  let viewName = 'front';

  if (normalizedAngle >= 315 || normalizedAngle < 45) {
    activeImage = modelImages.front;
    relativeOffset = normalizedAngle >= 315 ? normalizedAngle - 360 : normalizedAngle;
    viewName = 'front';
  } else if (normalizedAngle >= 45 && normalizedAngle < 135) {
    activeImage = modelImages.side;
    relativeOffset = normalizedAngle - 90;
    viewName = 'side-right';
  } else if (normalizedAngle >= 135 && normalizedAngle < 225) {
    activeImage = modelImages.back;
    relativeOffset = normalizedAngle - 180;
    viewName = 'back';
  } else {
    activeImage = modelImages.side;
    isMirrored = true;
    relativeOffset = normalizedAngle - 270;
    viewName = 'side-left';
  }

  // Interactive mouse/touch drag handlers
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
    // 1 pixel = approx 0.8 degree of rotation
    const newAngle = ((dragStartAngle.current - deltaX * 0.75) % 360 + 360) % 360;
    setAngle(newAngle);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    }
  };

  // Subtle 3D yaw tilt according to relative offset (-45° to +45°)
  const subRotateY = Math.max(-18, Math.min(18, relativeOffset * 0.35));

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-white select-none cursor-grab active:cursor-grabbing touch-none flex flex-col justify-end items-center"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Subtle Soft Floor Contact Shadow */}
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
          {/* Main Photorealistic Doctor Image */}
          <img
            src={activeImage}
            alt={fitKey === 'women' ? 'Modèle femme Velenora Medwear' : 'Modèle homme Velenora Medwear'}
            className="h-full w-full object-contain object-bottom select-none transition-opacity duration-300 pointer-events-none"
            style={{
              transform: isMirrored ? 'scaleX(-1)' : 'none',
            }}
            draggable={false}
          />

          {/* Live 3D Doctor Personalized Embroidery (Only visible on front / slightly on side) */}
          {(viewName === 'front' || viewName === 'side-right') &&
            config.embroidery.enabled &&
            (config.embroidery.line1 || config.embroidery.line2) && (
              <div
                className={`absolute pointer-events-none text-left z-10 ${
                  viewName === 'front'
                    ? 'left-[53%] top-[34%] max-w-[34%]'
                    : 'left-[46%] top-[34%] max-w-[30%]'
                }`}
                style={{
                  color:
                    config.embroidery.colorHex === '#FFFFFF'
                      ? '#FFFFFF'
                      : config.embroidery.colorHex,
                  textShadow: '0 1px 3px rgba(0,0,0,0.7)',
                }}
              >
                {config.embroidery.line1 && (
                  <p
                    className={`text-[10px] sm:text-xs font-bold leading-tight truncate ${
                      config.embroidery.font === 'classic_serif'
                        ? 'font-serif'
                        : config.embroidery.font === 'script'
                          ? 'italic font-serif'
                          : 'tracking-wide'
                    }`}
                  >
                    {config.embroidery.line1}
                  </p>
                )}
                {config.embroidery.line2 && (
                  <p className="text-[8px] sm:text-[9px] opacity-90 mt-0.5 truncate">
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
