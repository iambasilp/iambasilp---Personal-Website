'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Option {
  id: string;
  name: string;
  description: string;
  icon?: string;
  color?: string; // e.g. 'emerald', 'amber', 'rose', 'indigo'
}

interface ChoiceSelectorProps {
  id: string;
  question?: string;
  options: Option[];
  reflection: React.ReactNode;
}

export default function ChoiceSelector({ id, question, options, reflection }: ChoiceSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const getColorClasses = (color?: string, isSelected?: boolean) => {
    switch (color) {
      case 'emerald':
        return isSelected
          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-350 shadow-sm'
          : 'hover:border-emerald-400 border-zinc-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300';
      case 'rose':
        return isSelected
          ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-350 shadow-sm'
          : 'hover:border-rose-400 border-zinc-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300';
      case 'amber':
        return isSelected
          ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-350 shadow-sm'
          : 'hover:border-amber-400 border-zinc-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300';
      case 'blue':
        return isSelected
          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-350 shadow-sm'
          : 'hover:border-blue-400 border-zinc-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300';
      default:
        return isSelected
          ? 'border-zinc-500 bg-zinc-50 dark:bg-zinc-800/50 text-gray-900 dark:text-zinc-150 shadow-sm'
          : 'hover:border-zinc-400 border-zinc-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300';
    }
  };

  return (
    <div className="my-8 p-6 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-xl border border-zinc-100 dark:border-zinc-800/80">
      {question && (
        <h4 className="font-semibold text-lg text-gray-800 dark:text-zinc-200 mb-4 font-serif">
          {question}
        </h4>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setSelectedId(opt.id)}
              className={`flex items-start p-4 rounded-lg border text-left transition-all duration-200 cursor-pointer outline-none relative group ${getColorClasses(
                opt.color,
                isSelected
              )}`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {opt.icon && <span className="text-xl">{opt.icon}</span>}
                  <span className="font-semibold tracking-tight text-base">{opt.name}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1 leading-snug">
                  {opt.description}
                </p>
              </div>
              
              {/* Checkmark or Selection dot indicator */}
              <div className="ml-3 mt-1 flex-shrink-0">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-current bg-current text-white dark:text-zinc-950'
                      : 'border-zinc-300 dark:border-zinc-700 group-hover:border-zinc-400'
                  }`}
                >
                  {isSelected && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-3.5 h-3.5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <motion.div
        initial={false}
        animate={{
          height: selectedId ? 'auto' : 0,
          opacity: selectedId ? 1 : 0,
          marginTop: selectedId ? 20 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        {selectedId && (
          <div className="pt-4 border-t border-zinc-200/60 dark:border-zinc-800/80 text-sm text-gray-700 dark:text-zinc-300 leading-relaxed font-sans">
            {reflection}
          </div>
        )}
      </motion.div>
    </div>
  );
}
