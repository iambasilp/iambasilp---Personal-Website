'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EraData {
  year: string;
  title: string;
  realLife: number;
  realLifeHours: number;
  internetLife: number;
  internetLifeHours: number;
  integration: string;
  impact: string;
  status: string;
  metrics: {
    label: string;
    value: number;
    color: string;
  }[];
}

const timelineData: EraData[] = [
  {
    year: 'Before 1980',
    title: 'The Pre-Internet Era',
    realLife: 100,
    realLifeHours: 24,
    internetLife: 0,
    internetLifeHours: 0,
    integration: '0% of knowledge from the internet is applied to real life.',
    impact: 'No time from real life is reduced due to internet use.',
    status: 'Highly Productive – All time is dedicated to real-life activities with no distractions.',
    metrics: [
      { label: 'Distraction', value: 0, color: 'bg-zinc-300 dark:bg-zinc-700' },
      { label: 'Attention', value: 100, color: 'bg-emerald-500' },
      { label: 'Focus', value: 100, color: 'bg-emerald-500' },
      { label: 'Energy', value: 100, color: 'bg-emerald-500' },
      { label: 'Courage', value: 95, color: 'bg-emerald-500' },
      { label: 'Knowledge', value: 70, color: 'bg-blue-500' },
      { label: 'Skill', value: 80, color: 'bg-blue-500' },
      { label: 'Habit', value: 90, color: 'bg-emerald-500' },
    ],
  },
  {
    year: '1995',
    title: 'The Internet Awakens',
    realLife: 96,
    realLifeHours: 23,
    internetLife: 4,
    internetLifeHours: 1,
    integration: '4% of knowledge from the internet is applied to 96% of real life.',
    impact: '4% of real-life time is reduced due to internet use.',
    status: 'Improved – Internet introduces knowledge enhancement while maintaining real-life focus.',
    metrics: [
      { label: 'Distraction', value: 5, color: 'bg-amber-400' },
      { label: 'Attention', value: 90, color: 'bg-emerald-500' },
      { label: 'Focus', value: 85, color: 'bg-emerald-500' },
      { label: 'Energy', value: 88, color: 'bg-emerald-500' },
      { label: 'Courage', value: 92, color: 'bg-emerald-500' },
      { label: 'Knowledge', value: 98, color: 'bg-blue-500' },
      { label: 'Skill', value: 90, color: 'bg-blue-500' },
      { label: 'Habit', value: 87, color: 'bg-emerald-500' },
    ],
  },
  {
    year: '2010',
    title: 'The Age of Digital Balance',
    realLife: 84,
    realLifeHours: 20,
    internetLife: 16,
    internetLifeHours: 4,
    integration: '16% of knowledge from the internet is applied to 76% of real life and 10% of internet life.',
    impact: '16% of real-life time is reduced due to internet usage.',
    status: 'Balanced – Purposeful integration of internet knowledge into real-life activities.',
    metrics: [
      { label: 'Distraction', value: 10, color: 'bg-amber-400' },
      { label: 'Attention', value: 88, color: 'bg-emerald-500' },
      { label: 'Focus', value: 80, color: 'bg-emerald-500' },
      { label: 'Energy', value: 85, color: 'bg-emerald-500' },
      { label: 'Courage', value: 90, color: 'bg-emerald-500' },
      { label: 'Knowledge', value: 96, color: 'bg-blue-500' },
      { label: 'Skill', value: 88, color: 'bg-blue-500' },
      { label: 'Habit', value: 83, color: 'bg-emerald-500' },
    ],
  },
  {
    year: '2023',
    title: 'The Digital Overload',
    realLife: 4,
    realLifeHours: 1,
    internetLife: 96,
    internetLifeHours: 23,
    integration: '100% of knowledge from the internet is applied to 4% of real life and 96% of internet life.',
    impact: '96% of real-life time is lost to internet usage.',
    status: 'Unbalanced – The overwhelming focus on internet life has severely impacted real-life activities.',
    metrics: [
      { label: 'Distraction', value: 90, color: 'bg-rose-500' },
      { label: 'Attention', value: 50, color: 'bg-rose-400' },
      { label: 'Focus', value: 40, color: 'bg-rose-400' },
      { label: 'Energy', value: 30, color: 'bg-rose-450' },
      { label: 'Courage', value: 20, color: 'bg-rose-500' },
      { label: 'Knowledge', value: 100, color: 'bg-blue-500' },
      { label: 'Skill', value: 40, color: 'bg-rose-400' },
      { label: 'Habit', value: 10, color: 'bg-rose-500' },
    ],
  },
];

