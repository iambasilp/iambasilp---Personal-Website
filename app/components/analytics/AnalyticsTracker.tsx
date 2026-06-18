'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function AnalyticsTracker() {
  const pathname = usePathname()
  // Track the last path sent to avoid duplicate calls in React Strict Mode
  const lastTrackedPath = useRef<string | null>(null)

  useEffect(() => {
    // Don't track admin routes to keep data clean
    if (pathname.startsWith('/admin')) return
    if (lastTrackedPath.current === pathname) return

    lastTrackedPath.current = pathname

    // Detect device type roughly
    const isMobile = window.innerWidth <= 768
    const device_type = isMobile ? 'Mobile' : 'Desktop'

    const trackView = () => {
      try {
        const payload = JSON.stringify({
          path: pathname,
          referrer: document.referrer || 'Direct',
          device_type,
        })
        
        // Use sendBeacon for silent background tracking (avoids red console errors if server is busy/restarting)
        if (navigator.sendBeacon) {
          const blob = new Blob([payload], { type: 'application/json' })
          navigator.sendBeacon('/api/track', blob)
        } else {
          fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true
          }).catch(() => {})
        }
      } catch (e) {
        // Silent fail
      }
    }

    trackView()
  }, [pathname])

  return null
}
