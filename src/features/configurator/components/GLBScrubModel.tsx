import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { CustomizationConfig } from '../../../types/configurator';
import type { ModelManifest } from '../../../types/product';
import { EmbroideryDecal } from './EmbroideryDecal';

interface GLBScrubModelProps {
  manifest: ModelManifest;
  config: CustomizationConfig;
  onError: (error: Error) => void;
}

export const GLBScrubModel: React.FC<GLBScrubModelProps> = ({ manifest, config, onError }) => {
  const [scene, setScene] = useState<THREE.Group | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loader = new GLTFLoader();

    loader.load(
      manifest.modelUrl,
      (gltf) => {
        if (!isMounted) return;
        const cloned = gltf.scene.clone(true);
        setScene(cloned);
      },
      undefined,
      (error) => {
        if (!isMounted) return;
        console.warn(`GLB asset failed to load from ${manifest.modelUrl}, engaging fallback:`, error);
        onError(error instanceof Error ? error : new Error('Failed to load GLB model'));
      }
    );

    return () => {
      isMounted = false;
    };
  }, [manifest.modelUrl, onError]);

  // Apply colors and visibility updates to loaded GLB meshes
  useEffect(() => {
    if (!scene) return;

    const topColor = new THREE.Color(config.topColor.hex);
    const pantsColor = new THREE.Color(config.pantsColor.hex);
    const accentColor = new THREE.Color(config.accentColor.hex);

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const name = mesh.name.toLowerCase();

        // Check slots from manifest
        if (name.includes('top_main') || name.includes('torso') || name.includes('tunic')) {
          if (mesh.material) {
            (mesh.material as THREE.MeshStandardMaterial).color = topColor;
            (mesh.material as THREE.MeshStandardMaterial).roughness = 0.85;
          }
          mesh.visible = config.garmentType === 'top' || config.garmentType === 'set';
        } else if (name.includes('pants_main') || name.includes('legs') || name.includes('trousers')) {
          if (mesh.material) {
            (mesh.material as THREE.MeshStandardMaterial).color = pantsColor;
            (mesh.material as THREE.MeshStandardMaterial).roughness = 0.88;
          }
          mesh.visible = config.garmentType === 'pants' || config.garmentType === 'set';
        } else if (name.includes('trim') || name.includes('accent') || name.includes('piping')) {
          if (mesh.material) {
            (mesh.material as THREE.MeshStandardMaterial).color = accentColor;
          }
        }

        // Handle geometry variant toggles
        if (name.includes('sleeve_short')) {
          mesh.visible = config.sleeve === 'short';
        } else if (name.includes('sleeve_long')) {
          mesh.visible = config.sleeve === 'long';
        }
      }
    });
  }, [scene, config]);

  if (!scene) return null;

  return (
    <group position={[0, -0.9, 0]}>
      <primitive object={scene} />
      <EmbroideryDecal config={config.embroidery} sleeve={config.sleeve} />
    </group>
  );
};
