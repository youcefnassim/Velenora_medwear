import React, { useMemo } from 'react';
import * as THREE from 'three';
import type { EmbroideryConfig } from '../../../types/configurator';

interface EmbroideryDecalProps {
  config: EmbroideryConfig;
  sleeve: 'short' | 'long';
}

export const EmbroideryDecal: React.FC<EmbroideryDecalProps> = ({ config, sleeve }) => {
  if (!config.enabled || (!config.line1.trim() && !config.line2.trim())) {
    return null;
  }

  // Create high-res dynamic canvas texture for text
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Font family mapping
    let fontFace = 'Inter, sans-serif';
    if (config.font === 'classic_serif') fontFace = '"Playfair Display", Georgia, serif';
    if (config.font === 'script') fontFace = '"Playfair Display", cursive, serif';

    ctx.fillStyle = config.colorHex || '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    // Line 1: Name
    if (config.line1.trim()) {
      ctx.font = `600 44px ${fontFace}`;
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 4;
      ctx.fillText(config.line1.trim(), 40, 180);
    }

    // Line 2: Specialty / Title
    if (config.line2.trim()) {
      ctx.font = `italic 400 32px ${fontFace}`;
      ctx.shadowColor = 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = 3;
      ctx.fillText(config.line2.trim(), 40, 240);
    }

    // Add subtle embroidery thread texture effect
    ctx.strokeStyle = config.colorHex || '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(40, 280);
    ctx.lineTo(240, 280);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [config.line1, config.line2, config.font, config.colorHex]);

  // Determine 3D coordinates based on selected position
  const { position, rotation, scale } = useMemo(() => {
    if (config.position === 'left_chest') {
      return {
        position: [0.18, 1.70, 0.375] as [number, number, number],
        rotation: [-0.04, 0.08, 0] as [number, number, number],
        scale: [0.32, 0.16, 1] as [number, number, number],
      };
    }
    if (config.position === 'right_chest') {
      return {
        position: [-0.18, 1.70, 0.375] as [number, number, number],
        rotation: [-0.04, -0.08, 0] as [number, number, number],
        scale: [0.32, 0.16, 1] as [number, number, number],
      };
    }
    // left_sleeve
    return {
      position: [0.49, 1.64, 0.04] as [number, number, number],
      rotation: [0, Math.PI / 2, -0.2] as [number, number, number],
      scale: [0.26, 0.13, 1] as [number, number, number],
    };
  }, [config.position, sleeve]);

  if (!texture) return null;

  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.96}
        depthWrite={false}
        polygonOffset
        polygonOffsetFactor={-4}
      />
    </mesh>
  );
};
