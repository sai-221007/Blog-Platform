import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function GeometricRibbon() {
  const lineRef = useRef();

  const points = useMemo(() => {
    const pts = [];
    const count = 60;
    for (let i = 0; i <= count; i++) {
      const t = (i / count) * Math.PI * 4;
      const x = Math.sin(t) * 5 + (i / count - 0.5) * 8;
      const y = Math.cos(t * 0.7) * 2.5;
      const z = Math.sin(t * 0.5) * 3 - 3;
      pts.push(new THREE.Vector3(x, y, z));
    }
    return pts;
  }, []);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 100, 0.02, 8, false), [curve]);

  useFrame((state) => {
    if (!lineRef.current) return;
    const time = state.clock.getElapsedTime();
    lineRef.current.rotation.y = time * 0.03;
    lineRef.current.rotation.z = Math.sin(time * 0.1) * 0.08;
  });

  return (
    <mesh ref={lineRef} geometry={geometry}>
      <meshBasicMaterial color="#56E0C5" transparent opacity={0.3} wireframe={false} />
    </mesh>
  );
}
