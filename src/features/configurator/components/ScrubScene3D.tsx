import React, { useRef, useState } from 'react';
import type { CustomizationConfig } from '../../../types/configurator';
import type { ModelManifest } from '../../../types/product';
import { RealisticTryOnPreview } from './RealisticTryOnPreview';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';

interface ScrubScene3DProps {
  config: CustomizationConfig;
  manifest?: ModelManifest;
}

export const ScrubScene3D: React.FC<ScrubScene3DProps> = ({ config }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeOrientation, setActiveOrientation] = useState<'front' | 'back' | 'left' | 'right' | 'custom'>('front');
  const [zoomLevel, setZoomLevel] = useState(1.0);

  // Quick angle view change
  const setOrientation = (dir: 'front' | 'back' | 'left' | 'right') => {
    setActiveOrientation(dir);
  };

  const handleReset = () => {
    setActiveOrientation('front');
    setZoomLevel(1.0);
  };

  const handleZoom = (delta: number) => {
    // delta < 0 is zoom in, delta > 0 is zoom out
    setZoomLevel((prev) => Math.max(0.85, Math.min(1.25, prev + (delta < 0 ? 0.08 : -0.08))));
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400px] sm:h-[480px] md:h-[540px] lg:h-full min-h-[360px] lg:min-h-0 bg-white rounded-2xl overflow-hidden border border-[#E1E5E8] flex flex-col justify-between select-none shadow-sm"
    >
      {/* Photorealistic 360 Turntable Viewport (Full White Studio) */}
      <RealisticTryOnPreview
        config={config}
        orientation={activeOrientation}
        isAutoRotating={true}
        zoomLevel={zoomLevel}
      />


      {/* Top Right Quick Reset & Zoom Toolbar */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-[#E1E5E8]">
        <button
          type="button"
          onClick={handleReset}
          className="p-1.5 sm:p-2 rounded-lg text-[#10263B] hover:bg-[#F1F2F3] transition"
          title="Réinitialiser la vue (Face)"
          aria-label="Réinitialiser la vue"
        >
          <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#142C46]" />
        </button>
        <button
          type="button"
          onClick={() => handleZoom(-0.35)}
          className="p-1.5 sm:p-2 rounded-lg text-[#10263B] hover:bg-[#F1F2F3] transition"
          title="Zoom avant"
          aria-label="Zoom avant"
        >
          <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#142C46]" />
        </button>
        <button
          type="button"
          onClick={() => handleZoom(0.35)}
          className="p-1.5 sm:p-2 rounded-lg text-[#10263B] hover:bg-[#F1F2F3] transition"
          title="Zoom arrière"
          aria-label="Zoom arrière"
        >
          <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#142C46]" />
        </button>
        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-1.5 sm:p-2 rounded-lg text-[#10263B] hover:bg-[#F1F2F3] transition hidden sm:inline-flex"
          title="Plein écran"
          aria-label="Plein écran"
        >
          <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#142C46]" />
        </button>
      </div>

      {/* Desktop Vertical Angle Toolbar */}
      <div className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 flex-col bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-[#E1E5E8] p-1.5 space-y-1 z-20">
        <button
          type="button"
          onClick={() => setOrientation('front')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeOrientation === 'front'
              ? 'bg-[#142C46] text-white shadow-sm'
              : 'text-[#10263B] hover:bg-[#F1F2F3]'
          }`}
          title="Vue Face"
        >
          Face
        </button>

        <button
          type="button"
          onClick={() => setOrientation('back')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeOrientation === 'back'
              ? 'bg-[#142C46] text-white shadow-sm'
              : 'text-[#10263B] hover:bg-[#F1F2F3]'
          }`}
          title="Vue Dos"
        >
          Dos
        </button>

        <button
          type="button"
          onClick={() => setOrientation('left')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeOrientation === 'left'
              ? 'bg-[#142C46] text-white shadow-sm'
              : 'text-[#10263B] hover:bg-[#F1F2F3]'
          }`}
          title="Profil Gauche"
        >
          Gauche
        </button>

        <button
          type="button"
          onClick={() => setOrientation('right')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeOrientation === 'right'
              ? 'bg-[#142C46] text-white shadow-sm'
              : 'text-[#10263B] hover:bg-[#F1F2F3]'
          }`}
          title="Profil Droit"
        >
          Droite
        </button>
      </div>

      {/* Bottom Controls Bar: Angle Quick Pills & Fullscreen */}
      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-20 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md rounded-xl border border-[#E1E5E8] p-1 shadow-md">
          <button
            type="button"
            onClick={() => setOrientation('front')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeOrientation === 'front'
                ? 'bg-[#142C46] text-white'
                : 'text-[#10263B] hover:bg-[#F1F2F3]'
            }`}
          >
            Face
          </button>
          <button
            type="button"
            onClick={() => setOrientation('back')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeOrientation === 'back'
                ? 'bg-[#142C46] text-white'
                : 'text-[#10263B] hover:bg-[#F1F2F3]'
            }`}
          >
            Dos
          </button>
          <button
            type="button"
            onClick={() => setOrientation('left')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeOrientation === 'left' || activeOrientation === 'right'
                ? 'bg-[#142C46] text-white'
                : 'text-[#10263B] hover:bg-[#F1F2F3]'
            }`}
          >
            Profil
          </button>
        </div>

        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-2 sm:hidden bg-white/95 backdrop-blur-md rounded-xl border border-[#E1E5E8] text-[#10263B] hover:bg-[#F1F2F3] shadow-md transition"
          title="Plein écran"
          aria-label="Plein écran"
        >
          <Maximize2 className="w-4 h-4 text-[#142C46]" />
        </button>
      </div>
    </div>
  );
};
