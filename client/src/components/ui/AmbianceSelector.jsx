import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Layers, Sparkles, Check, ChevronDown } from 'lucide-react';

export default function AmbianceSelector({ compact = false }) {
  const { ambient3d, setAmbient3d, ambientThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const activeTheme = ambientThemes.find((t) => t.id === ambient3d) || ambientThemes[0];

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center space-x-2 text-xs font-medium rounded-full editorial-glass border border-slate-300 dark:border-slate-800 hover:border-inkora-teal/50 transition-all duration-200 ${
          compact ? 'px-2.5 py-1.5' : 'px-3.5 py-2'
        }`}
        title="Change 3D Animated Background Theme"
        aria-label="Change 3D Animated Background Theme"
      >
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: activeTheme.accentColor }}
        />
        <span className="text-slate-700 dark:text-slate-300 hidden sm:inline truncate max-w-[120px]">
          {activeTheme.name}
        </span>
        <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 mt-2 w-72 rounded-2xl editorial-glass shadow-2xl p-2 z-50 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 mb-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                3D Background Ambiance
              </p>
              <p className="text-[11px] text-slate-500">
                Crafted mathematical WebGL scenes
              </p>
            </div>

            <div className="space-y-1">
              {ambientThemes.map((thm) => {
                const isSelected = thm.id === ambient3d;
                return (
                  <button
                    key={thm.id}
                    onClick={() => {
                      setAmbient3d(thm.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-start space-x-3 p-2.5 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-inkora-teal/15 border border-inkora-teal/30'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full mt-1 shrink-0 ring-2 ring-white/10"
                      style={{ backgroundColor: thm.accentColor }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-semibold ${
                            isSelected
                              ? 'text-inkora-teal'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {thm.name}
                        </span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-inkora-teal shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                        {thm.tagline}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
