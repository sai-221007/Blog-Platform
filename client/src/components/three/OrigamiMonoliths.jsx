import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export default function OrigamiMonoliths({ mousePos }) {
  const groupRef = useRef();
  const tetraRef1 = useRef();
  const tetraRef2 = useRef();
  const prismRef = useRef();
  const monolithRef = useRef();
  const foldedSheetRef = useRef();

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Sculptural, deliberate tumbling
    if (tetraRef1.current) {
      tetraRef1.current.rotation.x = time * 0.08;
      tetraRef1.current.rotation.y = time * 0.12;
    }
    if (tetraRef2.current) {
      tetraRef2.current.rotation.x = -time * 0.07;
      tetraRef2.current.rotation.z = time * 0.09;
    }
    if (prismRef.current) {
      prismRef.current.rotation.y = time * 0.06;
      prismRef.current.rotation.z = Math.sin(time * 0.2) * 0.2;
    }
    if (monolithRef.current) {
      monolithRef.current.rotation.x = Math.sin(time * 0.15) * 0.15;
      monolithRef.current.rotation.y = time * 0.05;
    }
    if (foldedSheetRef.current) {
      foldedSheetRef.current.rotation.z = time * 0.04;
      foldedSheetRef.current.rotation.y = Math.cos(time * 0.18) * 0.25;
    }

    // Parallax response
    if (groupRef.current && mousePos) {
      const targetX = mousePos.current.x * 0.4;
      const targetY = mousePos.current.y * 0.3;
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        targetX,
        0.035
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        targetY,
        0.035
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Primary Folded Monolith (Tall Chiseled Triangular Column) */}
      <Float speed={1.3} rotationIntensity={0.4} floatIntensity={1.0}>
        <mesh ref={monolithRef} position={[4.0, 0.4, -2.5]}>
          <cylinderGeometry args={[0.3, 1.2, 3.8, 3]} />
          <meshStandardMaterial
            color="#1E293B"
            emissive="#FFB86B"
            emissiveIntensity={0.25}
            roughness={0.35}
            metalness={0.45}
            wireframe={false}
          />
        </mesh>
      </Float>

      {/* Wireframe Outline of the Monolith for architectural precision */}
      <Float speed={1.3} rotationIntensity={0.4} floatIntensity={1.0}>
        <mesh position={[4.0, 0.4, -2.5]}>
          <cylinderGeometry args={[0.32, 1.22, 3.82, 3]} />
          <meshBasicMaterial color="#FFB86B" wireframe opacity={0.3} transparent />
        </mesh>
      </Float>

      {/* Faceted Tetrahedron (Origami Vertex) */}
      <Float speed={1.6} rotationIntensity={0.6} floatIntensity={1.2}>
        <mesh ref={tetraRef1} position={[-3.6, 1.5, -2.2]}>
          <tetrahedronGeometry args={[1.5, 0]} />
          <meshPhysicalMaterial
            color="#E2E8F0"
            roughness={0.4}
            metalness={0.1}
            transmission={0.65}
            thickness={1.2}
            transparent
            opacity={0.6}
          />
        </mesh>
      </Float>

      {/* Floating Folded Parchment Plane (Angled Diamond facet) */}
      <Float speed={1.1} rotationIntensity={0.3} floatIntensity={0.9}>
        <mesh ref={foldedSheetRef} position={[-2.8, -2.2, -3.2]}>
          <coneGeometry args={[1.6, 2.4, 4]} />
          <meshStandardMaterial
            color="#0F172A"
            emissive="#56E0C5"
            emissiveIntensity={0.3}
            roughness={0.5}
            metalness={0.2}
            wireframe={true}
          />
        </mesh>
      </Float>

      {/* Distant Warm Brass Prism */}
      <Float speed={0.9} rotationIntensity={0.3} floatIntensity={0.7}>
        <mesh ref={tetraRef2} position={[2.5, 2.6, -4.0]}>
          <octahedronGeometry args={[1.1, 0]} />
          <meshStandardMaterial
            color="#D97706"
            emissive="#FFB86B"
            emissiveIntensity={0.4}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
      </Float>

      {/* Subtle Floating Folio Bar */}
      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.8}>
        <mesh ref={prismRef} position={[-0.5, -2.8, -2.8]}>
          <boxGeometry args={[2.8, 0.08, 0.9]} />
          <meshPhysicalMaterial
            color="#56E0C5"
            roughness={0.2}
            metalness={0.1}
            transmission={0.7}
            transparent
            opacity={0.4}
          />
        </mesh>
      </Float>
    </group>
  );
}
