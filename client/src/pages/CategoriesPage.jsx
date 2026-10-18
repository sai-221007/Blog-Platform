import React from 'react';
import { Link } from 'react-router-dom';
import InkoraCanvas from '../components/three/InkoraCanvas';
import {
  Cpu,
  Layers,
  Code2,
  Atom,
  Feather,
  Sparkles,
  Briefcase,
  ArrowRight,
} from 'lucide-react';

export default function CategoriesPage() {
  const categoryPillars = [
    {
      name: 'Technology',
      icon: Cpu,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10 border-teal-500/20',
      description:
        'Optical computing, semiconductor frontiers, distributed networks, and the physical foundations of digital reality.',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Design',
      icon: Layers,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
      description:
        'Spatial balance, geometric architecture, typographic intention, and the visual dignification of function.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Programming',
      icon: Code2,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
      description:
        'Silent software, deterministic state machines, memory efficiency, and software longevity.',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Science',
      icon: Atom,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10 border-indigo-500/20',
      description:
        'Thermodynamics, quantum limits, materials research, and mathematical elegance in the physical cosmos.',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Creativity',
      icon: Feather,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/20',
      description:
        'The tactile history of ink, foundry typography, editorial craft, and intellectual expression.',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Lifestyle',
      icon: Sparkles,
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10 border-sky-500/20',
      description:
        'Algorithmic solitude, deliberate attention, uninterrupted focus, and personal cognitive sanctuaries.',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Business',
      icon: Briefcase,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
      description:
        'Boutique publishing economics, sustainable micro-enterprises, direct audience relationships, and independence.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div className="relative min-h-screen pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <InkoraCanvas variant="subtle" />

      <div className="relative z-10 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-inkora-teal">
            The INKORA Lexicon
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Editorial Columns
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-sans">
            Seven pillars of human curiosity, engineering excellence, and philosophical inquiry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoryPillars.map((pillar) => {
            const IconComponent = pillar.icon;
            return (
              <Link
                key={pillar.name}
                to={`/explore?category=${encodeURIComponent(pillar.name)}`}
                className="group rounded-3xl overflow-hidden editorial-glass editorial-glass-hover border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
                  <img
                    src={pillar.image}
                    alt={pillar.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-inkora-navy/80 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 p-2.5 rounded-xl editorial-glass">
                    <IconComponent className={`w-5 h-5 ${pillar.color}`} />
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white group-hover:text-inkora-teal transition-colors mb-2">
                      {pillar.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-inkora-teal">
                    <span>Browse {pillar.name} Essays</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
