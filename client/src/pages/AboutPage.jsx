import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/branding/Logo';
import InkoraCanvas from '../components/three/InkoraCanvas';
import { Feather, Compass, Layers, ShieldCheck, ArrowRight, Code } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="relative min-h-screen pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <InkoraCanvas variant="subtle" />

      <div className="relative z-10 space-y-16">
        {/* Header Hero */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <Logo size="large" showTagline={true} />
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            The INKORA Manifesto
          </h1>

          <p className="font-serif italic text-xl sm:text-2xl text-inkora-teal max-w-2xl mx-auto">
            "Ideas Leave a Mark."
          </p>
        </div>

        {/* Editorial Story */}
        <div className="p-8 sm:p-12 rounded-3xl editorial-glass border border-slate-200 dark:border-slate-800 space-y-8 text-slate-700 dark:text-slate-300 font-serif text-lg leading-relaxed">
          <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-inkora-teal first-letter:mr-3 first-letter:float-left first-letter:leading-none">
            We built INKORA as an intentional rebellion against the ephemeral noise of modern feeds.
            In a web inundated with shallow soundbites, clickbait algorithms, and synthetic content,
            we asked a simple question: <em>What happened to the sacred dignity of the written essay?</em>
          </p>

          <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white pt-4">
            1. The Craft of the Digital Folio
          </h3>
          <p className="font-sans text-base text-slate-600 dark:text-slate-400">
            Before screens existed, the setting of lead type onto dampened paper was an act of
            physical consequence. A word printed in ink could not simply be unwritten; it demanded
            forethought, precision, and respect for the reader's attention. INKORA brings this
            weight back to digital media through deliberate typography, generous whitespace, and
            focused layout architecture.
          </p>

          <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white pt-4">
            2. The Intersection of Geometry & Mind
          </h3>
          <p className="font-sans text-base text-slate-600 dark:text-slate-400">
            Our background is not a decorative gimmick; it is a real-time WebGL space operating
            on physical mathematics. The floating geometric solids represent the crystallization of
            raw thought into durable form. The gentle particle drift reflects the quiet contemplation
            required to absorb complex arguments.
          </p>

          <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white pt-4">
            3. Conventional, Human-Driven Engineering
          </h3>
          <p className="font-sans text-base text-slate-600 dark:text-slate-400">
            INKORA is proudly engineered as a conventional full-stack publishing platform. Every essay,
            every comment, and every recommendation is born from genuine human authorship and
            deterministic database queries. There are no chatbots, no synthetic ghostwriters, and
            no artificial intermediaries.
          </p>
        </div>

        {/* Technology Colophon */}
        <div className="p-8 rounded-3xl editorial-glass border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-inkora-teal">
            <Code className="w-5 h-5" />
            <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Platform Colophon & Specifications
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-slate-400 pt-2">
            <div>
              <strong className="text-slate-200 block mb-1">Frontend Architecture:</strong>
              React 18, Vite, Tailwind CSS, Three.js, React Three Fiber, React Router.
            </div>
            <div>
              <strong className="text-slate-200 block mb-1">Backend Infrastructure:</strong>
              Node.js, Express REST API, MongoDB with Mongoose, JWT Authentication, Helmet Security.
            </div>
            <div>
              <strong className="text-slate-200 block mb-1">Typography:</strong>
              Newsreader (Serif Body), Playfair Display (Serif Headlines), Plus Jakarta Sans (UI Controls).
            </div>
            <div>
              <strong className="text-slate-200 block mb-1">Color Palette:</strong>
              Midnight Navy (#0B1020), Deep Charcoal (#111827), Electric Teal (#56E0C5), Warm Amber (#FFB86B).
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4 pt-4">
          <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
            Ready to Leave Your Mark?
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 font-sans">
            Join visionary authors, engineers, and researchers on INKORA today.
          </p>
          <div className="pt-2">
            <Link
              to="/write"
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full bg-inkora-teal text-inkora-navy font-bold text-xs uppercase tracking-wider hover:bg-inkora-teal/90 transition-all shadow-xl shadow-inkora-teal/20"
            >
              <span>Begin Your First Essay</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