export default function DigitalTimeline() {
  const [activeIdx, setActiveIdx] = useState(3); // Default to 2023 for thought-provoking impact
  const era = timelineData[activeIdx];

  return (
    <div className="my-10 p-6 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-xl border border-zinc-100 dark:border-zinc-800/80 font-sans">
      <h3 className="text-xl font-bold font-serif text-gray-800 dark:text-zinc-100 mb-6 text-center">
        The Digital Timeline: How We Got Here
      </h3>

      {/* Stepper Header */}
      <div className="relative flex justify-between items-center mb-8 px-2 max-w-lg mx-auto">
        <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-zinc-200 dark:bg-zinc-800 -translate-y-1/2 z-0" />
        {timelineData.map((data, idx) => {
          const isActive = idx === activeIdx;
          return (
            <button
              key={data.year}
              onClick={() => setActiveIdx(idx)}
              className={`relative z-10 flex flex-col items-center cursor-pointer focus:outline-none`}
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.25 : 1,
                  backgroundColor: isActive ? 'var(--color-blue-500)' : 'var(--color-zinc-300)',
                }}
                className={`w-6 h-6 rounded-full border-4 border-white dark:border-zinc-950 flex items-center justify-center`}
                style={{
                  backgroundColor: isActive ? '#3b82f6' : '#d1d5db',
                }}
              />
              <span
                className={`text-xs font-semibold mt-2 transition-all duration-200 ${
                  isActive ? 'text-blue-500 font-bold scale-105' : 'text-gray-500 dark:text-zinc-400'
                }`}
              >
                {data.year.replace('Before ', '')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Display Info */}
      <div className="space-y-6">
        <div>
          <div className="flex flex-wrap items-baseline gap-2">
            <h4 className="text-lg font-bold text-gray-900 dark:text-zinc-100 font-serif">
              {era.year}: {era.title}
            </h4>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/55 dark:border-zinc-700/50">
              {era.status.split(' – ')[0]}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
            {era.status.includes(' – ') ? era.status.split(' – ')[1] : era.status}
          </p>
        </div>

        {/* Life-Balance Visualizer Bars */}
        <div className="space-y-3 bg-white dark:bg-zinc-950/40 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800/60 shadow-xs">
          <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-zinc-400">
            <span>24h Time Allocation</span>
            <span>Real vs Internet</span>
          </div>

          <div className="h-6 w-full rounded-full overflow-hidden flex bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80">
            {/* Real Life Bar */}
            {era.realLife > 0 && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${era.realLife}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="bg-emerald-500 dark:bg-emerald-600 h-full flex items-center justify-center text-[10px] font-bold text-white overflow-hidden whitespace-nowrap"
              >
                {era.realLife >= 15 ? `Real Life: ${era.realLifeHours}h (${era.realLife}%)` : `${era.realLifeHours}h`}
              </motion.div>
            )}

            {/* Internet Life Bar */}
            {era.internetLife > 0 && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${era.internetLife}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="bg-blue-500 dark:bg-blue-600 h-full flex items-center justify-center text-[10px] font-bold text-white overflow-hidden whitespace-nowrap border-l border-white/10"
              >
                {era.internetLife >= 15 ? `Internet: ${era.internetLifeHours}h (${era.internetLife}%)` : `${era.internetLifeHours}h`}
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600 dark:text-zinc-400 pt-1 font-sans">
            <div>
              <span className="font-semibold text-gray-800 dark:text-zinc-200">Integration:</span> {era.integration}
            </div>
            <div>
              <span className="font-semibold text-gray-800 dark:text-zinc-200">Impact:</span> {era.impact}
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div>
          <h5 className="text-xs font-bold text-gray-500 dark:text-zinc-400 tracking-wider uppercase mb-3 font-sans">
            Key Metrics
          </h5>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {era.metrics.map((metric) => (
              <div key={metric.label} className="space-y-1 font-sans">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-700 dark:text-zinc-300 font-medium">{metric.label}</span>
                  <span className="text-gray-500 dark:text-zinc-400 font-semibold">{metric.value}%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.value}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className={`h-full rounded-full ${metric.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
