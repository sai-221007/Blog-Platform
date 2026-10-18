import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export default function FloatingSculptures({ mousePos }) {
  const groupRef = useRef();
  const sphereRef = useRef();
  const icosaRef = useRef();
  const ringRef = useRef();
  const octaRef = useRef();

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Subtle continuous rotation
    if (sphereRef.current) {
      sphereRef.current.rotation.x = time * 0.1;
      sphereRef.current.rotation.y = time * 0.12;
    }
    if (icosaRef.current) {
      icosaRef.current.rotation.x = -time * 0.08;
      icosaRef.current.rotation.y = time * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.09;
      ringRef.current.rotation.x = Math.sin(time * 0.2) * 0.3;
    }
    if (octaRef.current) {
      octaRef.current.rotation.y = time * 0.07;
      octaRef.current.rotation.z = time * 0.05;
    }

    // Gentle mouse parallax damping
    if (groupRef.current && mousePos) {
      const targetX = mousePos.current.x * 0.45;
      const targetY = mousePos.current.y * 0.35;
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        targetX,
        0.04
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        targetY,
        0.04
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Translucent Glass Sphere */}
      <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1.2}>
        <mesh ref={sphereRef} position={[-3.8, 1.2, -2]}>
          <sphereGeometry args={[1.3, 32, 32]} />
          <meshPhysicalMaterial
            color="#56E0C5"
            roughness={0.15}
            metalness={0.1}
            transmission={0.88}
            thickness={1.5}
            ior={1.4}
            transparent
            opacity={0.45}
            wireframe={false}
          />
        </mesh>
      </Float>

      {/* Chiseled Icosahedron (Geometric Mark) */}
      <Float speed={1.8} rotationIntensity={0.8} floatIntensity={1.4}>
        <mesh ref={icosaRef} position={[4.2, -0.6, -1.8]}>
          <icosahedronGeometry args={[1.4, 0]} />
          <meshStandardMaterial
            color="#0B1020"
            emissive="#56E0C5"
            emissiveIntensity={0.35}
            roughness={0.2}
            metalness={0.8}
            wireframe
          />
        </mesh>
      </Float>

      {/* Floating Orbital Torus (Ideas Continuity) */}
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh ref={ringRef} position={[3.2, 2.2, -4]}>
          <torusGeometry args={[2.2, 0.05, 16, 100]} />
          <meshStandardMaterial
            color="#FFB86B"
            emissive="#FFB86B"
            emissiveIntensity={0.5}
            roughness={0.3}
          />
        </mesh>
      </Float>

      {/* Distant Faceted Octahedron */}
      <Float speed={1.0} rotationIntensity={0.3} floatIntensity={0.7}>
        <mesh ref={octaRef} position={[-2.5, -2.4, -3.5]}>
          <octahedronGeometry args={[1.1, 0]} />
          <meshPhysicalMaterial
            color="#FFB86B"
            transmission={0.75}
            roughness={0.25}
            thickness={1.2}
            transparent
            opacity={0.35}
          />
        </mesh>
      </Float>
    </group>
  );
}
