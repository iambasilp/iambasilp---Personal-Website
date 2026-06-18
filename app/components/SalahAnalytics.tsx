'use client'

import { useMemo } from 'react'

type SalahTracking = {
  date: string
  fajr: number
  dhuhr: number
  asr: number
  maghrib: number
  isha: number
}

type Props = {
  data: SalahTracking[]
  year: number
  month: number
}

const PHASES = [
  { value: 5, label: "Congregation + Quran", color: "bg-emerald-500 dark:bg-emerald-600" },
  { value: 4, label: "Congregation", color: "bg-teal-400 dark:bg-teal-500" },
  { value: 3, label: "On Time", color: "bg-blue-400 dark:bg-blue-500" },
  { value: 2, label: "Prayed", color: "bg-indigo-400 dark:bg-indigo-500" },
  { value: 1, label: "Wudu at Alarm", color: "bg-purple-400 dark:bg-purple-500" },
  { value: 0, label: "Missed", color: "bg-zinc-200 dark:bg-zinc-800" },
]

export default function SalahAnalytics({ data, year, month }: Props) {
  const stats = useMemo(() => {
    const pad = (n: number) => String(n).padStart(2, '0')
    const today = new Date()
    const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`
    
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const monthEndStr = `${year}-${pad(month + 1)}-${pad(daysInMonth)}`
    
    const referenceDateStr = monthEndStr < todayStr ? monthEndStr : todayStr

    // 1. Calculate Streak
    let currentStreak = 0
    let dateObj = new Date(referenceDateStr + 'T12:00:00Z')
    
    // We put a high limit to prevent infinite loops, though the while breaks naturally
    for (let i = 0; i < 10000; i++) {
      const dStr = `${dateObj.getUTCFullYear()}-${pad(dateObj.getUTCMonth() + 1)}-${pad(dateObj.getUTCDate())}`
      const record = data.find(d => d.date === dStr)
      
      const didAnyPrayer = record && (record.fajr > 0 || record.dhuhr > 0 || record.asr > 0 || record.maghrib > 0 || record.isha > 0)
      
      if (!didAnyPrayer) {
        // If it's today, we give leeway if they haven't prayed yet today.
        if (dStr === todayStr && currentStreak === 0) {
          dateObj.setUTCDate(dateObj.getUTCDate() - 1)
          continue
        }
        break // Streak broken
      }
      
      currentStreak++
      dateObj.setUTCDate(dateObj.getUTCDate() - 1)
    }

    // 2. Monthly Stats
    const monthPrefix = `${year}-${pad(month + 1)}-`
    const monthData = data.filter(d => d.date.startsWith(monthPrefix))

    let perfectDays = 0
    let phaseCounts = { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0 }

    monthData.forEach(record => {
      const prayers = [record.fajr, record.dhuhr, record.asr, record.maghrib, record.isha]
      
      // A perfect day is all 5 prayers at Phase 3 (On Time) or higher
      if (prayers.every(p => p >= 3)) {
        perfectDays++
      }

      prayers.forEach(p => {
        phaseCounts[p as keyof typeof phaseCounts]++
      })
    })

    const totalLogged = Object.values(phaseCounts).reduce((a, b) => a + b, 0)

    return { currentStreak, perfectDays, phaseCounts, totalLogged }
  }, [data, year, month])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-content-fade">
      {/* Streak Card */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm flex flex-col justify-between relative overflow-hidden group">
        <div>
          <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Current Streak</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">{stats.currentStreak}</span>
            <span className="text-sm font-medium text-zinc-500">days</span>
          </div>
        </div>
        <p className="text-xs text-zinc-500 mt-4 leading-relaxed max-w-[85%]">
          {stats.currentStreak > 3 
            ? "You're building momentum. Don't break the chain!" 
            : "Every great habit starts with day one."}
        </p>
      </div>

      {/* Perfect Days Card */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm flex flex-col justify-between relative overflow-hidden group">
        <div>
          <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Perfect Days</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">{stats.perfectDays}</span>
            <span className="text-sm font-medium text-zinc-500">this month</span>
          </div>
        </div>
        <p className="text-xs text-zinc-500 mt-4 leading-relaxed max-w-[85%]">
          Days where all 5 prayers were completed on time or in congregation.
        </p>
      </div>

      {/* Phase Distribution */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm flex flex-col justify-between">
        <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">Quality Breakdown</h3>
        
        {stats.totalLogged > 0 ? (
          <div className="space-y-3">
            {/* Minimalist stacked bar */}
            <div className="h-3 w-full rounded-full flex overflow-hidden">
              {PHASES.slice().reverse().map(phase => {
                const count = stats.phaseCounts[phase.value as keyof typeof stats.phaseCounts]
                if (count === 0) return null
                const width = `${(count / stats.totalLogged) * 100}%`
                return (
                  <div key={phase.value} style={{ width }} className={`${phase.color} transition-all duration-500`} title={`${phase.label}: ${count}`} />
                )
              })}
            </div>
            
            {/* Legend */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-2">
              {PHASES.filter(p => p.value > 0).slice(0, 4).map(phase => (
                <div key={phase.value} className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${phase.color}`} />
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 truncate">{phase.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-zinc-400">No data logged this month.</p>
          </div>
        )}
      </div>
    </div>
  )
}
