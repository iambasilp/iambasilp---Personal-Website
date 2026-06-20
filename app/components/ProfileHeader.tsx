'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CUES = [
  {
    text: "You do not rise to the level of your goals. You fall to the level of your systems.",
    source: "James Clear, Atomic Habits"
  },
  {
    text: "Every action you take is a vote for the type of person you wish to become.",
    source: "James Clear, Atomic Habits"
  },
  {
    text: "Make it obvious, make it attractive, make it easy, make it satisfying.",
    source: "James Clear, Atomic Habits"
  },
  {
    text: "Behavior (B) happens when Motivation (M), Ability (A), and a Prompt (P) converge at the same moment (B = MAP).",
    source: "BJ Fogg, Persuasive Technology"
  },
  {
    text: "To build a habit-forming product: associate the user's internal itch with your solution's external trigger.",
    source: "Nir Eyal, Hooked"
  },
  {
    text: "First principles thinking: boil a problem down to its fundamental truths and reason up from there.",
    source: "Systems & Logic"
  },
  {
    text: "Invert, always invert. Instead of looking for success, find out how to fail and avoid those behaviors.",
    source: "Carl Jacobi, Inversion"
  },
  {
    text: "Amateurs react. Professionals prepare. System builders automate.",
    source: "Systems Thinking"
  }
];

export default function ProfileHeader() {
  const [currentCueIndex, setCurrentCueIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleImageClick = () => {
    if (currentCueIndex === null) {
      setCurrentCueIndex(Math.floor(Math.random() * CUES.length));
    } else {
      let nextIndex = Math.floor(Math.random() * CUES.length);
      while (nextIndex === currentCueIndex && CUES.length > 1) {
        nextIndex = Math.floor(Math.random() * CUES.length);
      }
      setCurrentCueIndex(nextIndex);
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-8 focus-mode-hidden">
      <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-zinc-50 tracking-tight font-serif !m-0">
            Basil Pulikuth
          </h1>
          <p className="text-gray-600 dark:text-zinc-400 font-sans leading-snug !m-0">
            Product-focused builder, problem solver, and system explorer.
          </p>
        </div>
        
        <div className="flex-shrink-0">
          <button
            onClick={handleImageClick}
            className="relative group block overflow-hidden rounded-2xl border-2 border-[#E8E6E0] dark:border-zinc-800 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 dark:focus:ring-offset-zinc-900 transition-all duration-300 hover:scale-[1.04] hover:shadow-lg focus-visible:scale-[1.04] cursor-pointer"
            aria-label="Get a random mental model or habit cue"
            title="Click for a mental model / habit cue"
          >
            {/* Pulsing trigger ring for visual affordance (cue/prompt) */}
            <span className="absolute inset-0 border-2 border-zinc-500/20 rounded-2xl animate-ping group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
            
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
              {/* Light Mode Image (Visible in light mode, hidden in dark mode) */}
              <div className="absolute inset-0 block dark:hidden">
                <Image
                  src="/images/iambasilp-light.png"
                  alt="Basil Pulikuth - Product Builder and System Explorer"
                  fill
                  sizes="(max-width: 640px) 96px, 112px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              </div>
              {/* Dark Mode Image (Hidden in light mode, visible in dark mode) */}
              <div className="absolute inset-0 hidden dark:block">
                <Image
                  src="/images/iambasilp-dark.png"
                  alt="Basil Pulikuth - Product Builder and System Explorer"
                  fill
                  sizes="(max-width: 640px) 96px, 112px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Habit card / Thought bubble with spring entrance */}
      <AnimatePresence mode="wait">
        {isMounted && currentCueIndex !== null && (
          <motion.div
            key={currentCueIndex}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="relative overflow-hidden border border-[#E8E6E0] dark:border-zinc-800 bg-[#FAF9F6]/80 dark:bg-[#20201F]/80 backdrop-blur-sm rounded-xl p-4 text-xs sm:text-sm text-gray-700 dark:text-zinc-300 font-serif italic shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
          >
            <div className="flex-1 space-y-1">
              <p className="leading-relaxed text-gray-800 dark:text-zinc-200">
                "{CUES[currentCueIndex].text}"
              </p>
              <p className="text-[10px] sm:text-xs font-sans tracking-wide uppercase text-gray-400 dark:text-zinc-500 not-italic">
                — {CUES[currentCueIndex].source}
              </p>
            </div>
            
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={handleImageClick}
                className="text-[10px] sm:text-xs font-sans font-medium px-2 py-1 bg-white dark:bg-zinc-800 hover:bg-[#F7F5F0] dark:hover:bg-zinc-700 text-gray-600 dark:text-zinc-300 rounded border border-[#E8E6E0] dark:border-zinc-700 transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-400 cursor-pointer"
              >
                Next Cue
              </button>
              <button
                onClick={() => setCurrentCueIndex(null)}
                className="text-[10px] sm:text-xs font-sans font-medium px-2 py-1 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 transition-colors focus:outline-none cursor-pointer"
                aria-label="Dismiss thought card"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
