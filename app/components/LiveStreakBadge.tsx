'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '../lib/supabase/client'
import Link from 'next/link'

type DayRecord = {
  date: string
  lowestPhase: number
}

const PHASES = [
  { value: 0, color: "bg-zinc-200 dark:bg-zinc-800" },
  { value: 1, color: "bg-purple-400 dark:bg-purple-500" },
  { value: 2, color: "bg-indigo-400 dark:bg-indigo-500" },
  { value: 3, color: "bg-blue-400 dark:bg-blue-500" },
  { value: 4, color: "bg-teal-400 dark:bg-teal-500" },
  { value: 5, color: "bg-emerald-500 dark:bg-emerald-600" },
]

const QUOTES = [
  "You do not rise to the level of your goals. You fall to the level of your systems. — James Clear",
  "Success is the product of daily habits—not once-in-a-lifetime transformations. — James Clear",
  "The most effective way to change your habits is to focus not on what you want to achieve, but on who you wish to become. — James Clear",
  "Allah loves consistent deeds, even if they are small. — Prophet Muhammad (PBUH)",
  "Every action you take is a vote for the type of person you wish to become. — James Clear",
  "Consistency is the DNA of mastery.",
  "The hardest thing is to start. The second hardest is to keep going.",
  "A habit is a lifestyle to be lived, not a finish line to be crossed.",
  "Motivation is what gets you started. Habit is what keeps you going.",
  "Do not break the chain.",
  "We are what we repeatedly do. Excellence, then, is not an act, but a habit. — Will Durant"
]

