import React from 'react';
import { Link } from 'react-router-dom';
import InkoraCanvas from '../components/three/InkoraCanvas';
import Logo from '../components/branding/Logo';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="relative min-h-[75vh] flex items-center justify-center px-4 py-16 text-center">
      <InkoraCanvas variant="subtle" />

      <div className="relative z-10 max-w-md p-8 sm:p-12 rounded-3xl editorial-glass border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex justify-center">
          <Logo size="default" />
        </div>

        <p className="font-serif text-6xl font-extrabold text-inkora-teal">404</p>

        <h1 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
          The Folio Does Not Exist
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 font-sans leading-relaxed">
          The page or manuscript you requested could not be located in our digital archives.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-inkora-teal text-inkora-navy font-bold text-xs hover:bg-inkora-teal/90 transition-colors flex items-center justify-center space-x-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/explore"
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-slate-700 text-slate-300 font-medium text-xs hover:text-white transition-colors flex items-center justify-center space-x-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-inkora-teal" />
            <span>Explore Stories</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
