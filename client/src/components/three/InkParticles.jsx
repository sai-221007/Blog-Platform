import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function InkParticles({ count = 180, isSubtle = false }) {
  const meshRef = useRef();
  const particleCount = isSubtle ? Math.floor(count / 2) : count;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);

    const tealColor = new THREE.Color('#56E0C5');
    const amberColor = new THREE.Color('#FFB86B');
    const navyColor = new THREE.Color('#2DD4BF');

    for (let i = 0; i < particleCount; i++) {
      // Spread across viewport space
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;

      // Color variation between teal and amber
      const choice = Math.random();
      const chosenColor = choice > 0.65 ? amberColor : choice > 0.2 ? tealColor : navyColor;

      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
    }

    return [pos, col];
  }, [particleCount]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.02;
    meshRef.current.rotation.x += delta * 0.01;

    // Gentle vertical oscillation
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y = Math.sin(time * 0.25) * 0.2;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        vertexColors
        transparent
        opacity={isSubtle ? 0.35 : 0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
