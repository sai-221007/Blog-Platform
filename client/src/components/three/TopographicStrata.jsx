import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export default function TopographicStrata({ mousePos }) {
  const meshRef = useRef();
  const groupRef = useRef();
  const ringRef = useRef();

  // Create grid geometry
  const [geometry, initialPositions] = useMemo(() => {
    const geo = new THREE.PlaneGeometry(16, 12, 42, 32);
    const pos = geo.attributes.position;
    const initial = new Float32Array(pos.array.length);
    initial.set(pos.array);
    return [geo, initial];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (meshRef.current) {
      const pos = meshRef.current.geometry.attributes.position;
      const array = pos.array;

      for (let i = 0; i < array.length; i += 3) {
        const x = initialPositions[i];
        const y = initialPositions[i + 1];

        // Undulating contour waves
        const wave1 = Math.sin(x * 0.55 + time * 0.6) * Math.cos(y * 0.45 + time * 0.5) * 0.65;
        const wave2 = Math.sin((x + y) * 0.35 + time * 0.8) * 0.3;
        array[i + 2] = wave1 + wave2;
      }
      pos.needsUpdate = true;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.05;
      ringRef.current.rotation.x = Math.sin(time * 0.2) * 0.2 + 0.3;
    }

    // Parallax damping
    if (groupRef.current && mousePos) {
      const targetX = mousePos.current.x * 0.5;
      const targetY = mousePos.current.y * 0.35;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetX * 0.15,
        0.04
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -0.35 - targetY * 0.15,
        0.04
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.0, -3.2]} rotation={[-0.35, 0, 0]}>
      {/* Topographic Contour Wireframe Surface */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          color="#0B1020"
          emissive="#2DD4BF"
          emissiveIntensity={0.45}
          roughness={0.2}
          metalness={0.8}
          wireframe={true}
        />
      </mesh>

      {/* Floating Topographic Contour Ring */}
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh ref={ringRef} position={[3.5, 2.5, 1.0]}>
          <torusGeometry args={[2.0, 0.03, 16, 80]} />
          <meshBasicMaterial color="#56E0C5" opacity={0.6} transparent />
        </mesh>
      </Float>

      {/* Floating Concentric Marker */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.0}>
        <mesh position={[-3.2, 1.8, 0.5]}>
          <ringGeometry args={[0.8, 0.85, 32]} />
          <meshBasicMaterial color="#FFB86B" opacity={0.5} transparent side={THREE.DoubleSide} />
        </mesh>
      </Float>
    </group>
  );
}