export default function LiveStreakBadge() {
  const [streak, setStreak] = useState<number | null>(null)
  const [heatmap, setHeatmap] = useState<DayRecord[]>([])
  const [isTodayLogged, setIsTodayLogged] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    async function fetchStreak() {
      const supabase = createClient()
      
      const pad = (n: number) => String(n).padStart(2, '0')
      const today = new Date()
      const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`

      const { data } = await supabase
        .from('salah_tracking')
        .select('*')
        .lte('date', todayStr)
        .order('date', { ascending: false })
        
      if (!data) return

      let currentStreak = 0
      let dateObj = new Date(todayStr + 'T12:00:00Z')
      let todayLogged = false
      
      for (let i = 0; i < 10000; i++) {
        const dStr = `${dateObj.getUTCFullYear()}-${pad(dateObj.getUTCMonth() + 1)}-${pad(dateObj.getUTCDate())}`
        const record = data.find(d => d.date === dStr)
        
        const didAnyPrayer = record && (record.fajr > 0 || record.dhuhr > 0 || record.asr > 0 || record.maghrib > 0 || record.isha > 0)
        
        if (dStr === todayStr && didAnyPrayer) todayLogged = true

        if (!didAnyPrayer) {
          if (dStr === todayStr && currentStreak === 0) {
            dateObj.setUTCDate(dateObj.getUTCDate() - 1)
            continue
          }
          break
        }
        
        currentStreak++
        dateObj.setUTCDate(dateObj.getUTCDate() - 1)
      }
      
      setStreak(currentStreak)
      setIsTodayLogged(todayLogged)

      // Calculate 364 days for the massive heatmap
      const grid: DayRecord[] = []
      let gridDate = new Date(todayStr + 'T12:00:00Z')
      
      for (let i = 0; i < 364; i++) {
        const dStr = `${gridDate.getUTCFullYear()}-${pad(gridDate.getUTCMonth() + 1)}-${pad(gridDate.getUTCDate())}`
        const record = data.find(d => d.date === dStr)
        
        let lowest = 0
        if (record) {
          const prayers = [record.fajr, record.dhuhr, record.asr, record.maghrib, record.isha]
          lowest = Math.min(...prayers)
        }
        
        grid.push({ date: dStr, lowestPhase: lowest })
        gridDate.setUTCDate(gridDate.getUTCDate() - 1)
      }
      
      setHeatmap(grid.reverse()) // Oldest to newest
    }
    
    fetchStreak()
  }, [])

  if (streak === null) return null

  // Identity logic & Auras
  let title = "Initiating"
  let auraBadge = "bg-zinc-50 text-zinc-600 border-zinc-200 dark:bg-zinc-800/50 dark:text-zinc-400 dark:border-zinc-700/50"
  let auraDot = "bg-zinc-400"
  let auraTitle = "text-zinc-600 dark:text-zinc-400"

  if (streak >= 4) {
    title = "Building Momentum"
    auraBadge = "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
    auraDot = "bg-blue-500"
    auraTitle = "text-blue-600 dark:text-blue-400"
  }
  if (streak >= 15) {
    title = "Establishing Habit"
    auraBadge = "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20"
    auraDot = "bg-purple-500"
    auraTitle = "text-purple-600 dark:text-purple-400"
  }
  if (streak >= 30) {
    title = "Unbreakable"
    auraBadge = "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
    auraDot = "bg-emerald-500"
    auraTitle = "text-emerald-600 dark:text-emerald-400"
  }

  // Daily Quote logic (changes every day deterministically)
  const todayObj = new Date()
  const startOfYear = new Date(todayObj.getFullYear(), 0, 1)
  const dayOfYear = Math.floor((todayObj.getTime() - startOfYear.getTime()) / 86400000)
  const dailyQuote = QUOTES[dayOfYear % QUOTES.length]

  return (
    <div className="relative inline-block align-baseline" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={`Current habit streak: ${streak} days. Click to view extreme accountability engine.`}
        className={`inline-flex items-center gap-1.5 transition-colors focus:outline-none ${auraTitle} hover:opacity-80`}
        title="View Extreme Accountability Engine"
      >
        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${auraDot}`} aria-hidden="true"></div>
        <span className="font-medium underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-4 cursor-pointer">
          {streak} Day Streak
        </span>
      </button>

      <div 
        role="dialog"
        aria-label="Accountability Dashboard"
        className={`absolute left-0 md:left-auto md:right-0 top-full mt-3 w-[90vw] max-w-[440px] md:w-[440px] bg-white dark:bg-[#151515] border border-[#E8E6E0] dark:border-zinc-800 shadow-2xl rounded-2xl p-5 flex flex-col z-50 transition-all duration-300 transform origin-top-left md:origin-top-right ${isOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible'}`}
      >
        <div className="flex flex-col gap-5">
          {/* Header & Identity */}
          <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-800/60">
            <div>
              <h4 className="text-[10px] font-sans uppercase tracking-[0.2em] text-zinc-400 mb-1">Current Status</h4>
              <div className={`text-sm font-bold tracking-tight ${auraTitle}`}>{title}</div>
            </div>
            <div className="text-right">
              <h4 className="text-[10px] font-sans uppercase tracking-[0.2em] text-zinc-400 mb-1">Total Streak</h4>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{streak} Days</div>
            </div>
          </div>

          {/* 365-Day Massive Heatmap */}
          <div>
            <h4 className="text-[10px] font-sans uppercase tracking-[0.2em] text-zinc-400 mb-3 flex items-center justify-between">
              <span>The Ledger (Past 364 Days)</span>
              <span className="text-[9px] text-zinc-500 normal-case tracking-normal hidden sm:inline">Don't break the chain.</span>
            </h4>
            
            <div className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
              <div 
                className="grid gap-[3px] sm:gap-1" 
                style={{ 
                  gridTemplateRows: 'repeat(7, 1fr)',
                  gridAutoFlow: 'column'
                }}
              >
                {heatmap.map((day) => (
                  <div 
                    key={day.date} 
                    title={`${day.date}: Phase ${day.lowestPhase}`}
                    className={`w-[6px] h-[6px] sm:w-[7px] sm:h-[7px] rounded-[1.5px] ${PHASES[day.lowestPhase]?.color || PHASES[0].color} opacity-90 hover:opacity-100 transition-opacity`}
                  ></div>
                ))}
              </div>
            </div>
            <div className="flex justify-between mt-1 px-1">
              <span className="text-[9px] text-zinc-400 font-medium">1 Year Ago</span>
              <span className="text-[9px] text-zinc-400 font-medium">Today</span>
            </div>
          </div>

          {/* The Variable Reward Vault */}
          <div className="relative pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
            <h4 className="text-[10px] font-sans uppercase tracking-[0.2em] text-zinc-400 mb-2">Daily Wisdom Vault</h4>
            
            <div className="relative overflow-hidden rounded-lg bg-zinc-50 dark:bg-zinc-900/50 p-4 border border-zinc-100 dark:border-zinc-800/50">
              <p className={`text-[13px] font-serif italic text-zinc-600 dark:text-zinc-300 leading-relaxed text-center transition-all duration-700 ${!isTodayLogged ? 'blur-[5px] opacity-40 select-none' : 'blur-0 opacity-100'}`}>
                "{dailyQuote}"
              </p>
              
              {!isTodayLogged && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/20 dark:bg-black/20 backdrop-blur-[1px]">
                  <svg className="w-4 h-4 text-zinc-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Log today to unlock
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <Link 
            href="/keystone" 
            onClick={() => setIsOpen(false)}
            className="text-center text-xs font-semibold text-white dark:text-black bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 py-2.5 rounded-lg transition-colors mt-1"
          >
            Open Full Tracker
          </Link>

        </div>
      </div>
    </div>
  )
}
