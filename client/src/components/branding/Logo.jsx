import React from 'react';
import { Link } from 'react-router-dom';

/**
 * INKORA Brand Identity Logo
 * Features the custom 3D isometric emblem requested by the user.
 */
export default function Logo({ size = 'default', showTagline = false, className = '' }) {
  const isLarge = size === 'large';
  const isSmall = size === 'small';

  const iconDimensions = isLarge ? 'w-12 h-12' : isSmall ? 'w-8 h-8' : 'w-10 h-10';
  const textSize = isLarge ? 'text-2xl' : isSmall ? 'text-base' : 'text-xl';

  return (
    <Link
      to="/home"
      className={`group flex items-center space-x-3 transition-opacity duration-200 select-none ${className}`}
      aria-label="INKORA — Ideas Leave a Mark"
    >
      {/* 3D Isometric Logo Emblem */}
      <div
        className={`relative ${iconDimensions} shrink-0 rounded-xl overflow-hidden border border-blue-500/30 bg-[#060B18] shadow-lg shadow-blue-500/25 transition-all duration-300 group-hover:scale-105 group-hover:border-blue-400/60 group-hover:shadow-blue-500/40`}
      >
        <img
          src="/logo.png"
          alt="INKORA Emblem"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        {/* Subtle glass reflection highlight */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Brand Wordmark & Editorial Tagline */}
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <span
            className={`font-sans font-extrabold tracking-[0.22em] ${textSize} text-slate-900 dark:text-white transition-all duration-300 group-hover:tracking-[0.26em] group-hover:text-blue-400 dark:group-hover:text-blue-300`}
          >
            INKORA
          </span>
          {/* Subtle Electric Blue Accent Punctuation */}
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 transition-all duration-300 group-hover:scale-125 shadow-sm shadow-blue-400" />
        </div>
        {showTagline && (
          <span className="text-[9px] tracking-[0.34em] uppercase font-semibold text-blue-400/90 dark:text-blue-300/80 transition-colors mt-0.5">
            Ideas Leave a Mark
          </span>
        )}
      </div>
    </Link>
  );
}

