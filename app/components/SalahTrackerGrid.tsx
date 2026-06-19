'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { createClient } from '../lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import SalahAnalytics from './SalahAnalytics'

type SalahTracking = {
  id?: string
  date: string
  fajr: number
  dhuhr: number
  asr: number
  maghrib: number
  isha: number
}

type Props = {
  initialData: SalahTracking[]
  isAdmin: boolean
  year: number
  month: number
}

const PRAYERS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const

export default function SalahTrackerGrid({ initialData, isAdmin, year, month }: Props) {
  const [data, setData] = useState(initialData)
  const [activePopup, setActivePopup] = useState<{ date: string, prayer: typeof PRAYERS[number], currentValue: number } | null>(null)
  const [voteReward, setVoteReward] = useState<boolean>(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    setData(initialData)
  }, [year, month, initialData])

  // Generate all days in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const existingRecord = data.find(d => d.date === dateStr)
    const dateObj = new Date(year, month, day)
    const weekdayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' })
    return {
      date: dateStr,
      dayNumber: day,
      weekdayName,
      record: existingRecord || {
        date: dateStr,
        fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0
      }
    }
  })

  const setPrayerValue = async (dateStr: string, prayer: typeof PRAYERS[number], newValue: number) => {
    if (!isAdmin) return

    // Close popup immediately
    setActivePopup(null)

    // Trigger identity reward if casting a new "vote"
    const prevRecord = days.find(d => d.date === dateStr)!.record
    if (newValue > 0 && prevRecord[prayer] === 0) {
      setVoteReward(false) // reset animation if triggered quickly
      setTimeout(() => setVoteReward(true), 50)
      setTimeout(() => setVoteReward(false), 3500)
    }

    // Optimistic update
    const updatedRecord = { ...days.find(d => d.date === dateStr)!.record, [prayer]: newValue }
    
    setData(prev => {
      const exists = prev.find(p => p.date === dateStr)
      if (exists) {
        return prev.map(p => p.date === dateStr ? updatedRecord : p)
      }
      return [...prev, updatedRecord]
    })

    // Upsert to Supabase
    const { error } = await supabase
      .from('salah_tracking')
      .upsert({
        date: dateStr,
        [prayer]: newValue,
        updated_at: new Date().toISOString()
      }, { onConflict: 'date' })

    if (error) {
      console.error('Failed to update prayer:', error)
      alert(`Supabase Error: ${error.message || JSON.stringify(error)}\nDetails: ${error.details || 'None'}\nHint: ${error.hint || 'None'}`)
      router.refresh()
    }
  }

  const monthName = new Date(year, month).toLocaleString('en-US', { month: 'long' })
  const todayStr = new Date().toLocaleDateString('en-CA')

  const prevMonthDate = new Date(year, month - 1, 1)
  const nextMonthDate = new Date(year, month + 1, 1)
  const prevY = prevMonthDate.getFullYear()
  const prevM = prevMonthDate.getMonth()
  const nextY = nextMonthDate.getFullYear()
  const nextM = nextMonthDate.getMonth()

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="animate-content-fade max-w-4xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-[#2C2C2A] dark:text-[#E4E3DF] tracking-tight">
            {monthName} {year}
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Daily tracking
          </p>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4 self-start sm:self-auto">
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/50 rounded-lg p-0.5 border border-zinc-200 dark:border-zinc-800">
            <Link 
              href={`/keystone?year=${prevY}&month=${prevM}`} 
              prefetch={true} 
              className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-zinc-700 rounded-md transition-all opacity-80 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
              aria-label="Previous Month"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </Link>
            <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700 mx-0.5"></div>
            <Link 
              href={`/keystone?year=${nextY}&month=${nextM}`} 
              prefetch={true} 
              className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-zinc-700 rounded-md transition-all opacity-80 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
              aria-label="Next Month"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>

          {!isAdmin && (
            <span className="text-xs bg-zinc-200 dark:bg-zinc-800 px-3 py-1.5 rounded-full text-zinc-600 dark:text-zinc-400 font-medium tracking-wide uppercase">
              Public View
            </span>
          )}
        </div>
      </div>

      <SalahAnalytics data={data} year={year} month={month} />
      
      {/* 2 to 4 Column Spacious Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {days.map(({ date, dayNumber, weekdayName, record }) => {
          const isToday = todayStr === date
          return (
            <div 
              key={date} 
              className={`flex flex-col bg-white dark:bg-[#1A1A1A] rounded-xl border ${isToday ? 'border-zinc-400 dark:border-zinc-500 shadow-md ring-1 ring-zinc-400/20' : 'border-zinc-200 dark:border-zinc-800 shadow-sm'} p-3 hover:shadow-md transition-shadow relative overflow-hidden`}
            >
              {/* Header */}
              <div className="flex w-full justify-between items-baseline mb-4">
                <span className={`text-lg font-bold ${isToday ? 'text-zinc-900 dark:text-white' : 'text-zinc-700 dark:text-zinc-200'}`}>
                  {dayNumber}
                </span>
                <span className={`text-xs uppercase tracking-wider font-semibold ${isToday ? 'text-zinc-600 dark:text-zinc-400' : 'text-zinc-400 dark:text-zinc-500'}`}>
                  {weekdayName}
                </span>
              </div>
              
              {/* Prayers row */}
              <div className="flex w-full justify-between items-center mt-auto">
                {PRAYERS.map(prayer => (
                  <button
                    key={prayer}
                    onClick={() => setActivePopup({ date, prayer, currentValue: record[prayer] })}
                    disabled={!isAdmin}
                    className="flex flex-col items-center gap-1 focus:outline-none group/btn"
                    aria-label={`Track ${prayer} for day ${dayNumber}`}
                  >
                    <span className={`text-[9px] sm:text-[10px] uppercase tracking-wider font-bold transition-colors ${record[prayer] === 5 ? 'text-zinc-900 dark:text-zinc-100' : record[prayer] > 0 ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-400 group-hover/btn:text-zinc-600 dark:group-hover/btn:text-zinc-300'}`}>
                      {prayer.charAt(0)}
                    </span>
                    <div className={`w-[22px] h-[22px] sm:w-6 sm:h-6 rounded-md flex items-center justify-center transition-all duration-200 ${
                      record[prayer] === 5
                        ? 'bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 shadow-sm' 
                        : record[prayer] > 0
                        ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 shadow-inner'
                        : 'bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500'
                    } ${!isAdmin && 'cursor-default opacity-80 hover:scale-95'}`}>
                      {record[prayer] === 5 ? (
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : record[prayer] > 0 ? (
                        <span className="text-[10px] sm:text-xs font-bold">{record[prayer]}</span>
                      ) : (
                        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Identity Reward Toast */}
      {mounted && voteReward && createPortal(
        <div 
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] animate-in slide-in-from-bottom-10 fade-in zoom-in duration-500 pointer-events-none"
          role="status"
          aria-live="polite"
        >
          <div className="bg-[#151515] dark:bg-white text-white dark:text-[#151515] px-6 py-4 rounded-2xl shadow-2xl flex flex-col items-center border border-zinc-800 dark:border-zinc-200">
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-70 mb-1">Identity Vote Cast</span>
            <p className="text-sm font-serif italic text-center">
              Evidence of your new identity is building.
            </p>
          </div>
        </div>,
        document.body
      )}

      {/* Phase Progression Modal using React Portal */}
      {activePopup && mounted && createPortal((
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-content-fade">
          <div 
            className="absolute inset-0 bg-zinc-900/10 dark:bg-black/20 backdrop-blur-sm transition-all"
            onClick={() => setActivePopup(null)}
          />
          
          <div className="relative bg-white dark:bg-[#1A1A1A] rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 w-full max-w-sm shadow-2xl transform transition-all" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 id="modal-title" className="text-2xl font-bold text-zinc-900 dark:text-white capitalize tracking-tight">
                  {activePopup.prayer}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {new Date(activePopup.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
              <button 
                onClick={() => setActivePopup(null)}
                className="p-2 -mr-2 -mt-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="space-y-2">
              {[
                { value: 5, label: "Congregation + Quran" },
                { value: 4, label: "Congregation" },
                { value: 3, label: "On Time" },
                { value: 2, label: "Prayed" },
                { value: 1, label: "Wudu at Alarm" },
                { value: 0, label: "Missed" },
              ].map((phase) => {
                const isSelected = activePopup.currentValue === phase.value
                const isAchieved = activePopup.currentValue >= phase.value && phase.value > 0
                
                return (
                  <button 
                    key={phase.value}
                    onClick={() => setPrayerValue(activePopup.date, activePopup.prayer, phase.value)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all duration-200 focus:outline-none ${
                      isSelected
                        ? 'bg-zinc-100 dark:bg-zinc-800/80 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 shadow-sm scale-[1.01]'
                        : isAchieved 
                        ? 'bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-500'
                        : 'bg-transparent border-transparent text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    <span className="font-medium text-[15px] tracking-wide">
                      {phase.label}
                    </span>
                    {isSelected && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      ), document.body)}
    </div>
  )
}
