import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useTheme } from '../../context/ThemeContext';
import InkParticles from './InkParticles';
import FloatingSculptures from './FloatingSculptures';
import GeometricRibbon from './GeometricRibbon';
import OrigamiMonoliths from './OrigamiMonoliths';
import TopographicStrata from './TopographicStrata';

export default function InkoraCanvas({ variant = 'hero', overrideTheme }) {
  const { ambient3d } = useTheme();
  const currentTheme = overrideTheme || ambient3d || 'cosmic-ink';

  const mousePos = useRef({ x: 0, y: 0 });
  const [hasWebGL, setHasWebGL] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);

    const handleMouseMove = (e) => {
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  if (variant === 'none' || prefersReducedMotion || !hasWebGL) {
    return (
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-radial-glow opacity-60"
        aria-hidden="true"
      />
    );
  }

  const isHero = variant === 'hero';

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
        onError={() => setHasWebGL(false)}
      >
        {/* Dynamic theme lighting */}
        {currentTheme === 'origami-monoliths' ? (
          <>
            <ambientLight intensity={0.7} />
            <directionalLight position={[10, 8, 6]} intensity={1.5} color="#FFB86B" />
            <pointLight position={[-8, -4, -4]} intensity={1.2} color="#F7F5EF" />
          </>
        ) : currentTheme === 'topographic-strata' ? (
          <>
            <ambientLight intensity={0.65} />
            <directionalLight position={[8, 12, 5]} intensity={1.4} color="#2DD4BF" />
            <pointLight position={[-10, 6, -3]} intensity={1.2} color="#56E0C5" />
          </>
        ) : (
          <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1.2} color="#56E0C5" />
            <pointLight position={[-10, -5, -5]} intensity={1.5} color="#FFB86B" />
          </>
        )}

        <Suspense fallback={null}>
          <InkParticles count={isHero ? 160 : 70} isSubtle={!isHero} />

          {isHero && (
            <>
              {currentTheme === 'origami-monoliths' && (
                <OrigamiMonoliths mousePos={mousePos} />
              )}
              {currentTheme === 'topographic-strata' && (
                <TopographicStrata mousePos={mousePos} />
              )}
              {currentTheme === 'cosmic-ink' && (
                <>
                  <FloatingSculptures mousePos={mousePos} />
                  <GeometricRibbon />
                </>
              )}
            </>
          )}
        </Suspense>
      </Canvas>

      {/* Atmospheric vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-inkora-navy via-transparent to-inkora-navy/40 dark:from-inkora-navy dark:via-transparent dark:to-inkora-navy/40 opacity-70 pointer-events-none" />
    </div>
  );
}
